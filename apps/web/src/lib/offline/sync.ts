import { offlineDb } from './db';
import type { SyncOperation, SyncEntity, SyncOperationType } from '@matric/shared-types';

export class SyncEngine {
  private isSyncing = false;
  private listeners: ((isOnline: boolean, pendingCount: number) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange());
      window.addEventListener('offline', () => this.handleNetworkChange());
    }
  }

  public subscribe(cb: (isOnline: boolean, pendingCount: number) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.getPendingCount().then((count) => {
      for (const cb of this.listeners) {
        cb(isOnline, count);
      }
    });
  }

  public async getPendingCount(): Promise<number> {
    return await offlineDb.syncQueue.count();
  }

  public async queueOperation(
    entity: SyncEntity,
    type: SyncOperationType,
    entityId: string,
    payload: Record<string, unknown>
  ): Promise<string> {
    const opId = `op-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const op: SyncOperation = {
      operationId: opId,
      entity,
      type,
      entityId,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await offlineDb.syncQueue.put(op);
    this.notify();

    // Trigger sync attempt immediately if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.processQueue();
    }

    return opId;
  }

  public async processQueue(): Promise<void> {
    if (this.isSyncing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    this.isSyncing = true;
    try {
      const pendingOps = await offlineDb.syncQueue.toArray();
      for (const op of pendingOps) {
        try {
          const res = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(op),
          });

          if (res.ok) {
            await offlineDb.syncQueue.delete(op.operationId);
          } else {
            op.retryCount += 1;
            await offlineDb.syncQueue.put(op);
          }
        } catch {
          // Network failure during sync; wait for next reconnect
          break;
        }
      }
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  private handleNetworkChange() {
    this.notify();
    if (navigator.onLine) {
      this.processQueue();
    }
  }
}

export const syncEngine = new SyncEngine();
