import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean } from '@/features/beans/beanRepository';
import { createGearItem } from '@/features/gear/gearRepository';
import { createRecipe, getRecipeWithSetupContext } from './recipeRepository';

describe('recipeRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('creates a structured recipe with target values and timeline steps', async () => {
    const bean = await createBean({
      roaster: 'Onyx',
      name: 'Ethiopia Worka',
      origin: 'Ethiopia',
      roastDate: '2026-06-02',
      roastLevel: 'light',
      tastingNotes: ['bergamot', 'honey'],
      inventoryStatus: 'available',
    });
    const grinder = await createGearItem({ type: 'grinder', name: 'Comandante C40' });
    const brewer = await createGearItem({ type: 'brewer', name: 'Hario V60 02' });

    const recipe = await createRecipe({
      name: 'Morning V60',
      method: 'V60',
      beanId: bean.id,
      gearIds: [grinder.id, brewer.id],
      doseGrams: 15,
      waterGrams: 250,
      waterTemperatureCelsius: 94,
      expectedTimeSeconds: 180,
      notes: 'Light agitation after bloom',
      favorite: true,
      grindSetting: { grinderId: grinder.id, value: '22 clicks' },
      timelineSteps: [
        { label: 'Bloom', durationSeconds: 45, targetValue: 50, targetUnit: 'g water' },
        { label: 'Pour to target', durationSeconds: 90, targetValue: 250, targetUnit: 'g water' },
      ],
    });

    const setup = await getRecipeWithSetupContext(recipe.id);

    expect(setup?.recipe.beanId).toBe(bean.id);
    expect(setup?.bean?.name).toBe('Ethiopia Worka');
    expect(setup?.gear.map((item) => item.name)).toEqual(['Comandante C40', 'Hario V60 02']);
    expect(setup?.recipe.grindSetting).toEqual({ grinderId: grinder.id, value: '22 clicks' });
    expect(setup?.recipe.doseGrams).toBe(15);
    expect(setup?.recipe.waterGrams).toBe(250);
    expect(setup?.recipe.brewRatio).toBe('1:16.7');
    expect(setup?.recipe.favorite).toBe(true);
    expect(setup?.recipe.timelineSteps).toEqual([
      { label: 'Bloom', durationSeconds: 45, targetValue: 50, targetUnit: 'g water' },
      { label: 'Pour to target', durationSeconds: 90, targetValue: 250, targetUnit: 'g water' },
    ]);
  });
});
