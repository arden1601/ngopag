# Ngopag PRD

## Problem Statement

Coffee brewing is highly variable. A user can change beans, grind, dose, water temperature, brewer, filter, pressure, timing, agitation, and technique, but most coffee journal tools make those variables difficult to capture consistently. As a result, users forget what worked, repeat failed recipes, lose context about beans and gear, and struggle to understand which changes improved taste.

The user needs a mobile app for their coffee journey that works first as a personal offline coffee lab. It must save manual and espresso recipes, guide brewing from those recipes, record actual brew attempts, evaluate taste, and support experiments. The app should be modular enough to later grow into public/community recipes and deeper coffee lab analytics without replacing the original data model.

## Solution

Build Ngopag, an offline-first React Native + Expo mobile app for personal coffee brewing. The MVP gives users a five-tab app: Today, Recipes, Beans, Gear, and Lab.

Users save beans and reusable gear once, create structured recipes for common and custom brew methods, brew with a recipe-driven guided timer, record actual deviations as brew logs, evaluate the result, and optionally save a successful brew log as a new recipe or use it to update the original recipe.

Ngopag treats a recipe as the target baseline and a brew log as the actual attempt. This distinction enables repeatability, experimentation, and future analytics. Built-in method templates cover espresso, V60/pour-over, AeroPress, French press, moka pot, cold brew, cupping, and generic custom methods. Custom method fields allow the app to support user-defined brewing workflows without hardcoding every form.

The Lab area groups brew logs into experiments around hypotheses such as changing grind size, temperature, ratio, bloom time, agitation, or pressure. Users can compare outcomes, mark a winning brew, and convert that result into a recipe.

The MVP is local-first and does not require an account. However, records should be sync-ready so later phases can add accounts, cloud backup, cross-device sync, public/community recipes, and advanced coffee lab features.

## User Stories

