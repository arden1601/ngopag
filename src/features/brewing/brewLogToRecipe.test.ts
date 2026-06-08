import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean } from '@/features/beans/beanRepository';
import { createGearItem } from '@/features/gear/gearRepository';
import { createRecipe, getRecipeWithSetupContext } from '@/features/recipes/recipeRepository';
import { createBrewLog } from './brewLogRepository';
import { saveBrewLogAsRecipe, updateRecipeFromBrewLog } from './brewLogToRecipe';

describe('brewLogToRecipe', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('turns a successful brew log into a new recipe or updates the original recipe', async () => {
    const bean = await createBean({ roaster: 'Onyx', name: 'Worka', tastingNotes: [], inventoryStatus: 'available' });
    const grinder = await createGearItem({ type: 'grinder', name: 'Comandante C40' });
    const recipe = await createRecipe({ name: 'Morning V60', method: 'V60', beanId: bean.id, gearIds: [grinder.id], doseGrams: 15, waterGrams: 250, grindSetting: { grinderId: grinder.id, value: '22 clicks' } });
    const brewLog = await createBrewLog({ recipeId: recipe.id, actualDoseGrams: 16, actualYieldGrams: 245, actualGrindSetting: '23 clicks', actualTimeSeconds: 185, notes: 'Best cup this week' });

    const newRecipe = await saveBrewLogAsRecipe(brewLog.id, 'Worka V60 winner');
    const updatedRecipe = await updateRecipeFromBrewLog(brewLog.id);

    const newContext = await getRecipeWithSetupContext(newRecipe?.id ?? '');
    const updatedContext = await getRecipeWithSetupContext(updatedRecipe?.id ?? '');

    expect(newContext?.recipe.name).toBe('Worka V60 winner');
    expect(newContext?.recipe.doseGrams).toBe(16);
    expect(newContext?.recipe.grindSetting?.value).toBe('23 clicks');
    expect(updatedContext?.recipe.name).toBe('Morning V60');
    expect(updatedContext?.recipe.doseGrams).toBe(16);
    expect(updatedContext?.recipe.expectedTimeSeconds).toBe(185);
  });
});
