import AsyncStorage from '@react-native-async-storage/async-storage';
import { createGearItem, listGearItems } from './gearRepository';

describe('gearRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists reusable gear with sync-ready metadata', async () => {
    const grinder = await createGearItem({
      type: 'grinder',
      name: 'Comandante C40',
      notes: 'Red Clix axle',
    });

    const brewer = await createGearItem({
      type: 'brewer',
      name: 'Hario V60 02',
      notes: 'Ceramic dripper',
    });

    await expect(listGearItems()).resolves.toEqual([grinder, brewer]);
    expect(grinder.id).toEqual(expect.stringMatching(/^gear_/));
    expect(grinder.syncStatus).toBe('local');
    expect(grinder.schemaVersion).toBe(1);
  });
});
