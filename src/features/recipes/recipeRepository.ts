import AsyncStorage from '@react-native-async-storage/async-storage';
import { listBeans, type Bean } from '@/features/beans/beanRepository';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const recipesKey = 'ngopag:recipes';

export type RecipeInput = {
  name: string;
  method: string;
  beanId: string;
};

export type Recipe = SyncRecord & RecipeInput;

export type RecipeWithBeanContext = {
  recipe: Recipe;
  bean: Bean | null;
};

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

export async function getRecipeWithBeanContext(recipeId: string): Promise<RecipeWithBeanContext | null> {
  const recipes = await listRecipes();
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return null;

  const beans = await listBeans();
  const bean = beans.find((item) => item.id === recipe.beanId) ?? null;
  return { recipe, bean };
}

async function saveRecipes(recipes: Recipe[]) {
  await AsyncStorage.setItem(recipesKey, JSON.stringify(recipes));
}
