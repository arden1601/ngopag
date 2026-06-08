import { createRecipe, updateRecipe, type Recipe } from '@/features/recipes/recipeRepository';
import { getBrewLogWithRecipeContext } from './brewLogRepository';

export async function saveBrewLogAsRecipe(brewLogId: string, name: string): Promise<Recipe | null> {
  const context = await getBrewLogWithRecipeContext(brewLogId);
  if (!context) return null;

  const { brewLog, recipe } = context;
  return createRecipe({
    name,
    method: recipe.method,
    beanId: brewLog.beanId,
    gearIds: brewLog.gearIds,
    doseGrams: brewLog.actualDoseGrams ?? brewLog.targetDoseGrams,
    waterGrams: brewLog.targetWaterGrams,
    expectedTimeSeconds: brewLog.actualTimeSeconds ?? brewLog.targetTimeSeconds,
    notes: brewLog.notes,
    timelineSteps: recipe.timelineSteps,
    grindSetting: recipe.grindSetting ? { ...recipe.grindSetting, value: brewLog.actualGrindSetting ?? recipe.grindSetting.value } : undefined,
  });
}

export async function updateRecipeFromBrewLog(brewLogId: string): Promise<Recipe | null> {
  const context = await getBrewLogWithRecipeContext(brewLogId);
  if (!context) return null;

  const { brewLog, recipe } = context;
  return updateRecipe(recipe.id, {
    doseGrams: brewLog.actualDoseGrams ?? brewLog.targetDoseGrams,
    expectedTimeSeconds: brewLog.actualTimeSeconds ?? brewLog.targetTimeSeconds,
    notes: brewLog.notes,
    grindSetting: recipe.grindSetting ? { ...recipe.grindSetting, value: brewLog.actualGrindSetting ?? recipe.grindSetting.value } : undefined,
  });
}