1. As a coffee brewer, I want to use the app offline, so that I can log coffee anywhere without requiring an account or internet.
2. As a coffee brewer, I want a Today tab, so that I can quickly start my next brew.
3. As a coffee brewer, I want to see recent brews on Today, so that I can resume my coffee journey quickly.
4. As a coffee brewer, I want to see active experiments on Today, so that I can continue testing without searching.
5. As a coffee brewer, I want to mark recipes as favorites, so that my common brews are easy to start.
6. As a coffee brewer, I want to create a recipe, so that I can save an intended brew target.
7. As a coffee brewer, I want recipes to be separate from brew logs, so that I can distinguish my plan from the actual result.
8. As a coffee brewer, I want to save manual brew recipes, so that I can repeat pour-over, AeroPress, French press, moka pot, cold brew, and cupping workflows.
9. As an espresso user, I want to save espresso recipes, so that I can track dose, yield, time, pressure notes, and grind.
10. As a coffee brewer, I want to create custom brew methods, so that uncommon workflows can still be tracked.
11. As a coffee brewer, I want built-in method templates, so that creating common recipes is fast.
12. As a coffee brewer, I want custom fields on methods, so that I can record variables that matter to my process.
13. As a coffee brewer, I want recipes to use structured timeline steps, so that the app can guide me during brewing.
14. As a coffee brewer, I want a guided brew timer from a recipe, so that I can follow each step accurately.
15. As a coffee brewer, I want the timer to show the current step, so that I know what to do now.
16. As a coffee brewer, I want the timer to show the next step, so that I can prepare before it starts.
17. As a coffee brewer, I want the timer to show elapsed time, so that I can compare the brew with the target.
18. As a coffee brewer, I want each timeline step to include target values, so that I can follow weight, time, yield, and technique goals.
19. As a coffee brewer, I want to manually complete a step, so that real-world timing can be captured.
20. As a coffee brewer, I want timed steps to auto-progress when appropriate, so that simple flows require fewer taps.
21. As a coffee brewer, I want late or missed steps recorded as deviations, so that the brew log reflects what really happened.
22. As a coffee brewer, I want recipe values prefilled during a brew, so that I do not need to fill a full form while brewing.
23. As a coffee brewer, I want to quickly edit actual grind, temperature, yield, and time, so that common deviations are easy to record.
24. As a coffee brewer, I want to add notes during or after brewing, so that qualitative observations are preserved.
25. As a coffee brewer, I want a brew log created after a guided brew, so that each attempt becomes part of my history.
26. As a coffee brewer, I want to save a brew log only, so that I can keep history without changing recipes.
27. As a coffee brewer, I want to save a brew log as a new recipe, so that successful experiments can become reusable targets.
28. As a coffee brewer, I want to update the original recipe from a brew log, so that my recipe improves over time.
29. As a coffee brewer, I want to attach a brew log to an experiment, so that I can compare it with related attempts.
30. As a coffee brewer, I want a bean library, so that coffee details are saved once and reused.
31. As a coffee brewer, I want to record roaster and coffee name, so that I can identify each bean.
32. As a coffee brewer, I want to record origin, region, farm, or producer, so that bean context is searchable later.
33. As a coffee brewer, I want to record varietal and process, so that I can compare similar coffees.
34. As a coffee brewer, I want to record roast date and roast level, so that I can understand rest age and freshness.
35. As a coffee brewer, I want to record bean tasting notes, so that expected flavors are visible while brewing.
36. As a coffee brewer, I want to track bean inventory status, so that I know what coffee is available.
37. As a coffee brewer, I want recipes and logs to reference beans, so that results can be connected to coffee identity.
38. As a coffee brewer, I want a gear library, so that equipment is saved once instead of manually entered every brew.
39. As a coffee brewer, I want to save grinders, so that grind settings are tied to the correct equipment.
40. As a coffee brewer, I want to save espresso machines, so that espresso logs can reference the correct machine.
41. As a coffee brewer, I want to save brewers and drippers, so that manual recipes can reference the correct brewer.
42. As a coffee brewer, I want to save filters, kettles, and scales, so that repeatability includes important equipment.
43. As a coffee brewer, I want grinder settings to be gear-aware, so that values like clicks or numbers are meaningful.
44. As a coffee brewer, I want recipes to reference saved gear, so that brew setup is repeatable.
45. As a coffee brewer, I want brew logs to reference saved gear, so that actual equipment usage is preserved.
46. As a coffee brewer, I want an evaluation screen after brewing, so that taste feedback is captured while fresh.
47. As a coffee brewer, I want to give an overall score from 1 to 10, so that I can compare brews quickly.
48. As a coffee brewer, I want to score acidity, sweetness, body, bitterness, and aroma, so that I can understand taste dimensions.
49. As a coffee brewer, I want to add tasting tags, so that flavor patterns are searchable.
50. As a coffee brewer, I want to record defects, so that I can identify recurring problems.
51. As a coffee brewer, I want to write free-form tasting notes, so that details not covered by fields are preserved.
52. As a coffee brewer, I want a Lab tab, so that experiments and comparisons live in one place.
53. As a coffee brewer, I want to create an experiment with a hypothesis, so that I can test changes intentionally.
54. As a coffee brewer, I want to choose a controlled variable for an experiment, so that the comparison has focus.
55. As a coffee brewer, I want to record constants in an experiment, so that I know what should not change.
56. As a coffee brewer, I want to attach multiple brew logs to one experiment, so that attempts can be compared.
57. As a coffee brewer, I want to compare experiment outcomes, so that I can see which variable value tasted best.
58. As a coffee brewer, I want basic charts for experiments, so that results are easier to understand visually.
59. As a coffee brewer, I want to mark a winning brew in an experiment, so that the best result is explicit.
60. As a coffee brewer, I want to turn an experiment winner into a recipe, so that learning becomes repeatable.
61. As a coffee brewer, I want search and filtering across recipes, beans, gear, logs, and experiments, so that I can find past work quickly.
62. As a coffee brewer, I want data timestamps, so that my coffee journey has chronological history.
63. As a future signed-in user, I want local records to be sync-ready, so that cloud sync can be added without losing data.
64. As a future community user, I want recipes to be modular and shareable later, so that public recipe publishing can build on the same recipe model.
65. As a future lab user, I want records to preserve detailed variables, so that deeper analytics can be added later.

## Implementation Decisions

