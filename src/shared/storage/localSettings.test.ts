import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadShellLaunchRecord, markShellLaunched } from './localSettings';

describe('local shell persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists launch metadata across app reloads', async () => {
    await expect(loadShellLaunchRecord()).resolves.toBeNull();

    const firstLaunch = await markShellLaunched();
    const reloadedLaunch = await loadShellLaunchRecord();

    expect(reloadedLaunch).toEqual(firstLaunch);
    expect(reloadedLaunch?.syncStatus).toBe('local');
    expect(reloadedLaunch?.schemaVersion).toBe(1);
  });
});
