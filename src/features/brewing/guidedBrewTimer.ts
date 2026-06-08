import type { RecipeTimelineStep } from '@/features/recipes/recipeRepository';

export type GuidedBrewSessionInput = {
  recipeId: string;
  timelineSteps: RecipeTimelineStep[];
};

export type CompletedBrewStep = {
  label: string;
  completedAtSeconds: number;
  targetSeconds?: number;
};

export type BrewDeviation = {
  label: string;
  secondsLate: number;
};

export type GuidedBrewSession = GuidedBrewSessionInput & {
  currentStepIndex: number;
  currentStep: RecipeTimelineStep | null;
  nextStep: RecipeTimelineStep | null;
  completedSteps: CompletedBrewStep[];
  deviations: BrewDeviation[];
};

export function createGuidedBrewSession(input: GuidedBrewSessionInput): GuidedBrewSession {
  return buildSession({
    ...input,
    currentStepIndex: 0,
    completedSteps: [],
    deviations: [],
  });
}

export function completeCurrentStep(session: GuidedBrewSession, completedAtSeconds: number): GuidedBrewSession {
  const step = session.currentStep;
  if (!step) return session;

  const targetSeconds = targetCompletionSeconds(session, session.currentStepIndex);
  const completedStep = { label: step.label, completedAtSeconds, targetSeconds };
  const secondsLate = targetSeconds === undefined ? 0 : completedAtSeconds - targetSeconds;

  return buildSession({
    ...session,
    currentStepIndex: session.currentStepIndex + 1,
    completedSteps: [...session.completedSteps, completedStep],
    deviations: secondsLate > 0 ? [...session.deviations, { label: step.label, secondsLate }] : session.deviations,
  });
}

function buildSession(session: Omit<GuidedBrewSession, 'currentStep' | 'nextStep'>): GuidedBrewSession {
  return {
    ...session,
    currentStep: session.timelineSteps[session.currentStepIndex] ?? null,
    nextStep: session.timelineSteps[session.currentStepIndex + 1] ?? null,
  };
}

function targetCompletionSeconds(session: GuidedBrewSession, stepIndex: number) {
  const target = session.timelineSteps.slice(0, stepIndex + 1).reduce((total, step) => total + (step.durationSeconds ?? 0), 0);
  return target || undefined;
}
