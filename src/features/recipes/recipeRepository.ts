import AsyncStorage from '@react-native-async-storage/async-storage';
import { listBeans, type Bean } from '@/features/beans/beanRepository';
import { listGearItems, type GearItem } from '@/features/gear/gearRepository';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const recipesKey = 'ngopag:recipes';

export type RecipeTimelineStep = {
  label: string;
  durationSeconds?: number;
  targetValue?: number;
  targetUnit?: string;
};

export type RecipeInput = {
  name: string;
  method: string;
  beanId?: string;
  gearIds?: string[];
  doseGrams?: number;
  waterGrams?: number;
  waterTemperatureCelsius?: number;
  expectedTimeSeconds?: number;
  pressureBars?: number;
  preinfusionSeconds?: number;
  notes?: string;
  favorite?: boolean;
  timelineSteps?: RecipeTimelineStep[];
  grindSetting?: {
    grinderId: string;
    value: string;
  };
};

export type Recipe = SyncRecord & RecipeInput & {
  brewRatio?: string;
};

export type RecipeWithSetupContext = {
  recipe: Recipe;
  bean: Bean | null;
  gear: GearItem[];
};

export type RecipeWithBeanContext = RecipeWithSetupContext;

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const recipe: Recipe = {
    ...createSyncRecord('recipe'),
    ...input,
    brewRatio: calculateBrewRatio(input.doseGrams, input.waterGrams),
  };
  const recipes = await listRecipes();
  await saveRecipes([...recipes, recipe]);
  return recipe;
}

export async function listRecipes(): Promise<Recipe[]> {
  return (await listAllRecipes()).filter((recipe) => !recipe.deletedAt);
}

export async function updateRecipe(recipeId: string, updates: Partial<RecipeInput>): Promise<Recipe | null> {
  const recipes = await listAllRecipes();
  const nextRecipes = recipes.map((recipe) => (recipe.id === recipeId ? { ...recipe, ...updates, updatedAt: new Date().toISOString() } : recipe));
  await saveRecipes(nextRecipes);
  return nextRecipes.find((recipe) => recipe.id === recipeId) ?? null;
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await updateRecipe(recipeId, { deletedAt: new Date().toISOString() } as Partial<Recipe>);
}

async function listAllRecipes(): Promise<Recipe[]> {
  const value = await AsyncStorage.getItem(recipesKey);
  return value ? (JSON.parse(value) as Recipe[]) : [];
}

export async function getRecipeWithSetupContext(recipeId: string): Promise<RecipeWithSetupContext | null> {
  const recipes = await listRecipes();
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return null;

  const beans = await listBeans();
  const bean = beans.find((item) => item.id === recipe.beanId) ?? null;
  const allGear = await listGearItems();
  const gearIds = recipe.gearIds ?? [];
  const gear = gearIds
    .map((gearId) => allGear.find((item) => item.id === gearId))
    .filter((item): item is GearItem => Boolean(item));

  return { recipe, bean, gear };
}

export async function getRecipeWithBeanContext(recipeId: string): Promise<RecipeWithBeanContext | null> {
  return getRecipeWithSetupContext(recipeId);
}

async function saveRecipes(recipes: Recipe[]) {
  await AsyncStorage.setItem(recipesKey, JSON.stringify(recipes));
}

function calculateBrewRatio(doseGrams?: number, waterGrams?: number) {
  if (!doseGrams || !waterGrams) return undefined;
  return `1:${(waterGrams / doseGrams).toFixed(1)}`;
}