- Build the mobile app with React Native and Expo.
- Use an offline-first local database for the MVP.
- Do not require user accounts in v1.
- Shape records for future sync by including stable IDs, timestamps, soft deletion, schema versions, nullable local owner identity, and sync status.
- Organize the app into domain modules for recipes, brews, beans, gear, methods, lab, and settings.
- Provide shared infrastructure for database access, units, conversions, reusable form controls, timer behavior, validation, and chart primitives.
- Use five primary app tabs: Today, Recipes, Beans, Gear, and Lab.
- Treat Recipe as the intended target baseline.
- Treat BrewLog as the actual brew attempt.
- Allow BrewLog records to be saved as new recipes.
- Allow BrewLog records to update their source recipe.
- Make beans first-class records rather than free-text fields.
- Make gear first-class records rather than free-text fields.
- Store gear in a reusable library so users do not re-enter equipment for each activity.
- Make grinder settings gear-aware.
- Support built-in method templates for espresso, V60/pour-over, AeroPress, French press, moka pot, cold brew, cupping, and generic custom brewing.
- Support custom method fields and custom method timeline steps.
- Model recipes as structured timelines rather than simple note blocks.
- Drive the guided brew timer from recipe timeline steps.
- Capture timer events and step completion data into brew logs.
- Prefill brew sessions from recipe targets and only ask users to adjust actual deviations.
- Capture sensory evaluation after brewing with an overall score, taste dimension scores, tasting tags, defects, and notes.
- Add experiment tracking in v1, not as a later feature.
- Model experiments around a hypothesis, controlled variable, constants, linked brew logs, comparison notes, and a winning result.
- Include basic experiment comparison charts in v1.
- Exclude public/community publishing from v1 while keeping recipes shareable in structure.
- Exclude cloud sync from v1 while keeping records sync-ready.
- Exclude account requirement from v1.
- Exclude AI recommendations from v1.
- Exclude barcode scanning and coffee bag OCR from v1.
- Exclude advanced extraction math unless the user manually enters TDS data.

## Testing Decisions

- Test external behavior and user-visible outcomes rather than implementation details.
- Prefer high-level tests around full user flows: create bean, create gear, create recipe, start guided brew, complete brew, evaluate, save log, convert log to recipe, and attach log to experiment.
- Test the recipe-to-brew-log seam because it is the core product boundary between target and actual attempt.
- Test the brew-log-to-recipe seam because successful logs must become reusable recipes without losing important values.
- Test the method-template seam because built-in and custom methods must both produce usable forms and guided timelines.
- Test the timer engine seam because step progression, manual completion, and deviation capture must be reliable.
- Test the gear-reference seam because logs should reference saved gear instead of duplicating manual equipment entry.
- Test the bean-reference seam because recipes and logs should preserve bean context.
- Test the experiment comparison seam because users must be able to attach logs, compare results, and mark a winner.
- Test local persistence behavior because the MVP must work offline.
- Test schema migration behavior once persistent models exist because records include schema versions.
- Use the highest practical seam available: app/user-flow tests for critical flows, repository tests for persistence rules, and pure unit tests for units, conversions, validation, and timer calculations.
- Since the repo is currently at product-design stage, no prior test files exist yet. Implementation should establish testing conventions alongside the first feature modules.

## Out of Scope

- Public/community recipe publishing.
- User following, comments, public ratings, or marketplace-style recipes.
- Required account creation.
- Cloud backup and cross-device sync.
- AI brew recommendations.
- Coffee bag photo capture, barcode scanning, or OCR.
- Voice-note capture.
- Advanced TDS/extraction-yield workflows unless TDS is entered manually.
- Water chemistry tracking beyond future-ready extensibility.
- Grinder calibration workflows beyond gear-aware grinder settings.
- Native-only implementation.
- Web app implementation.

## Further Notes

Ngopag should feel excellent for one person brewing coffee daily. The MVP should not become a social app or overbuilt analytics suite too early. The architecture should still keep community and advanced lab features possible by making recipes, methods, logs, beans, gear, and experiments modular from the start.

The product name is Ngopag. The earlier working concept names were coffee journey and coffee lab; the final app name for this PRD is Ngopag.
