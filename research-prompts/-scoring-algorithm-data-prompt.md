# Scoring Algorithm Data Generation Prompt

I need scoring algorithm data for a multi-objective Canadian woodworking workshop layout optimizer. Please provide data using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant scoring methodology findings:

## SCORING ALGORITHM SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "scoring_weights": {
      "type": "object",
      "description": "Weight distribution for ALL optimization objectives, not just examples",
      "properties": {
        "safety": {"type": "number", "description": "Safety weight based on research with source citations"},
        "workflow_efficiency": {"type": "number", "description": "Workflow weight based on research with source citations"},
        "space_utilization": {"type": "number", "description": "Space weight based on research with source citations"},
        "accessibility": {"type": "number", "description": "Accessibility weight based on research with source citations"},
        "source": {"type": "string"},
        "source_url": {"type": "array", "items": {"type": "string"}, "description": "Source URLs for weight validation"}
      }
    },
    "scoring_categories": {
      "type": "array",
      "description": "ALL scoring categories found, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "category": {"type": "string", "description": "Any scoring category (safety, workflow, space, accessibility, cost, flexibility, etc.)"},
          "perfect_score": {"type": "number"},
          "scoring_criteria": {"type": "array", "description": "ALL criteria for this category"},
          "calculation_methods": {"type": "array", "description": "How to calculate scores"}
        }
      }
    },
    "penalty_systems": {
      "type": "array",
      "description": "ALL penalty calculation methods, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "violation_type": {"type": "string", "description": "Any type of constraint violation"},
          "penalty_calculation": {"type": "string", "description": "How penalty is calculated"},
          "severity_levels": {"type": "array", "description": "Different penalty levels"}
        }
      }
    },
    "bonus_systems": {
      "type": "array",
      "description": "ALL bonus conditions found, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "condition": {"type": "string", "description": "Any exceptional performance condition"},
          "bonus_value": {"type": "number", "description": "Bonus points awarded"},
          "description": {"type": "string"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research ALL optimization objectives and their relative importance (safety, efficiency, cost, flexibility, ergonomics, environmental, etc.)
- Include ALL scoring methodologies (weighted scoring, fuzzy logic, neural networks, decision trees, etc.)
- Find data for ALL penalty calculation approaches (linear, exponential, threshold-based, etc.)
- Research Canadian-specific scoring considerations
- Include industry-standard scoring frameworks
- Expand to cover multi-criteria decision analysis methods
- Add any additional scoring methodology data you discover beyond the schema

**Focus Areas:**
- Multi-objective scoring with appropriate weights for Canadian woodworking workshops (30% safety, 30% workflow, 20% space, 20% accessibility)
- Specific penalty calculations for Canadian safety constraint violations
- Bonus systems for exceptional woodworking workshop layouts
- Mathematical formulas for each woodworking scoring component
- Quantifiable metrics for Canadian woodworking layout quality assessment
- Integration of Canadian safety standards into scoring
- Provincial regulation compliance scoring factors

**Requirements:**
- Provide specific penalty values and calculation methods with quantified formulas
- Include bonus conditions for exceptional layouts with point values
- Focus on measurable, quantifiable scoring criteria with specific metrics
- Balance competing objectives (safety vs. efficiency vs. space) with weighted analysis
- Create actionable scoring that guides optimization algorithms with implementation details
- **CRITICAL: Include source URLs and citations like the excellent safety and workflow research**
- **Provide specific penalty percentages and mathematical formulas**
- **Include quantified scoring thresholds and calculation examples**
- **Reference Canadian optimization standards and industrial engineering studies**
- **Add validated scoring methodologies with effectiveness data**
- Mark priority as HIGH for scoring algorithm optimization
- **Follow the same thorough research approach as the successful findings**