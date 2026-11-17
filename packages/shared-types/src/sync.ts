export type SyncOperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncEntity = 'chapter_progress' | 'study_session' | 'focus_session' | 'quiz_attempt' | 'user_preference';

export interface SyncOperation {
  operationId: string;
  entity: SyncEntity;
  type: SyncOperationType;
  entityId: string;
  payload: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  hasErrors: boolean;
  errors: string[];
}
