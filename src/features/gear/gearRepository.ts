import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const gearKey = 'ngopag:gear';

export type GearType = 'grinder' | 'brewer' | 'filter' | 'espresso-machine' | 'kettle' | 'scale';

export type GearInput = {
  type: GearType;
  name: string;
  notes?: string;
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
  const value = await AsyncStorage.getItem(gearKey);
  return value ? (JSON.parse(value) as GearItem[]) : [];
}

async function saveGearItems(gear: GearItem[]) {
  await AsyncStorage.setItem(gearKey, JSON.stringify(gear));
}
