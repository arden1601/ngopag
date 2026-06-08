import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSyncRecord, type SyncRecord } from '@/shared/records/syncRecord';

const experimentsKey = 'ngopag:experiments';

export type ExperimentInput = {
  title: string;
  hypothesis: string;
  controlledVariable: string;
  constants: string[];
};

export type Experiment = SyncRecord & ExperimentInput & {
  brewLogIds: string[];
  winnerBrewLogId?: string;
  comparisonNotes?: string;
};

export async function createExperiment(input: ExperimentInput): Promise<Experiment> {
  const experiment: Experiment = {
    ...createSyncRecord('experiment'),
    ...input,
    brewLogIds: [],
  };
  const experiments = await listExperiments();
  await saveExperiments([...experiments, experiment]);
  return experiment;
}

export async function listExperiments(): Promise<Experiment[]> {
  const value = await AsyncStorage.getItem(experimentsKey);
  return value ? (JSON.parse(value) as Experiment[]) : [];
}

export async function getExperiment(experimentId: string): Promise<Experiment | null> {
  return (await listExperiments()).find((experiment) => experiment.id === experimentId) ?? null;
}

export async function attachBrewLogToExperiment(experimentId: string, brewLogId: string): Promise<Experiment | null> {
  return updateExperiment(experimentId, (experiment) => ({
    ...experiment,
    brewLogIds: experiment.brewLogIds.includes(brewLogId) ? experiment.brewLogIds : [...experiment.brewLogIds, brewLogId],
  }));
}

export async function markExperimentWinner(experimentId: string, brewLogId: string, comparisonNotes: string): Promise<Experiment | null> {
  return updateExperiment(experimentId, (experiment) => ({
    ...experiment,
    winnerBrewLogId: brewLogId,
    comparisonNotes,
  }));
}

async function updateExperiment(experimentId: string, update: (experiment: Experiment) => Experiment) {
  const experiments = await listExperiments();
  const nextExperiments = experiments.map((experiment) => (experiment.id === experimentId ? update(experiment) : experiment));
  await saveExperiments(nextExperiments);
  return nextExperiments.find((experiment) => experiment.id === experimentId) ?? null;
}

async function saveExperiments(experiments: Experiment[]) {
  await AsyncStorage.setItem(experimentsKey, JSON.stringify(experiments));
}
