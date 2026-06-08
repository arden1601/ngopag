import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean, listBeans } from './beanRepository';

describe('beanRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists a coffee bean with sync-ready metadata', async () => {
    const bean = await createBean({
      roaster: 'Friedhats',
      name: 'Colombia El Paraiso',
      origin: 'Colombia',
      region: 'Cauca',
      farmOrProducer: 'El Paraiso',
      varietal: 'Castillo',
      process: 'thermal shock washed',
      roastDate: '2026-06-01',
      roastLevel: 'light',
      tastingNotes: ['mango', 'jasmine'],
      inventoryStatus: 'available',
      amountGrams: 250,
    });

    const beans = await listBeans();

    expect(beans).toEqual([bean]);
    expect(bean.id).toEqual(expect.stringMatching(/^bean_/));
    expect(bean.syncStatus).toBe('local');
    expect(bean.schemaVersion).toBe(1);
    expect(bean.farmOrProducer).toBe('El Paraiso');
    expect(bean.amountGrams).toBe(250);
  });
});
