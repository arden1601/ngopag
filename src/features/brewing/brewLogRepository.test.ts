import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean } from '@/features/beans/beanRepository';
import { createGearItem } from '@/features/gear/gearRepository';
import { createRecipe } from '@/features/recipes/recipeRepository';
import { createBrewLog, getBrewLogWithRecipeContext, listBrewLogs } from './brewLogRepository';

describe('brewLogRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('creates a brew log from a recipe while preserving target and actual brew values', async () => {
    const bean = await createBean({ roaster: 'Onyx', name: 'Ethiopia Worka', tastingNotes: [], inventoryStatus: 'available' });
    const grinder = await createGearItem({ type: 'grinder', name: 'Comandante C40' });
    const recipe = await createRecipe({
      name: 'Morning V60',
      method: 'V60',
      beanId: bean.id,
      gearIds: [grinder.id],
      doseGrams: 15,
      waterGrams: 250,
      grindSetting: { grinderId: grinder.id, value: '22 clicks' },
      timelineSteps: [{ label: 'Bloom', durationSeconds: 45 }],
    });

    const log = await createBrewLog({
      recipeId: recipe.id,
      actualDoseGrams: 15,
      actualYieldGrams: 230,
      actualGrindSetting: '23 clicks',
      actualTimeSeconds: 190,
      notes: 'Slightly slow drawdown',
      completedSteps: [{ label: 'Bloom', completedAtSeconds: 50, targetSeconds: 45 }],
      deviations: [{ label: 'Bloom', secondsLate: 5 }],
    });

    const logs = await listBrewLogs();
    const context = await getBrewLogWithRecipeContext(log.id);

    expect(logs).toHaveLength(1);
    expect(context?.recipe.name).toBe('Morning V60');
    expect(context?.brewLog.targetDoseGrams).toBe(15);
    expect(context?.brewLog.targetWaterGrams).toBe(250);
    expect(context?.brewLog.beanId).toBe(bean.id);
    expect(context?.brewLog.gearIds).toEqual([grinder.id]);
    expect(context?.brewLog.actualGrindSetting).toBe('23 clicks');
    expect(context?.brewLog.deviations).toEqual([{ label: 'Bloom', secondsLate: 5 }]);
  });
});
