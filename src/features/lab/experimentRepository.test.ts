import AsyncStorage from '@react-native-async-storage/async-storage';
import { createExperiment, attachBrewLogToExperiment, markExperimentWinner, getExperiment } from './experimentRepository';

describe('experimentRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('tracks an experiment hypothesis, linked brew logs, and winning brew', async () => {
    const experiment = await createExperiment({
      title: 'Grind finer for V60',
      hypothesis: 'A finer grind improves sweetness without adding bitterness.',
      controlledVariable: 'grind size',
      constants: ['15g dose', '250g water', '94C water'],
    });

    await attachBrewLogToExperiment(experiment.id, 'brew-log-1');
    await attachBrewLogToExperiment(experiment.id, 'brew-log-2');
    await markExperimentWinner(experiment.id, 'brew-log-2', 'Sweeter and cleaner finish');

    const saved = await getExperiment(experiment.id);

    expect(saved?.brewLogIds).toEqual(['brew-log-1', 'brew-log-2']);
    expect(saved?.winnerBrewLogId).toBe('brew-log-2');
    expect(saved?.comparisonNotes).toBe('Sweeter and cleaner finish');
  });
});
