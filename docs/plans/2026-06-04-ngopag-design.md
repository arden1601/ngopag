# Ngopag Design

## Overview

Ngopag is an offline-first mobile coffee lab for personal brewing. The first version focuses on daily personal use: save beans and gear, create structured recipes, brew with a guided timer, record actual brew logs, evaluate taste, and turn successful brews back into reusable recipes.

The product starts as a personal journal/lab, but the architecture should prepare for later account sync, community recipes, and advanced coffee lab analytics.

## Product Shape

Primary app tabs:

- **Today**: quick start from recent/favorite recipes, active experiments, recent brews.
- **Recipes**: saved target recipes and method templates.
- **Beans**: bean inventory and coffee details.
- **Gear**: saved grinders, brewers, espresso machines, filters, kettles, scales, etc.
- **Lab**: experiments, comparisons, trends, and insights.

Core workflow:

1. Add beans and gear.
2. Create a structured recipe.
3. Start guided brew from the recipe.
4. Record actual deviations during/after brewing.
5. Evaluate taste.
6. Save log, save as new recipe, update original recipe, or attach to an experiment.

## Architecture

Use React Native with Expo.

Use a modular local-first architecture. Each domain owns its model, screens, validation, and repository:

- `recipes`
- `brews`
- `beans`
- `gear`
- `methods`
- `lab`
- `settings`

Shared modules should handle:

- local database access
- sync-ready IDs and metadata
- units and conversions
- reusable form fields
- timer engine
- chart primitives
- validation helpers

Even before sync exists, records should include:

- `id`
- `createdAt`
- `updatedAt`
- `deletedAt`
- `schemaVersion`
- `ownerId` nullable/local-only for now
- `syncStatus` for future sync

This keeps v1 offline-first while avoiding a rewrite for accounts or community features later.

## Core Data Model

### Bean

Tracks coffee inventory and context:

- roaster
- name
- origin
- region/farm/producer
- varietal
- process
- roast date
- roast level
- tasting notes
- inventory status
- amount remaining

### GearItem

Saved equipment library. Brew logs reference gear instead of asking users to re-enter it every time.

Examples:

- grinder
- burr set
- espresso machine
- brewer/dripper
- filter
- kettle
- scale

Grinder settings should be gear-aware because values like “15 clicks” only make sense for a specific grinder.

### BrewMethod

Built-in method templates plus custom-capable schema.

Built-ins:

- espresso
- V60 / pour-over
- AeroPress
- French press
- moka pot
- cold brew
- cupping
- generic custom

Each method defines recommended fields, metrics, and step types. Users can add custom fields or create custom methods without changing app code.

### Recipe

A recipe is the intended target baseline.

Contains:

- method
- optional bean
- optional gear set
- dose
- water amount or beverage yield
- ratio
- grind target
- temperature
- pressure/preinfusion where applicable
- expected time
- structured timeline steps
- target tasting profile
- notes

### BrewLog

A brew log is the actual attempt.

It copies target values from a recipe, then records actuals and deviations:

- actual dose/yield/ratio
- actual grind/temp/time
- timer events
- step completion times
- gear used
- bean used
- sensory evaluation
- notes
- defects

A brew log can be saved as a new recipe or used to update the source recipe.

### Experiment

Groups brew logs around a hypothesis.

Examples:

- “Lower water temp improves sweetness.”
- “Finer grind improves body without adding bitterness.”
- “Longer bloom improves clarity.”

Tracks:

- hypothesis
- controlled variable
- constants
- linked brew logs
- comparison notes
- winner/result
- recipe update action

## Guided Brewing UX

The recipe should drive the brew session.

User taps a recipe, then **Start Brew**. The app opens a timer-guided flow showing:

- current step
- next step
- elapsed time
- target values
- quick deviation controls

Example V60 timeline:

1. Rinse filter.
2. Add coffee.
3. Bloom for 45s.
4. Pour to 120g by 1:15.
5. Pour to 250g by 2:00.
6. Drawdown target 3:00.

Example espresso timeline:

1. Dose.
2. Grind/distribute/tamp.
3. Start shot.
4. Track preinfusion if applicable.
5. Stop at target yield.
6. Record time and taste.

During brewing, avoid a full form. Most fields come from the recipe. The user only adjusts common deviations like grind, temp, output, time, and notes.

Step completion can be automatic by timer or manual tap. Missed or late steps are saved as deviations in the brew log.

After brewing, show quick evaluation:

- overall score 1–10
- acidity
- sweetness
- body
- bitterness
- aroma
- tasting tags
- defects
- notes

Then ask what to do:

- save log only
- save as new recipe
- update original recipe
- attach to experiment

## MVP Scope

Include in v1:

- offline local database
- five-tab navigation
- bean library
- gear library
- method templates
- custom method fields
- structured recipes
- guided brew timer
- brew logs
- sensory evaluation
- experiments
- basic experiment comparison charts

Avoid in v1:

- community publishing
- cloud sync
- account requirement
- AI recommendations
- marketplace recipes
- barcode scanning
- advanced extraction math unless TDS is manually entered

## Roadmap

### Phase 1: Personal Lab MVP

Build the offline-first personal workflow with beans, gear, recipes, guided brewing, logs, evaluations, and experiments.

### Phase 2: Sync and Account

Add sign in, cloud backup, cross-device sync, and account-owned gear/bean libraries.

### Phase 3: Community

Add public recipe publishing, cloning, following users, comments, and ratings.

### Phase 4: Advanced Lab

Add TDS/extraction yield, water chemistry, grinder calibration, deeper filters, correlations, and richer charts.

### Phase 5: Assisted Capture and Recommendations

Add photo/OCR for coffee bags, voice notes, and suggested next brew adjustments based on experiment history.

## Design Principle

Ngopag should feel excellent for one person brewing coffee daily. Community and advanced lab features should extend the same models instead of replacing them.
