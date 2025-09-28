# Workshop Planner

An automated layout optimizer for woodworking spaces. One-click optimization tool that takes workshop dimensions and tools, then generates optimal layouts instantly using constraint satisfaction algorithms.

## Features

- **Instant Optimization**: Advanced constraint satisfaction algorithms generate optimal layouts in seconds
- **3D Visualization**: Interactive 3D preview powered by Three.js
- **Completely Free**: No paid APIs or subscriptions - pure algorithmic optimization
- **Research-Powered**: Based on woodworking research and optimization rules

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js + React Three Fiber + React Three Drei
- **UI Components**: Tailwind CSS + Radix UI (accessible components)
- **State Management**: Zustand with LocalStorage persistence
- **Database**: Supabase (auth + database)
- **Routing**: React Router DOM
- **AI Enhancement**: Transformers.js (future conversational features)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication and data storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workshop-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React UI components
├── services/           # Supabase client and API services
├── stores/             # Zustand state management stores
├── types/              # TypeScript type definitions
├── data/               # Research data and optimization constraints
└── utils/              # Helper functions and utilities
```

## Core Architecture

The application is built around three main pillars:

1. **Research-Powered Optimization Engine**: Constraint satisfaction algorithms using academic findings and expert knowledge
2. **Interactive 3D Visualization**: React Three Fiber powered workshop layout visualization with 2D/3D toggle
3. **Data Management**: Supabase integration for user data and layout persistence (~18KB per user)

## Optimization Algorithm

**One-Click Optimization Process:**
1. **Input**: Workshop dimensions + tool selection + constraints
2. **Process**: Research-based constraint generation → spatial optimization → multi-objective scoring
3. **Output**: Optimized layout + efficiency scores + educational insights
4. **Performance Target**: <2 seconds optimization time

**Multi-Objective Scoring:**
- **Safety** (30%): OSHA guidelines and clearance requirements
- **Workflow** (30%): Tool placement for common woodworking processes  
- **Space Utilization** (20%): Maximize workshop space efficiency
- **Accessibility** (20%): Ensure all tools are easily accessible

## Key Features

### Automated Optimization (Current Focus)
- **One-click layout generation** from workshop + tools input
- **Research-powered constraints** based on academic studies
- **Educational insights** explaining optimization decisions
- **Multiple scenario comparison** with quantified efficiency scores

### User Experience Priorities
1. **Clean, intuitive onboarding** for first-time users
2. **No export features** (browser-based only)
3. **Mobile tools support** (casters) - high priority feature

## Development Status

**Current Phase**: Phase 1 - Research & Knowledge Base (IN PROGRESS)  
**Core Value Phase**: Phase 5 - Automated Optimization Engine (Target: Week 5-7)

See [phases/](./phases/) directory for detailed progress tracking and implementation guidance for each development phase.

### Next Steps
1. Complete research data compilation (`src/data/research/`)
2. Implement constraint satisfaction system
3. Build multi-objective scoring (30% safety, 30% workflow, 20% space, 20% accessibility)
4. Design clean onboarding experience

## Performance Requirements

- Layout optimization: <2 seconds for typical workshops
- 3D rendering: 60fps on modern browsers  
- Database efficiency: <20KB per user for core functionality
- Graceful handling of Supabase free tier limits (500+ users)

## License

MIT License - see LICENSE file for details.