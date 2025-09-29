# Layout Optimization Methodology Research Prompt

I need research on facility layout optimization methodologies and scoring systems used in Canadian industrial engineering and manufacturing, with focus on woodworking workshop applications. Please provide findings using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant optimization methodology findings:

## OPTIMIZATION METHODOLOGY SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "facility_layout_research": {
      "type": "array",
      "description": "ALL facility layout optimization approaches, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "study_name": {"type": "string"},
          "optimization_approach": {"type": "string", "description": "Any optimization methodology found"},
          "objective_weights": {"type": "object", "description": "Weight assignments for any objectives"},
          "success_metrics": {"type": "object"},
          "source": {"type": "string"}
        }
      }
    },
    "scoring_methodologies": {
      "type": "array",
      "description": "ALL scoring systems found, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "methodology": {"type": "string", "description": "Any scoring methodology"},
          "scoring_components": {"type": "array", "description": "ALL scoring components found"},
          "validation_metrics": {"type": "object"},
          "source": {"type": "string"}
        }
      }
    },
    "optimization_algorithm_research": {
      "type": "array",
      "description": "ALL optimization algorithms studied, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "algorithm_type": {"type": "string", "description": "Any optimization algorithm"},
          "effectiveness_rating": {"type": "string"},
          "best_use_case": {"type": "string"},
          "source": {"type": "string"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research ALL optimization methodologies (genetic algorithms, constraint programming, simulated annealing, neural networks, etc.)
- Include ALL scoring systems (weighted scoring, pareto optimization, fuzzy logic, etc.)
- Find data for ALL facility types and sizes
- Research Canadian-specific optimization practices
- Include trade-off analysis methodologies
- Expand to cover multi-objective optimization approaches
- Add any additional optimization methodology data you discover beyond the schema

**Research Focus Areas:**
- Canadian industrial engineering facility layout optimization methodologies
- Multi-objective optimization weight determination research for Canadian manufacturing
- Constraint hierarchy and penalty system studies for Canadian workshops
- Performance measurement frameworks for Canadian woodworking layout efficiency
- Trade-off analysis research for Canadian woodworking (safety vs. efficiency, space vs. flexibility)
- Optimization algorithm effectiveness studies for small-scale Canadian workshops
- Canadian safety regulation compliance in optimization methodologies
- Provincial variation in workshop optimization requirements

**Requirements:**
- Include quantified weights and penalty values from academic studies
- Provide validated methodologies with success metrics
- Focus on small-scale facility optimization (under 500 sq ft)
- Include computational efficiency data for different algorithms
- Source industrial engineering and operations research studies