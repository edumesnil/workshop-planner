# Workshop Planner - Technical Specification

## Project Overview

A web-based automated workshop layout optimizer for woodworking spaces. Users input their workshop dimensions, constraints, and tools to receive an AI-generated optimized layout with minimal interaction. The core focus is **smart automation** rather than conversation - users get optimal layouts instantly with brief educational insights about the optimization decisions.

## Target User

Woodworkers with small workshop spaces who want **automated optimization** of their tool placement for maximum efficiency in projects including small furniture, cabinetry, and crafts. Primary goal: one-click layout generation.

## Core Features

### 1. Workshop Configuration
- Input workshop dimensions (length × width)
- Define wall constraints (windows, doors, electrical panels, storage)
- Set immovable obstacles (water heaters, support posts)
- Save multiple workshop configurations per user

### 2. Tool Management
- Personal tool inventory with custom dimensions
- Tool templates library (common woodworking tools)
- Tool properties: dimensions, mobility (casters), clearance requirements
- Material feed space requirements for specific tools

### 3. Automated Layout Optimization Engine
- **One-click optimization:** Input tools → Get optimal layout instantly
- **Research-powered constraints:** Academic findings encoded as optimization rules
- **Multi-objective optimization:** Safety + efficiency + workflow considerations
- **Real-time constraint validation:** Physics-based collision detection
- **Efficiency scoring:** Quantified layout performance metrics

### 4. 3D Visualization
- Interactive 3D workshop preview of optimized layout
- Top-down 2D planning view
- Visual clearance indicators and material feed spaces
- Toggle between planning and preview modes

### 5. Scenario Management
- Save/load multiple optimized layouts
- Compare efficiency scores across optimization runs
- Version control for layout iterations
- Export layouts via browser print/screenshot functionality

### 6. User System
- Authentication (email + OAuth via Supabase Auth)
- Personal workshop and tool libraries
- Browser-based caching for performance

### 7. Future Enhancement: Conversational Iteration
- **Post-MVP Feature:** Natural language refinement of layouts
- **Examples:** "Make this safer", "Optimize for cabinet making", "Move table saw closer to lumber storage"
- **Architecture:** Modular constraint system designed to accept both automated rules and user preferences

## Technical Architecture

### Frontend Stack
- **Framework:** React 18 with TypeScript
- **3D Rendering:** Three.js with React Three Fiber (@react-three/fiber)
- **3D Controls:** @react-three/drei for camera controls and helpers
- **AI Integration:** 
  - Constraint-based spatial optimization (completely free)
  - Research-informed knowledge base
  - Future: Transformers.js for conversational enhancement
- **State Management:** Zustand with LocalStorage persistence
- **Data Caching:** Browser LocalStorage for layout cache and user preferences
- **UI Components:** Tailwind CSS + Radix UI
- **Routing:** React Router v6
- **Build Tool:** Vite

### Backend Stack
- **Database & Auth:** Supabase (Free Tier: 500MB DB, 1GB storage)
- **Real-time:** Supabase Real-time subscriptions
- **File Storage:** Browser-based solutions (LocalStorage cache, print/screenshot)

### **Automated Optimization Engine (Free)**
- **Primary Engine:** Constraint satisfaction algorithms for spatial optimization
- **Knowledge Integration:** Research findings encoded as optimization rules and constraints
- **Scoring System:** Multi-objective fitness function (safety + efficiency + workflow)
- **Future Enhancement:** Natural language interface for layout refinement via Transformers.js
- **Core Philosophy:** Smart automation with optional educational insights, not conversation

### Optimization Engine Architecture

#### Core Spatial Optimization Engine
```typescript
interface AutomatedLayoutOptimizer {
  // Main optimization function: tools + workshop → optimal layout
  optimize(workshop: Workshop, tools: Tool[], preferences?: OptimizationPreferences): OptimizedLayout
  
  // Multi-objective scoring system
  calculateScore(layout: Layout): OptimizationScore
  
  // Research-based constraint generation
  generateConstraints(tools: Tool[], workshop: Workshop): Constraint[]
  
  // Brief educational insights (non-conversational)
  generateInsights(layout: Layout, decisions: OptimizationDecision[]): string[]
}

interface OptimizedLayout {
  toolPositions: ToolPosition[]
  score: OptimizationScore
  insights: string[]           // Brief educational notes
  constraints: AppliedConstraint[]
  workflowPaths: Path[]
}

interface OptimizationScore {
  overall: number              // 0-100 overall efficiency
  safety: number              // Safety compliance score
  workflow: number            // Workflow efficiency score
  spaceUtilization: number    // Space usage efficiency
}
```

