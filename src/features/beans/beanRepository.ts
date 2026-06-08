import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const beansKey = 'ngopag:beans';

export type BeanInput = {
  roaster: string;
  name: string;
  origin?: string;
  region?: string;
  farmOrProducer?: string;
  varietal?: string;
  process?: string;
  roastDate?: string;
  roastLevel?: string;
  tastingNotes: string[];
  inventoryStatus: 'available' | 'low' | 'finished';
  amountGrams?: number;
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
  const beans = value ? (JSON.parse(value) as Bean[]) : [];
  return beans.filter((bean) => !bean.deletedAt);
}

export async function updateBean(beanId: string, updates: Partial<BeanInput>): Promise<Bean | null> {
  const beans = await listAllBeans();
  const nextBeans = beans.map((bean) => (bean.id === beanId ? { ...bean, ...updates, updatedAt: new Date().toISOString() } : bean));
  await saveBeans(nextBeans);
  return nextBeans.find((bean) => bean.id === beanId) ?? null;
}

export async function deleteBean(beanId: string): Promise<void> {
  await updateBean(beanId, { deletedAt: new Date().toISOString() } as Partial<Bean>);
}

async function listAllBeans(): Promise<Bean[]> {
  const value = await AsyncStorage.getItem(beansKey);
  return value ? (JSON.parse(value) as Bean[]) : [];
}

async function saveBeans(beans: Bean[]) {
  await AsyncStorage.setItem(beansKey, JSON.stringify(beans));
}
