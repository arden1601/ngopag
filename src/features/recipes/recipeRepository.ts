import AsyncStorage from '@react-native-async-storage/async-storage';
import { listBeans, type Bean } from '@/features/beans/beanRepository';
import { listGearItems, type GearItem } from '@/features/gear/gearRepository';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const recipesKey = 'ngopag:recipes';

export type RecipeInput = {
  name: string;
  method: string;
  beanId?: string;
  gearIds?: string[];
  grindSetting?: {
    grinderId: string;
    value: string;
  };
};

export type Recipe = SyncRecord & RecipeInput;

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
  };
  const recipes = await listRecipes();
  await saveRecipes([...recipes, recipe]);
  return recipe;
}

export async function listRecipes(): Promise<Recipe[]> {
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