#### Research-Based Constraint System
```typescript
interface ResearchConstraintEngine {
  // Convert research findings into optimization constraints
  buildSafetyConstraints(tools: Tool[]): SafetyConstraint[]
  buildWorkflowConstraints(tools: Tool[], projectType: ProjectType): WorkflowConstraint[]
  buildEfficiencyConstraints(workshop: Workshop, tools: Tool[]): EfficiencyConstraint[]
  
  // Modular design for future conversational input
  addUserPreferenceConstraints(preferences: UserPreferences): UserConstraint[]
}

// Example constraint from research
const RESEARCH_CONSTRAINTS = {
  tablesaw_clearance: {
    front: 96,    // 8 feet based on OSHA guidelines
    back: 48,     // 4 feet minimum for safety
    sides: 36,    // 3 feet for operator movement
    reasoning: "OSHA safety standards + accident prevention studies"
  },
  lumber_to_crosscut_distance: {
    max: 96,      // 8 feet maximum
    ideal: 72,    // 6 feet optimal
    reasoning: "Time-motion studies show 23% efficiency gain"
  }
};
```

#### Spatial Optimization Algorithms
```typescript
class ConstraintSatisfactionOptimizer {
  // Primary optimization method
  solve(tools: Tool[], constraints: Constraint[]): Layout {
    // 1. Generate valid placement positions for each tool
    // 2. Apply constraint satisfaction algorithm
    // 3. Multi-objective optimization (safety + efficiency + workflow)
    // 4. Return optimal solution
  }
}

class GeneticAlgorithmOptimizer {
  // Alternative optimization for complex scenarios
  evolve(tools: Tool[], constraints: Constraint[], generations: number): Layout {
    // Evolution-based optimization with research-informed fitness
  }
}
```

#### Future: Conversational Enhancement Layer
```typescript
// Designed for post-MVP conversational iteration
interface ConversationalOptimizer {
  // Natural language input processing (future enhancement)
  interpretUserPreference(input: string): UserConstraint[]
  
  // Example: "Make this safer" → increase safety constraint weights
  // Example: "Optimize for cabinet making" → apply cabinet-specific workflow constraints
  refineLayout(currentLayout: Layout, userInput: string): OptimizedLayout
}
```

### Database Schema

