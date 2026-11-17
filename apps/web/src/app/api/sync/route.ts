import { NextResponse } from 'next/server';
import { z } from 'zod';

const SyncOperationSchema = z.object({
  operationId: z.string().min(1, 'operationId is required'),
  entity: z.enum([
    'chapter_progress',
    'study_session',
    'focus_session',
    'quiz_attempt',
    'user_preference',
  ]),
  type: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  entityId: z.string().min(1, 'entityId is required'),
  payload: z.record(z.string(), z.any()),
  clientTimestamp: z.union([z.string(), z.number()]).optional(),
});

const SyncBatchSchema = z.union([
  SyncOperationSchema,
  z.object({
    operations: z.array(SyncOperationSchema),
  }),
]);

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parseResult = SyncBatchSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const now = new Date().toISOString();

    if ('operations' in data) {
      return NextResponse.json({
        success: true,
        count: data.operations.length,
        operationIds: data.operations.map((op) => op.operationId),
        syncedAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      operationId: data.operationId,
      entity: data.entity,
      type: data.type,
      syncedAt: now,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sync processing failed' }, { status: 500 });
  }
}
