import { completeCurrentStep, createGuidedBrewSession } from './guidedBrewTimer';

describe('guidedBrewTimer', () => {
  it('guides a brewer through timed recipe steps and records late deviations', () => {
    const session = createGuidedBrewSession({
      recipeId: 'recipe-1',
      timelineSteps: [
        { label: 'Bloom', durationSeconds: 45, targetValue: 50, targetUnit: 'g water' },
        { label: 'Pour', durationSeconds: 90, targetValue: 250, targetUnit: 'g water' },
      ],
    });

    expect(session.currentStep?.label).toBe('Bloom');
    expect(session.nextStep?.label).toBe('Pour');

    const afterBloom = completeCurrentStep(session, 52);

    expect(afterBloom.currentStep?.label).toBe('Pour');
    expect(afterBloom.completedSteps[0]).toEqual({ label: 'Bloom', completedAtSeconds: 52, targetSeconds: 45 });
    expect(afterBloom.deviations).toEqual([{ label: 'Bloom', secondsLate: 7 }]);

    const finished = completeCurrentStep(afterBloom, 130);

    expect(finished.currentStep).toBeNull();
    expect(finished.completedSteps).toHaveLength(2);
  });
});