```sql
-- Workshops table
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  length INTEGER NOT NULL, -- in inches
  width INTEGER NOT NULL,  -- in inches
  constraints JSONB DEFAULT '{}', -- wall constraints, obstacles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  length INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  tool_type VARCHAR(100),
  is_mobile BOOLEAN DEFAULT true,
  clearance_front INTEGER DEFAULT 0,
  clearance_back INTEGER DEFAULT 0,
  clearance_left INTEGER DEFAULT 0,
  clearance_right INTEGER DEFAULT 0,
  material_feed_length INTEGER DEFAULT 0, -- for tools like table saws
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tool Templates (pre-defined tools)
CREATE TABLE tool_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  length INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  clearance_front INTEGER DEFAULT 0,
  clearance_back INTEGER DEFAULT 0,
  clearance_left INTEGER DEFAULT 0,
  clearance_right INTEGER DEFAULT 0,
  material_feed_length INTEGER DEFAULT 0,
  description TEXT,
  is_public BOOLEAN DEFAULT true
);

-- Layouts table
CREATE TABLE layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  tool_positions JSONB NOT NULL, -- array of {toolId, x, y, rotation}
  optimization_type VARCHAR(50) DEFAULT 'space_efficiency',
  efficiency_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Project Structure

```
workshop-planner/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── workshop/          # Workshop configuration
│   │   ├── tools/             # Tool management
│   │   ├── layout/            # Layout planning interface
│   │   ├── visualization/     # 3D/2D rendering components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores with LocalStorage
│   ├── services/              # API services (Supabase + Optimization)
│   │   ├── supabase.ts       # Database operations
│   │   ├── optimizer.ts      # Core spatial optimization engine
│   │   ├── constraints.ts    # Research-based constraint system
│   │   └── future-ai.ts      # Future: Transformers.js for conversational iteration
│   ├── data/                 # Research data and optimization rules
│   │   ├── research/         # Workshop optimization research findings
│   │   ├── constraints/      # Safety, workflow, efficiency rules
│   │   ├── patterns/         # Successful layout patterns
│   │   └── scoring/          # Optimization scoring algorithms
│   ├── utils/                 # Helper functions & data compression
│   ├── types/                 # TypeScript definitions
│   └── constants/             # Application constants
├── public/                    # Static assets
└── docs/                      # Documentation
```

## Automated Optimization Features

### Research-Powered Spatial Intelligence
- **Deep Domain Knowledge:** Your curated research on workshop optimization, safety, and efficiency
- **Academic Foundation:** Integration of published studies on workshop layout and workflow analysis
- **Expert Patterns:** Codified best practices from professional woodworking shops
- **Automated Application:** Research findings converted into optimization constraints and scoring

### Core Optimization Capabilities
- **One-Click Layout Generation:** Input workshop + tools → Get optimized layout instantly
- **Multi-Objective Optimization:** Balances safety, efficiency, and workflow considerations automatically
- **Research-Backed Decisions:** Every placement decision based on academic studies and expert knowledge
- **Educational Insights:** Brief, concise explanations of optimization decisions (non-conversational)
- **Quantified Performance:** Numerical scores for layout quality across multiple dimensions

### Optimization Intelligence Examples
```typescript
const RESEARCH_OPTIMIZATION_RULES = {
  safetyConstraints: {
    tablesaw_clearance: { 
      front: 96, back: 48, sides: 36,
      reasoning: "OSHA guidelines + accident prevention studies",
      weight: 1.0  // High priority constraint
    }
  },
  workflowEfficiency: {
    lumber_to_crosscut: { 
      idealDistance: 72, maxDistance: 96,
      reasoning: "Time-motion studies show 23% efficiency gain",
      weight: 0.8
    },
    assembly_workspace: {
      minClearance: 96,  // 8 feet for sheet goods
      reasoning: "Cabinet making workflow analysis",
      weight: 0.7
    }
  },
  spaceOptimization: {
    mobile_tools: {
      effectiveness: 0.37,  // 37% space savings
      conditions: ["wheel_locks", "power_access", "dust_collection"],
      reasoning: "Small space optimization research"
    }
  }
};
```

### Automated Features
- **Instant Optimization:** No conversation needed - just click "Optimize"
- **Research-Informed Scoring:** Quantified layout quality based on academic findings
- **Educational Value:** Brief insights about why specific placements are optimal
- **Multiple Scenarios:** Generate and compare different optimization approaches
- **Future Enhancement:** Natural language refinement capabilities for post-MVP iteration

### Free Architecture Benefits
- **100% Free Operation:** No API costs, constraint-based optimization runs locally
- **Fast Performance:** Deterministic algorithms provide instant results
- **Reliable Output:** Consistent, explainable optimization decisions
- **Research-Enhanced:** Much smarter than basic CAD tools due to domain expertise
- **Future-Ready:** Architecture designed for eventual conversational enhancement

## Free Tier Strategy

### Supabase Resource Optimization
- **Database Storage:** ~18KB per user (workshops, tools, layouts)
- **Estimated Capacity:** 500+ users within 500MB free database limit
- **Storage Strategy:** JSON compression, efficient data structures
- **No file storage:** Use browser-based export solutions

### Data Size Estimates
```typescript
// Typical data sizes per user:
// - Workshop configurations: ~2KB
// - Personal tool library (50 tools): ~10KB  
// - Layout scenarios (10 layouts): ~5KB
// - User metadata: ~1KB
// Total per user: ~18KB
```

### Browser-Based Features
- **Export Functionality:** Browser print-to-PDF, screenshot APIs
- **Caching:** LocalStorage for temporary data and user preferences
- **Offline Capability:** Layout planning works offline with LocalStorage cache

## Development Phases

### Phase 1: Research & Knowledge Base (Week 1-2) - IN PROGRESS
- [x] **Project Setup:**
  - [x] Initialize Vite + React + TypeScript project
  - [x] Set up development environment with path mapping
  - [x] Install core dependencies (React Three Fiber, Radix UI, Transformers.js)
  - [x] Basic component architecture and routing
  - [x] Zustand state management foundation
- [ ] **Workshop Optimization Research:**
  - [ ] Academic papers on workshop layout efficiency
  - [ ] Professional woodworking shop design principles
  - [ ] Safety guidelines and clearance requirements (OSHA focus)
  - [ ] Workflow analysis studies (lumber → cut → assembly → finish)
  - [ ] Small space optimization techniques
  - [ ] **Mobile tools optimization** (HIGH PRIORITY - casters, mobility)
- [ ] **Knowledge Base Development:**
  - [ ] Compile research findings into structured data (`src/data/research/`)
  - [ ] Create workflow pattern templates
  - [ ] Develop safety rule database with constraint priorities
  - [ ] Build multi-objective scoring criteria (30% safety, 30% workflow, 20% space, 20% accessibility)
  - [ ] Clean, intuitive onboarding experience design

### Phase 2: Foundation & Authentication (Week 2-3)
- [x] Project setup with Vite + React + TypeScript
- [ ] Supabase project configuration
- [ ] Authentication system implementation
- [ ] Basic routing and navigation enhancement
- [ ] Database schema creation and migrations

### Phase 3: Workshop Management (Week 3-4)
- [ ] Workshop creation/editing interface
- [ ] Constraint definition system (walls, obstacles)
- [ ] Workshop persistence and user association
- [ ] Basic workshop visualization (2D top-down)

### Phase 4: Tool System (Week 4-5)
- [ ] Tool creation and editing interface
- [ ] Tool templates system
- [ ] Personal tool library management
- [ ] Tool import/export functionality

### Phase 5: Automated Optimization Engine (Week 5-7)
- [ ] **Core Optimization System:**
  - [ ] Constraint satisfaction algorithm implementation
  - [ ] Multi-objective scoring system (safety + efficiency + workflow)
  - [ ] Physics-based collision detection and clearance validation
  - [ ] Research-based constraint generation from knowledge base
- [ ] **Optimization Interface:**
  - [ ] One-click optimization button ("Optimize Layout")
  - [ ] Real-time layout generation and visualization
  - [ ] Optimization score display and breakdown
  - [ ] Brief insight generation (non-conversational)
- [ ] **Future-Ready Architecture:**
  - [ ] Modular constraint system for future user preference input
  - [ ] Extensible scoring system for conversational refinement
  - [ ] Layout save/load functionality with optimization metadata

### Phase 6: 3D Visualization (Week 7-8)
- [ ] Three.js integration with React Three Fiber
- [ ] 3D workshop and tool rendering
- [ ] Camera controls and navigation
- [ ] Toggle between 2D/3D views

### Phase 7: Polish & Export (Week 8-9)
- [ ] **User Experience Refinement:**
  - [ ] Optimization performance tuning
  - [ ] Responsive design and mobile compatibility
  - [ ] Error handling and edge cases
  - [ ] User onboarding and tooltips
- [ ] **Export & Sharing:**
  - [ ] Browser-based export (print-to-PDF, screenshots)
  - [ ] Scenario comparison interface
  - [ ] Data compression and cleanup utilities
  - [ ] Performance optimization for large tool inventories

### Future Phase: Conversational Enhancement (Post-MVP)
- [ ] **Natural Language Interface:**
  - [ ] Transformers.js integration for user preference interpretation
  - [ ] "Make this safer", "Optimize for cabinet making" style commands
  - [ ] Conversational layout refinement capabilities
- [ ] **Advanced AI Features:**
  - [ ] User preference learning from manual adjustments
  - [ ] Context-aware optimization suggestions
  - [ ] Advanced workflow optimization based on project types

## Initial Data Requirements

### Default Workshop Template
```json
{
  "name": "User's Basement Workshop",
  "length": 213,
  "width": 103,
  "constraints": {
    "walls": {
      "north": { "type": "shelving", "description": "General storage shelving" },
      "south": { "type": "electrical_window", "items": ["electrical_panel", "window"] },
      "east": { "type": "window", "items": ["window"] },
      "west": { "type": "utilities", "items": ["water_heater", "cold_room", "entrance"] }
    }
  }
}
```

### Common Woodworking Tool Templates
```json
[
  {
    "name": "Table Saw",
    "category": "Power Tools",
    "length": 36,
    "width": 27,
    "height": 34,
    "clearance_front": 96,
    "clearance_back": 48,
    "material_feed_length": 96
  },
  {
    "name": "Workbench",
    "category": "Work Surfaces",
    "length": 72,
    "width": 24,
    "height": 34,
    "clearance_front": 36,
    "clearance_back": 24
  }
]
```

## Performance Requirements

- Layout optimization should complete within 2 seconds for typical workshops
- 3D rendering should maintain 60fps on modern browsers
- Database queries should complete within 500ms
- Application should work on desktop browsers (Chrome, Firefox, Safari, Edge)
- Efficient data storage: <20KB per user for core functionality
- Graceful handling of Supabase free tier limits

## User Experience Priorities (Updated)

### Critical Feature Clarifications
- **Mobile Tools Support**: Very important priority - tools with casters, mobility optimization
- **No Export Features**: Browser-based only (print/screenshot) - removed from development scope  
- **Clean Onboarding**: Focused, intuitive first-time user experience - high priority

### User Flow Priority
1. Clean, guided workshop setup (213" × 103" basement template as default)
2. Simple tool selection with mobile/stationary distinction
3. One-click optimization with clear progress indication
4. Immediate 3D/2D visualization of results
5. Educational insights about optimization decisions (brief, non-conversational)

## Future Enhancements

### Immediate Next Steps (Post-MVP)
- Advanced workflow optimization based on project types
- Enhanced mobile tool optimization algorithms
- Data compression and cleanup utilities

### Medium Term
- Mobile companion app
- Dust collection routing
- Electrical planning
- Layout sharing (when storage allows)

### Long Term  
- Supabase Pro upgrade for file storage
- Community layout marketplace
- AR visualization
- Integration with tool catalogs
- Project-specific layout recommendations

## Success Metrics

- User can create a workshop configuration in under 5 minutes
- Layout optimization produces measurably better space utilization than manual placement
- Users save and compare multiple layout scenarios
- 3D visualization provides clear understanding of workshop layout
- System handles workshops from 50 sq ft to 500 sq ft efficiently