export type SyncStatus = 'local' | 'pending' | 'synced';

export type SyncRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  schemaVersion: number;
  ownerId: string | null;
  syncStatus: SyncStatus;
};

export function createSyncRecord(prefix: string): SyncRecord {
  const now = new Date().toISOString();
  return {
    id: `${prefix}_${Date.now().toString(36)}`,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    schemaVersion: 1,
    ownerId: null,
    syncStatus: 'local',
  };
}
