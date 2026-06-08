import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean, deleteBean, listBeans, updateBean } from '@/features/beans/beanRepository';
import { createGearItem, deleteGearItem, listGearItems, updateGearItem } from '@/features/gear/gearRepository';
import { createRecipe, deleteRecipe, listRecipes, updateRecipe } from '@/features/recipes/recipeRepository';

describe('library record editing', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('lets a brewer edit and soft-delete beans, gear, and recipes', async () => {
    const bean = await createBean({ roaster: 'Onyx', name: 'Worka', tastingNotes: [], inventoryStatus: 'available' });
    const gear = await createGearItem({ type: 'grinder', name: 'C40' });
    const recipe = await createRecipe({ name: 'V60', method: 'V60', beanId: bean.id, gearIds: [gear.id] });

    await updateBean(bean.id, { name: 'Ethiopia Worka' });
    await updateGearItem(gear.id, { name: 'Comandante C40' });
    await updateRecipe(recipe.id, { name: 'Morning V60', favorite: true });

    expect((await listBeans())[0].name).toBe('Ethiopia Worka');
    expect((await listGearItems())[0].name).toBe('Comandante C40');
    expect((await listRecipes())[0].favorite).toBe(true);

    await deleteBean(bean.id);
    await deleteGearItem(gear.id);
    await deleteRecipe(recipe.id);

    expect(await listBeans()).toEqual([]);
    expect(await listGearItems()).toEqual([]);
    expect(await listRecipes()).toEqual([]);
  });
});
