import { listBeans } from '@/features/beans/beanRepository';
import { listBrewLogs } from '@/features/brewing/brewLogRepository';
import { listGearItems } from '@/features/gear/gearRepository';
import { listExperiments } from '@/features/lab/experimentRepository';
import { listRecipes } from '@/features/recipes/recipeRepository';

export type SearchResultType = 'bean' | 'gear' | 'recipe' | 'brew-log' | 'experiment';

export type SearchResult = {
  type: SearchResultType;
  id: string;
  title: string;
};

export async function searchLibrary(query: string): Promise<SearchResult[]> {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const [beans, gear, recipes, brewLogs, experiments] = await Promise.all([listBeans(), listGearItems(), listRecipes(), listBrewLogs(), listExperiments()]);

  const results: SearchResult[] = [];

  results.push(...beans
    .filter((bean) => includesQuery([bean.roaster, bean.name, bean.origin, bean.region, bean.farmOrProducer, bean.varietal, bean.process, ...bean.tastingNotes], normalizedQuery))
    .map((bean) => ({ type: 'bean' as const, id: bean.id, title: `${bean.roaster} · ${bean.name}` })));

  results.push(...gear
    .filter((item) => includesQuery([item.name, item.type, item.notes, item.burrType, item.settingScale, item.material, item.boilerType, item.filterSize], normalizedQuery))
    .map((item) => ({ type: 'gear' as const, id: item.id, title: item.name })));

  results.push(...recipes
    .filter((recipe) => includesQuery([recipe.name, recipe.method, recipe.notes], normalizedQuery))
    .map((recipe) => ({ type: 'recipe' as const, id: recipe.id, title: recipe.name })));

  results.push(...brewLogs
    .filter((brewLog) => includesQuery([brewLog.notes, brewLog.actualGrindSetting, ...brewLog.deviations?.map((deviation) => deviation.label) ?? []], normalizedQuery))
    .map((brewLog) => {
      const recipe = recipes.find((item) => item.id === brewLog.recipeId);
      return { type: 'brew-log' as const, id: brewLog.id, title: `${recipe?.name ?? 'Recipe'} brew log` };
    }));

  results.push(...experiments
    .filter((experiment) => includesQuery([experiment.title, experiment.hypothesis, experiment.controlledVariable, experiment.comparisonNotes, ...experiment.constants], normalizedQuery))
    .map((experiment) => ({ type: 'experiment' as const, id: experiment.id, title: experiment.title })));

  return results;
}

function includesQuery(values: Array<string | undefined>, query: string) {
  return values.some((value) => normalize(value).includes(query));
}

function normalize(value?: string) {
  return (value ?? '').trim().toLowerCase();
}
