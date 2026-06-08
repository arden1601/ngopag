import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBean } from '@/features/beans/beanRepository';
import { createBrewLog } from '@/features/brewing/brewLogRepository';
import { createGearItem } from '@/features/gear/gearRepository';
import { createExperiment } from '@/features/lab/experimentRepository';
import { createRecipe } from '@/features/recipes/recipeRepository';
import { searchLibrary } from './searchRepository';

describe('searchRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('searches across beans, gear, recipes, brew logs, and experiments', async () => {
    const bean = await createBean({ roaster: 'Onyx', name: 'Ethiopia Worka', tastingNotes: ['bergamot'], inventoryStatus: 'available' });
    const gear = await createGearItem({ type: 'grinder', name: 'Comandante C40' });
    const recipe = await createRecipe({ name: 'Morning V60', method: 'V60', beanId: bean.id, gearIds: [gear.id] });
    await createBrewLog({ recipeId: recipe.id, notes: 'Bright bergamot finish' });
    await createExperiment({ title: 'Bloom test', hypothesis: 'Long bloom improves florals', controlledVariable: 'bloom time', constants: ['same beans'] });

    const results = await searchLibrary('bergamot');

    expect(results.map((result) => result.type)).toEqual(['bean', 'brew-log']);
    expect(results.map((result) => result.title)).toEqual(['Onyx · Ethiopia Worka', 'Morning V60 brew log']);
  });
});
