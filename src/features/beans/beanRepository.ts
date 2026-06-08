import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const beansKey = 'ngopag:beans';

export type BeanInput = {
  roaster: string;
  name: string;
  origin?: string;
  roastDate?: string;
  roastLevel?: string;
  tastingNotes: string[];
  inventoryStatus: 'available' | 'low' | 'finished';
};

export type Bean = SyncRecord & BeanInput;

export async function createBean(input: BeanInput): Promise<Bean> {
  const bean: Bean = {
    ...createSyncRecord('bean'),
    ...input,
  };
  const beans = await listBeans();
  await saveBeans([...beans, bean]);
  return bean;
}

export async function listBeans(): Promise<Bean[]> {
  const value = await AsyncStorage.getItem(beansKey);
  return value ? (JSON.parse(value) as Bean[]) : [];
}

async function saveBeans(beans: Bean[]) {
  await AsyncStorage.setItem(beansKey, JSON.stringify(beans));
}
