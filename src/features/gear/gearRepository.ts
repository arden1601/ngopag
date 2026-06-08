import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const gearKey = 'ngopag:gear';

export type GearType = 'grinder' | 'brewer' | 'filter' | 'espresso-machine' | 'kettle' | 'scale';

export type GearInput = {
  type: GearType;
  name: string;
  notes?: string;
  burrType?: string;
  settingScale?: string;
  material?: string;
  capacityMl?: number;
  boilerType?: string;
  filterSize?: string;
  maxWeightGrams?: number;
};

export type GearItem = SyncRecord & GearInput;

export async function createGearItem(input: GearInput): Promise<GearItem> {
  const gearItem: GearItem = {
    ...createSyncRecord('gear'),
    ...input,
  };
  const gear = await listGearItems();
  await saveGearItems([...gear, gearItem]);
  return gearItem;
}

export async function listGearItems(): Promise<GearItem[]> {
  return (await listAllGearItems()).filter((item) => !item.deletedAt);
}

export async function updateGearItem(gearId: string, updates: Partial<GearInput>): Promise<GearItem | null> {
  const gear = await listAllGearItems();
  const nextGear = gear.map((item) => (item.id === gearId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item));
  await saveGearItems(nextGear);
  return nextGear.find((item) => item.id === gearId) ?? null;
}

export async function deleteGearItem(gearId: string): Promise<void> {
  await updateGearItem(gearId, { deletedAt: new Date().toISOString() } as Partial<GearItem>);
}

async function listAllGearItems(): Promise<GearItem[]> {
  const value = await AsyncStorage.getItem(gearKey);
  return value ? (JSON.parse(value) as GearItem[]) : [];
}

async function saveGearItems(gear: GearItem[]) {
  await AsyncStorage.setItem(gearKey, JSON.stringify(gear));
}
