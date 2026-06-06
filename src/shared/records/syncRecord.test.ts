import { createSyncRecord } from './syncRecord';

describe('createSyncRecord', () => {
  it('creates sync-ready local record metadata', () => {
    const record = createSyncRecord('settings');

    expect(record.id).toEqual(expect.stringMatching(/^settings_/));
    expect(record.createdAt).toEqual(expect.any(String));
    expect(record.updatedAt).toBe(record.createdAt);
    expect(record.deletedAt).toBeNull();
    expect(record.schemaVersion).toBe(1);
    expect(record.ownerId).toBeNull();
    expect(record.syncStatus).toBe('local');
  });
});
