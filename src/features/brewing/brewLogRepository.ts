import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';
import { listRecipes, type Recipe } from '@/features/recipes/recipeRepository';
import type { BrewDeviation, CompletedBrewStep } from './guidedBrewTimer';

const brewLogsKey = 'ngopag:brew-logs';

export type BrewLogInput = {
  recipeId: string;
  actualDoseGrams?: number;
  actualYieldGrams?: number;
  actualGrindSetting?: string;
  actualWaterTemperatureCelsius?: number;
  actualTimeSeconds?: number;
  notes?: string;
  completedSteps?: CompletedBrewStep[];
  deviations?: BrewDeviation[];
};

export type BrewLog = SyncRecord & BrewLogInput & {
  beanId?: string;
  gearIds?: string[];
  targetDoseGrams?: number;
  targetWaterGrams?: number;
  targetGrindSetting?: string;
  targetTimeSeconds?: number;
};

export type BrewLogWithRecipeContext = {
  brewLog: BrewLog;
  recipe: Recipe;
};

export async function createBrewLog(input: BrewLogInput): Promise<BrewLog> {
  const recipe = (await listRecipes()).find((item) => item.id === input.recipeId);
  const brewLog: BrewLog = {
    ...createSyncRecord('brew-log'),
    ...input,
    beanId: recipe?.beanId,
    gearIds: recipe?.gearIds,
    targetDoseGrams: recipe?.doseGrams,
    targetWaterGrams: recipe?.waterGrams,
    targetGrindSetting: recipe?.grindSetting?.value,
    targetTimeSeconds: recipe?.expectedTimeSeconds,
  };
  const logs = await listBrewLogs();
  await saveBrewLogs([...logs, brewLog]);
  return brewLog;
}

export async function listBrewLogs(): Promise<BrewLog[]> {
  const value = await AsyncStorage.getItem(brewLogsKey);
  return value ? (JSON.parse(value) as BrewLog[]) : [];
}

export async function getBrewLogWithRecipeContext(brewLogId: string): Promise<BrewLogWithRecipeContext | null> {
  const brewLog = (await listBrewLogs()).find((item) => item.id === brewLogId);
  if (!brewLog) return null;

  const recipe = (await listRecipes()).find((item) => item.id === brewLog.recipeId);
  if (!recipe) return null;

  return { brewLog, recipe };
}

async function saveBrewLogs(logs: BrewLog[]) {
  await AsyncStorage.setItem(brewLogsKey, JSON.stringify(logs));
}
