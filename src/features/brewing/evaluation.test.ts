import { attachEvaluation, type BrewEvaluation } from './evaluation';

describe('evaluation', () => {
  it('attaches sensory scores, tags, defects, and notes to a brew log', () => {
    const evaluation: BrewEvaluation = {
      overallScore: 8,
      acidity: 7,
      sweetness: 8,
      body: 6,
      bitterness: 3,
      aroma: 9,
      tastingTags: ['citrus', 'floral'],
      defects: ['slightly dry'],
      notes: 'Bright and clean after cooling',
    };

    expect(attachEvaluation({ id: 'log-1' }, evaluation)).toEqual({
      id: 'log-1',
      evaluation,
    });
  });
});
