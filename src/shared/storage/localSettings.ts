import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const shellLaunchKey = 'ngopag:shell-launch';

export async function markShellLaunched(): Promise<SyncRecord> {
  const existing = await loadShellLaunchRecord();
  if (existing) return existing;

  const record = createSyncRecord('settings');
  await AsyncStorage.setItem(shellLaunchKey, JSON.stringify(record));
  return record;
}

export async function loadShellLaunchRecord(): Promise<SyncRecord | null> {
  const value = await AsyncStorage.getItem(shellLaunchKey);
  return value ? (JSON.parse(value) as SyncRecord) : null;
}
