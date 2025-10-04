# Constraint System

Research-powered constraint system for workshop layout optimization. Automatically generated from academic findings and expert knowledge.

## Overview

The constraint system transforms JSON research data into executable TypeScript constraints that evaluate workshop layouts based on safety, workflow efficiency, space utilization, and accessibility.

## Architecture

```
constraints/
├── ConstraintFactory.ts        # JSON → TypeScript transformation engine
├── SafetyConstraints.ts        # OSHA/Canadian clearance requirements
├── WorkflowConstraints.ts      # Project-specific adjacency rules
├── MobileToolConstraints.ts    # Dual-position mobile tool constraints
└── types.ts                    # TypeScript type definitions

scoring/
└── MultiObjectiveScoring.ts    # Weighted MCDA scoring (40/25/20/15)
```

## Usage

### Getting Constraints

```typescript
import { SafetyConstraints, WorkflowConstraints, MobileToolConstraints } from '@/data/constraints'

// Get all safety constraints
const safetyConstraints = SafetyConstraints.getAll()

// Get constraints for specific tool
const tableSawConstraints = SafetyConstraints.forTool('table_saw')

// Get workflow constraints for project type
const cabinetryWorkflow = WorkflowConstraints.forProjectType('cabinetry')

// Get mobile tool constraints
const mobileConstraints = MobileToolConstraints.getAll()
```

### Evaluating Layouts

```typescript
import { MultiObjectiveScoring } from '@/data/scoring'
import type { Layout, Workshop } from '@/types'

const score = MultiObjectiveScoring.calculateScore(
  layout,      // Layout to evaluate
  workshop,    // Workshop dimensions
  constraints  // Combined constraints array
)

console.log(score)
// {
//   overall: 85,
//   categories: { safety: 92, workflow: 81, space: 78, accessibility: 88 },
//   violations: ['Table saw front clearance 84" < required 96"'],
//   penalties: 2.5
// }
```

### Building Constraint Sets

```typescript
import { ConstraintFactory, SafetyConstraints, WorkflowConstraints } from '@/data/constraints'

// Combine all constraints with priority ordering
const allConstraints = [
  ...SafetyConstraints.getAll(),           // REQUIRED priority
  ...WorkflowConstraints.forProjectType('cabinetry'), // HIGH/MEDIUM priority
  ...MobileToolConstraints.getAll()        // HIGH priority
]

// Constraints are auto-sorted by priority: REQUIRED > HIGH > MEDIUM > LOW
```

## Constraint Priority System

Constraints use a tiered priority system:

- **REQUIRED**: Must be satisfied (safety clearances, legal minimums)
- **HIGH**: Strong preference (workflow adjacency, mobile tool deployment)
- **MEDIUM**: Moderate preference (distance penalties, storage optimization)
- **LOW**: Weak preference (nice-to-have features)

## Scoring Weights

Multi-objective scoring uses research-validated weights:

- **Safety**: 40% (OSHA/Canadian clearances, accident reduction)
- **Workflow**: 25% (tool adjacency, material flow distance)
- **Space Utilization**: 20% (floor usage, mobile tool efficiency)
- **Accessibility**: 15% (ergonomics, tool reachability)

## Mobile Tool Support

Mobile tools (tools with casters) have dual-position optimization:

- **Deployed Position**: Working clearances (same as stationary tools)
- **Parked Position**: Minimal clearances (30-50% space savings)

```typescript
// Mobile tool constraint evaluates both positions
const mobileConstraint = MobileToolConstraints.forTool('table_saw')

// Deployed: full working clearances required
// Parked: wall-adjacent storage with minimal clearances
```

## Research Data Sources

Constraints are generated from 8 research files (198KB):

- `safety-constraints-findings.json` - OSHA/Canadian guidelines
- `workflow-patterns-findings.json` - Time-motion studies
- `mobile-tools-findings.json` - Space savings research
- `scoring-algorithm-data-findings.json` - MCDA methodology
- `project-patterns-data-findings.json` - Project-specific workflows

## MVP Project Types

The system supports 3 MVP project workflows:

1. **Cabinetry**: Panel breakdown, edgebanding, assembly
2. **Furniture**: Rough milling, joinery, solid wood construction
3. **Kitchen Goods**: Hybrid panel/solid construction

Each project type has specific tool adjacency and distance requirements.

## Example: Complete Evaluation

```typescript
import { SafetyConstraints, WorkflowConstraints, MobileToolConstraints } from '@/data/constraints'
import { MultiObjectiveScoring } from '@/data/scoring'

// 1. Build constraint set
const constraints = [
  ...SafetyConstraints.getAll(),
  ...WorkflowConstraints.forProjectType('cabinetry'),
  ...MobileToolConstraints.getAll()
]

// 2. Evaluate layout
const score = MultiObjectiveScoring.calculateScore(layout, workshop, constraints)

// 3. Check violations
if (score.violations.length > 0) {
  console.log('Layout violations:', score.violations)
}

// 4. Overall quality
console.log(`Layout score: ${score.overall}/100`)
console.log(`Safety: ${score.categories.safety}`)
console.log(`Workflow: ${score.categories.workflow}`)
```

## Performance

- Constraint evaluation: O(n) per constraint, where n = number of tools
- Scoring calculation: <5ms for typical layouts (5-15 tools)
- Constraint generation: Lazy-loaded, cached on first access

## Next Steps

This constraint system is ready for integration with:

- **Phase 5**: Optimization engine (constraint satisfaction solver)
- **Phase 6**: 3D visualization (clearance rendering)
- **Phase 7**: Educational insights (violation explanations)
