import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean } from '@/features/beans/beanRepository';
import { createRecipe, getRecipeWithBeanContext } from './recipeRepository';

describe('recipeRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('creates a minimal recipe that references a saved bean', async () => {
    const bean = await createBean({
      roaster: 'Onyx',
      name: 'Ethiopia Worka',
      origin: 'Ethiopia',
      roastDate: '2026-06-02',
      roastLevel: 'light',
      tastingNotes: ['bergamot', 'honey'],
      inventoryStatus: 'available',
    });

    const recipe = await createRecipe({
      name: 'Morning V60',
      method: 'V60',
      beanId: bean.id,
    });

    const withBean = await getRecipeWithBeanContext(recipe.id);

    expect(withBean?.recipe.beanId).toBe(bean.id);
    expect(withBean?.bean?.name).toBe('Ethiopia Worka');
    expect(withBean?.bean?.roaster).toBe('Onyx');
  });
});
