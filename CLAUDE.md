# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Workshop Planner** - Automated layout optimizer for woodworking spaces. One-click optimization using constraint satisfaction algorithms, not conversational AI. **Core focus: research-powered automation over conversation.**

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run typecheck` - TypeScript validation
- `npm run preview` - Preview production build

## Architecture Essentials

### Tech Stack Purpose
- **React Three Fiber** - 3D workshop visualization
- **Zustand** - State management with LocalStorage persistence
- **Supabase** - Auth + database (~18KB per user)
- **Radix UI** - Accessible components
- **Transformers.js** - Future conversational features

### Path Mapping
```
@/ → ./src/
@/data/* → ./src/data/*
@/services/* → ./src/services/*
```

### Data Architecture
```
src/data/
├── research/        # JSON findings (OSHA, workflow studies) - ✅ COMPLETED
├── constraints/     # ConstraintFactory transforms JSON → TypeScript
├── workflows/       # MVP: cabinetry, furniture, kitchen goods
└── scoring/         # Multi-objective: 40% safety, 25% workflow, 20% space, 15% accessibility
```

## Critical Implementation Patterns

### Mobile Tools Priority
Tools with casters are **high priority** - affects placement flexibility and workflow optimization.

**Implementation:**
- `isMobile: boolean` on every tool
- Dual-position system: `deployedPosition` (working) + `parkedPosition` (storage)
- Mobile-specific constraints for stability and clearance
- 30-50% space savings per research data

### Optimization Engine Pattern
```typescript
interface ResearchConstraintEngine {
  buildSafetyConstraints(tools: Tool[]): SafetyConstraint[]
  buildWorkflowConstraints(tools: Tool[]): WorkflowConstraint[]
  buildEfficiencyConstraints(workshop: Workshop, tools: Tool[]): EfficiencyConstraint[]
}
```

### Performance Requirements
- Layout optimization: <2 seconds
- 3D rendering: 60fps
- Database: <20KB per user
- Workshop coordinates: inches (x=length, y=width, z=height)

### User Experience Rules
- **No export features** - browser-based only
- **Clean onboarding** - step-by-step first-time experience
- **Default template** - 213" × 103" basement workshop

## Key Design Decisions

**Automated vs Conversational**: Current phase focuses on constraint-based optimization. Conversational iteration planned for post-MVP via Transformers.js with modular constraint system.

**Free Tier Strategy**: Supabase free tier supports 500+ users. Browser-based export (print/screenshot) instead of file storage.