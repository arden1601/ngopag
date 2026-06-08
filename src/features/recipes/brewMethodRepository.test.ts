import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBrewMethod, listBrewMethods } from './brewMethodRepository';

describe('brewMethodRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('lists built-in brew method templates and lets a brewer add a custom method', async () => {
    const initialMethods = await listBrewMethods();

    expect(initialMethods.map((method) => method.name)).toEqual([
      'Espresso',
      'V60',
      'AeroPress',
      'French press',
      'Moka pot',
      'Cold brew',
      'Cupping',
      'Custom',
    ]);
    expect(initialMethods.find((method) => method.name === 'V60')?.timelineStepTemplates).toEqual(['Bloom', 'Pour', 'Drawdown']);

    await createBrewMethod({
      name: 'Origami dripper',
      type: 'custom',
      recommendedFields: ['doseGrams', 'waterGrams', 'grindSetting'],
      timelineStepTemplates: ['Bloom', 'Circle pour', 'Center pour'],
      customFields: ['paper filter fold'],
    });

    const methods = await listBrewMethods();

    expect(methods.map((method) => method.name)).toContain('Origami dripper');
    expect(methods.find((method) => method.name === 'Origami dripper')?.customFields).toEqual(['paper filter fold']);
  });
});
