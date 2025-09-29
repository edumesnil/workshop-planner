# Workshop Planner - Development Phases

This directory contains detailed progress tracking and implementation guidance for each development phase.

## Phase Overview

| Phase | Duration | Status | Focus |
|-------|----------|--------|-------|
| [Phase 1](./phase-1-research-knowledge-base.md) | Week 1-2 | **IN PROGRESS** | Research & Knowledge Base |
| [Phase 2](./phase-2-foundation-authentication.md) | Week 2-3 | PENDING | Foundation & Authentication |
| [Phase 3](./phase-3-workshop-management.md) | Week 3-4 | PENDING | Workshop Management |
| [Phase 4](./phase-4-tool-system.md) | Week 4-5 | PENDING | Tool System |
| [Phase 5](./phase-5-optimization-engine.md) | Week 5-7 | PENDING | **Automated Optimization Engine** ⭐ |
| [Phase 6](./phase-6-3d-visualization.md) | Week 7-8 | PENDING | 3D Visualization |
| [Phase 7](./phase-7-polish-ux.md) | Week 8-9 | PENDING | Polish & User Experience |

## Current Priority: Phase 1

**Focus**: Building the research-powered intelligence foundation that drives optimization decisions.

**Key Tasks**:
- Academic research compilation (OSHA, workflow studies, efficiency research)
- Mobile tools optimization research (**HIGH PRIORITY**)
- Constraint system implementation
- Multi-objective scoring algorithm (30/30/20/20)
- Clean onboarding experience design

## Phase Dependencies

```
Phase 1 (Research) → Phase 2-4 (Data Layer) → Phase 5 (Optimization Engine)
                                                      ↓
                     Phase 6 (3D Visualization) ← Phase 5 (Optimization Results)
                                                      ↓
                     Phase 7 (Polish & UX) ← All Previous Phases
```

**Note**: Phase 5 (Optimization Engine) requires both Phase 1 research data AND Phases 2-4 data infrastructure to be complete.

## Key Features by Phase

### Research Foundation (Phase 1)
- Academic findings converted to structured constraint data
- Mobile tool optimization system
- Multi-objective scoring framework
- Default workshop template (213" × 103" basement)
- Research prompt templates for systematic data collection

### Foundation & Authentication (Phase 2)
- Supabase integration and user authentication
- Database schema for workshops and layouts
- User session management and data persistence
- Error handling and offline capabilities

### Workshop Management (Phase 3)
- Workshop creation and dimension input
- Workshop templates and presets
- Workshop data validation and storage
- Workshop sharing and collaboration features

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

Phase 1 uses structured research prompts in `../research-prompts/` to systematically collect academic findings and expert knowledge. These prompts ensure comprehensive coverage of:

- Safety constraints and OSHA guidelines
- Workflow patterns for different project types  
- Space optimization strategies by workshop size
- Mobile tool considerations and placement flexibility
- Professional layout design principles
- Multi-objective scoring algorithm weights

The collected research is compiled into structured data files in `../src/data/research/` that drive the optimization algorithms.

For high-level project information, see:
- [README.md](../README.md) - Project overview and getting started
- [CLAUDE.md](../CLAUDE.md) - Technical guidance for Claude Code
- [Technical Specs](../Workshop%20Planner%20-%20Technical%20Specs.md) - Complete specification
- [research-prompts/](../research-prompts/) - Structured research collection templates