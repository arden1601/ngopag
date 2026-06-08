export type BrewEvaluation = {
  overallScore: number;
  acidity: number;
  sweetness: number;
  body: number;
  bitterness: number;
  aroma: number;
  tastingTags: string[];
  defects: string[];
  notes?: string;
};

export type EvaluatedBrewLog<TBrewLog> = TBrewLog & {
  evaluation: BrewEvaluation;
};

export function attachEvaluation<TBrewLog>(brewLog: TBrewLog, evaluation: BrewEvaluation): EvaluatedBrewLog<TBrewLog> {
  return { ...brewLog, evaluation };
}
