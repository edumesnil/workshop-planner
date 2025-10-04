# Phase 1: Research & Knowledge Base

**Duration**: Week 1-2  
**Status**: IN PROGRESS

## Overview

Build the foundational research-powered intelligence that drives the optimization engine. This phase focuses on converting academic findings and expert knowledge into structured data and constraint systems.

## Project Setup ✅ COMPLETED

- [x] Initialize Vite + React + TypeScript project
- [x] Set up development environment with path mapping
- [x] Install core dependencies (React Three Fiber, Radix UI, Transformers.js)
- [x] Basic component architecture and routing
- [x] Zustand state management foundation
- [x] Documentation alignment (README, CLAUDE.md, specs)

## Workshop Optimization Research ✅ COMPLETED

### Safety Research ✅
- [x] OSHA/Canadian guidelines for woodworking tool clearances
- [x] Accident prevention studies with quantified reduction percentages
- [x] Fire safety and combustible dust protocols (deferred: ventilation implementation)
- [x] Electrical safety standards (deferred: power circuit planning)
- [x] Stability requirements (deferred: post-MVP implementation)

### Workflow Research ✅
- [x] Time-motion studies for 12 project types (cabinetry, furniture, millwork, etc.)
- [x] Lean + SLP workflow optimization with quantified metrics (16.9% time reduction)
- [x] Tool sequence patterns for MVP workflows (cabinetry, furniture, kitchen goods)
- [x] Adjacency and distance optimization rules
- [x] **Mobile tools workflow advantages** with 30-50% space savings data

### Space Optimization Research ✅
- [x] Small workshop space utilization (30-50% mobile tool savings)
- [x] Tool placement efficiency with academic sources
- [x] Storage density and workflow optimization
- [x] Basement workshop considerations (213" × 103" template)
- [x] Mobile tool space savings and flexibility analysis

## Knowledge Base Development 🔄 IN PROGRESS

### Data Transformation Strategy
**Approach**: Transform JSON research findings → TypeScript constraint functions

**Current State:**
- ✅ JSON research files completed (`src/data/research/*-findings.json`)
- 🔄 ConstraintFactory to generate executable constraints from JSON
- 🔄 TypeScript types for constraint system

**How it works:**
1. JSON stores raw research data (clearances, distances, priorities)
2. ConstraintFactory reads JSON at build time
3. Generates TypeScript constraint objects with `evaluate()` functions
4. Engine executes constraints on tool positions, returns scores

### File Structure (Updated)
```
src/data/
├── research/                        # ✅ COMPLETED - JSON findings
│   ├── safety-constraints-findings.json
│   ├── workflow-patterns-findings.json
│   ├── mobile-tools-findings.json
│   └── scoring-algorithm-data-findings.json
├── constraints/                     # 🔄 IN PROGRESS - Generated from JSON
│   ├── ConstraintFactory.ts        # Transforms JSON → constraint functions
│   ├── SafetyConstraints.ts        # Clearance rules (REQUIRED priority)
│   ├── WorkflowConstraints.ts      # Adjacency/distance rules (HIGH priority)
│   └── types.ts                    # Constraint system types
├── workflows/                       # 🔄 IN PROGRESS - MVP project types
│   ├── cabinetry.ts               # Cabinet workflow (MVP)
│   ├── furniture.ts               # Furniture workflow (MVP)
│   └── kitchen-goods.ts           # Kitchen goods workflow (MVP)
└── scoring/
    └── multi-objective.ts          # 40% safety, 25% workflow, 20% space, 15% accessibility
```

### MVP Constraint Scope (Phase 2A)
**Included:**
- ✅ Safety clearances (all tools) - REQUIRED priority
- ✅ Mobile tool boolean + mobile-specific constraints
- ✅ Workflow adjacency rules for 3 project types
- ✅ Tiered constraint priority (REQUIRED > HIGH > MEDIUM > LOW)

**Deferred to Post-MVP:**
- ⏳ Ventilation/dust collection routing
- ⏳ Power circuit planning and load distribution
- ⏳ Stability and vibration analysis

### Constraint System Implementation
- [ ] Build ConstraintFactory to transform JSON → TypeScript
- [ ] Generate SafetyConstraints from safety-constraints-findings.json
- [ ] Generate WorkflowConstraints from workflow-patterns-findings.json
- [ ] Integrate mobile tool boolean into constraint evaluation
- [ ] Implement tiered constraint resolution (REQUIRED first, then optimize others)
- [ ] Build multi-objective scoring with updated weights (40/25/20/15)

### Default Data Implementation
- [ ] 213" × 103" basement workshop template with wall constraints
- [ ] Tool library with `isMobile: boolean` distinction
- [ ] Tool clearance requirements from research (JSON → constraints)
- [ ] Mobile tool dual-position system (deployed vs parked)
- [ ] Project type selector (cabinetry, furniture, kitchen goods)

## User Experience Design 🔄 IN PROGRESS

### Clean Onboarding Experience
- [ ] Step-by-step workshop setup flow
- [ ] Tool selection with mobile/stationary guidance
- [ ] Clear optimization progress indication
- [ ] Educational insights presentation (brief, non-conversational)
- [ ] First-time user workflow optimization

### Mobile Tools Priority Integration
- [ ] UI distinction for mobile vs stationary tools
- [ ] Mobility impact explanation in tool selection
- [ ] Mobile tool workflow advantages in optimization insights
- [ ] Power access considerations in mobile tool placement

## Success Criteria

### Research Foundation
- [ ] Structured research data covering safety, workflow, and efficiency
- [ ] Academic sources documented and integrated
- [ ] Mobile tools research thoroughly integrated
- [ ] Constraint priority system established

### Technical Implementation
- [x] Research data collection complete (8 JSON files)
- [ ] Multi-objective scoring algorithm (40/25/20/15) implemented
- [ ] ConstraintFactory: JSON → TypeScript transformation pipeline
- [ ] Tiered constraint priority system (REQUIRED > HIGH > MEDIUM > LOW)
- [ ] Mobile tool integration with dual-position optimization
- [ ] Project workflow selector (3 MVP types: cabinetry, furniture, kitchen goods)

### User Experience
- [ ] Clean, intuitive onboarding flow designed
- [ ] Mobile tool importance clearly communicated
- [ ] Optimization insights are educational but brief
- [ ] First-time user experience tested and refined

## Dependencies for Next Phase

- Research-based constraint system for Phase 5 optimization engine
- Default workshop template for Phase 3 workshop management
- Mobile tool system for enhanced tool management in Phase 4
- Clean onboarding flow for Phase 7 user experience polish

## Key Performance Indicators

- Research data comprehensiveness (safety, workflow, efficiency coverage)
- Constraint system completeness (all tool types and scenarios covered)
- Mobile tool optimization effectiveness (space savings, workflow improvement)
- User onboarding clarity (time to first successful optimization)