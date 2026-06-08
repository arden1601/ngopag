import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const brewMethodsKey = 'ngopag:brew-methods';

export type BrewMethodType = 'built-in' | 'custom';

export type BrewMethodInput = {
  name: string;
  type: BrewMethodType;
  recommendedFields: string[];
  timelineStepTemplates: string[];
  customFields?: string[];
};

export type BrewMethod = SyncRecord & BrewMethodInput;

const builtInMethods: BrewMethod[] = [
  createBuiltIn('Espresso', ['doseGrams', 'yieldGrams', 'expectedTimeSeconds', 'pressureBars', 'preinfusionSeconds', 'grindSetting'], ['Preinfuse', 'Extract']),
  createBuiltIn('V60', ['doseGrams', 'waterGrams', 'waterTemperatureCelsius', 'grindSetting'], ['Bloom', 'Pour', 'Drawdown']),
  createBuiltIn('AeroPress', ['doseGrams', 'waterGrams', 'waterTemperatureCelsius', 'grindSetting'], ['Bloom', 'Steep', 'Press']),
  createBuiltIn('French press', ['doseGrams', 'waterGrams', 'waterTemperatureCelsius', 'grindSetting'], ['Steep', 'Break crust', 'Plunge']),
  createBuiltIn('Moka pot', ['doseGrams', 'waterGrams', 'grindSetting'], ['Fill', 'Heat', 'Finish']),
  createBuiltIn('Cold brew', ['doseGrams', 'waterGrams', 'expectedTimeSeconds', 'grindSetting'], ['Combine', 'Steep', 'Filter']),
  createBuiltIn('Cupping', ['doseGrams', 'waterGrams', 'waterTemperatureCelsius'], ['Pour', 'Break crust', 'Taste']),
  createBuiltIn('Custom', ['doseGrams', 'waterGrams', 'notes'], []),
];

export async function createBrewMethod(input: BrewMethodInput): Promise<BrewMethod> {
  const method: BrewMethod = {
    ...createSyncRecord('brew-method'),
    ...input,
  };
  const customMethods = await listCustomBrewMethods();
  await saveCustomBrewMethods([...customMethods, method]);
  return method;
}

export async function listBrewMethods(): Promise<BrewMethod[]> {
  return [...builtInMethods, ...(await listCustomBrewMethods())];
}

async function listCustomBrewMethods(): Promise<BrewMethod[]> {
  const value = await AsyncStorage.getItem(brewMethodsKey);
  return value ? (JSON.parse(value) as BrewMethod[]) : [];
}

async function saveCustomBrewMethods(methods: BrewMethod[]) {
  await AsyncStorage.setItem(brewMethodsKey, JSON.stringify(methods));
}

function createBuiltIn(name: string, recommendedFields: string[], timelineStepTemplates: string[]): BrewMethod {
  return {
    ...createSyncRecord('brew-method'),
    name,
    type: 'built-in',
    recommendedFields,
    timelineStepTemplates,
  };
}
