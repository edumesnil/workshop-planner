# Workshop Planner - Development Phases

This directory contains detailed progress tracking and implementation guidance for each development phase.

## Phase Overview

| Phase | Duration | Status | Focus |
|-------|----------|--------|-------|
| [Phase 1](./phase-1-research-knowledge-base.md) | Week 1-2 | ✅ **COMPLETED** | Research & Knowledge Base |
| [Phase 2](./phase-2-foundation-authentication.md) | Week 2-3 | ✅ **COMPLETED** | Foundation & Authentication |
| [Phase 3A](./phase-3-workshop-management.md) | Week 3-4 | ✅ **COMPLETED** | Workshop Management (CRUD) |
| [Phase 3B](./phase-3b-2d-floor-plan.md) | Week 4 | ✅ **COMPLETED** | 2D Floor Plan Editor |
| [Phase 3C](./phase-3c-accessibility-undo.md) | Week 4 | ✅ **COMPLETED** | Accessibility & Undo/Redo |
| [Phase 4](./phase-4-tool-system.md) | Week 4-5 | PENDING | Tool System |
| [Phase 5](./phase-5-optimization-engine.md) | Week 5-7 | PENDING | **Automated Optimization Engine** ⭐ |
| [Phase 6](./phase-6-3d-visualization.md) | Week 7-8 | PENDING | 3D Visualization |
| [Phase 7](./phase-7-polish-ux.md) | Week 8-9 | PENDING | Polish & User Experience |

## Current Priority: Phase 4

**Focus**: Comprehensive tool system with specifications and management.

**Key Tasks**:
- Tool database with detailed specifications
- Tool selection and customization interface
- Mobile tool flagging and caster management
- Tool constraint definitions and clearance requirements
- Integration with workshop layouts

## Phase Dependencies

```
Phase 1 (Research) ✅ → Phase 2 (Auth) ✅ → Phase 3A (Workshop CRUD) → Phase 3B (2D Editor)
                                                                              ↓
                                            Phase 4 (Tool System) ← Phase 3A/3B (Workshop Data)
                                                      ↓
                           Phase 5 (Optimization Engine) ← Phase 1 + 2 + 3A + 4
                                                      ↓
                     Phase 6 (3D Visualization) ← Phase 5 (Optimization Results)
                                                      ↓
                     Phase 7 (Polish & UX) ← All Previous Phases
```

**Key Notes**:
- Phase 3B (2D editor) is optional - Phase 5 can work with text-based constraints from 3A
- Phase 5 (Optimization Engine) requires Phase 1 research + Phases 2-4 data infrastructure

## Key Features by Phase

### Research Foundation (Phase 1) ✅
- ✅ Academic findings collected in JSON format (8 research files)
- ✅ ConstraintFactory: JSON → TypeScript constraint transformation
- ✅ Mobile tool integration with dual-position system (deployed/parked)
- ✅ Multi-objective scoring: **40% safety, 25% workflow, 20% space, 15% accessibility**
- ✅ MVP project workflows: cabinetry, furniture, kitchen goods
- ✅ Tiered constraint priority: REQUIRED > HIGH > MEDIUM > LOW
- ✅ Default workshop template (213" × 103" basement)

### Foundation & Authentication (Phase 2) ✅
- ✅ Supabase integration and user authentication
- ✅ Database schema for workshops, tools, layouts, user_profiles
- ✅ Email/password authentication with forgot password flow
- ✅ Multi-step onboarding (dimensions, tool selection, summary)
- ✅ HeroUI component migration and protected routes

### Workshop Management (Phase 3A) ✅
- ✅ Workshop library page (grid view, create/edit/delete)
- ✅ Workshop detail page with tabbed interface
- ✅ Text-based constraint entry forms (walls and obstacles)
- ✅ Workshop data validation and persistence
- ✅ Type definitions for `Workshop.constraints` field
- ✅ HeroUI components with UX copywriting frameworks
- ✅ Optimistic UI updates and keyboard accessibility

### 2D Floor Plan Editor (Phase 3B) ✅
- ✅ Canvas-based 2D workshop renderer with grid overlay
- ✅ Interactive wall selection and constraint editing in sidebar
- ✅ Drag-drop for wall constraints (between walls with rotation preview)
- ✅ Drag-drop for obstacles with grid snapping (6" intervals)
- ✅ Obstacle palette in sidebar (6 common templates)
- ✅ Context menus on right-click (edit/delete)
- ✅ Pick and drop animations with easing
- ✅ Debounced auto-save (60 seconds) + manual save button
- ✅ Zoom/pan controls (mouse wheel, spacebar+drag)
- ✅ Smart wall snapping (corners and edges)
- ✅ Bounds checking (obstacles stay within floor)

### Accessibility & Undo/Redo (Phase 3C) ✅
- ✅ Keyboard navigation (Tab cycling, Arrow key movement)
- ✅ Focus rings on all interactive elements
- ✅ Undo/redo system (20-state history, Ctrl+Z/Y)
- ✅ Color contrast improvements (WCAG 2.2 AA)
- ✅ Empty state guidance and UX copy polish
- ✅ Global drag handling (mouseup outside canvas)

### Tool System (Phase 4)
- Comprehensive tool database with specifications
- Tool selection and customization interface
- Mobile tool flagging and caster management
- Tool constraint definitions and clearance requirements

### Core Value (Phase 5)
- One-click layout optimization (<2 seconds)
- Research-powered constraint satisfaction
- Educational insights generation
- Mobile tool workflow optimization

### User Experience (Phase 7)
- Clean, intuitive onboarding
- Mobile tool importance communication
- No export features (browser-based only)
- Performance optimization and polish

## Success Metrics

- **Phase 1**: Research comprehensiveness and constraint system completeness
- **Phase 5**: Optimization time <2 seconds, measurable layout improvement
- **Phase 7**: User onboarding time <5 minutes, clear optimization benefits

## Architecture Decisions

- **Automated vs Conversational**: Current phases focus on constraint-based optimization
- **Mobile Tools Priority**: High priority feature affecting all phases
- **Free Tier Strategy**: No export features, browser-based solutions
- **Performance First**: <2 second optimization, 60fps 3D rendering

## File Purpose

Each phase file contains:
- Detailed task breakdowns with progress tracking
- Technical implementation guidance
- Success criteria and performance targets
- Dependencies and integration points
- Testing and validation requirements

## Research-Driven Development

Phase 1 uses structured research prompts in `../research-prompts/` to systematically collect academic findings and expert knowledge. Research is stored as JSON in `../src/data/research/` and transformed to TypeScript constraints via ConstraintFactory.

**Research Coverage:**
- ✅ Safety constraints (OSHA/Canadian clearances, accident reduction data)
- ✅ Workflow patterns for 12 project types (MVP: 3 workflows)
- ✅ Space optimization (30-50% mobile tool savings)
- ✅ Mobile tool benefits and dual-position optimization
- ✅ Multi-objective scoring weights: **40/25/20/15**

**MVP Constraint Scope:**
- Safety clearances (REQUIRED priority)
- Mobile tool boolean + constraints
- Workflow adjacency for 3 project types

**Deferred to Post-MVP:**
- Ventilation/dust collection routing
- Power circuit planning
- Stability and vibration analysis

See `PROJECT_SCOPE.md` for full workflow roadmap (12 project types).

For high-level project information, see:
- [README.md](../README.md) - Project overview and getting started
- [CLAUDE.md](../CLAUDE.md) - Technical guidance for Claude Code
- [Technical Specs](../Workshop%20Planner%20-%20Technical%20Specs.md) - Complete specification
- [research-prompts/](../research-prompts/) - Structured research collection templates