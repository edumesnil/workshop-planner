# Efficiency Studies Research Prompt

I need academic space optimization research for small Canadian woodworking workshops. Please provide findings using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant efficiency findings:

## SPACE EFFICIENCY JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "small_workshop_studies": {
      "type": "array",
      "description": "Studies for ALL small workshop sizes and configurations, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "study_name": {"type": "string"},
          "workshop_size_range": {"type": "object", "description": "Any workshop size range"},
          "optimization_techniques": {"type": "array", "description": "ALL space optimization techniques found"},
          "source": {"type": "string"},
          "source_url": {"type": "array", "items": {"type": "string"}, "description": "Source URLs for verification"},
          "quantified_benefits": {"type": "object", "description": "Space savings percentages, time improvements, cost data"},
          "trade_offs": {"type": "object", "description": "Setup time, cost, accessibility impacts"},
          "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]}
        }
      }
    },
    "tool_placement_efficiency": {
      "type": "array",
      "description": "Efficiency principles for ALL workshop scenarios, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "principle": {"type": "string", "description": "Any efficiency principle found"},
          "placement_rules": {"type": "object", "description": "Specific placement guidelines"},
          "efficiency_gain": {"type": "object", "description": "Quantified benefits"},
          "source": {"type": "string"}
        }
      }
    },
    "storage_optimization": {
      "type": "array",
      "description": "Storage solutions for ALL workshop needs, not just lumber",
      "items": {
        "type": "object",
        "properties": {
          "storage_type": {"type": "string", "description": "Any storage type (lumber, tools, hardware, finishing supplies, etc.)"},
          "space_efficiency": {"type": "object"},
          "placement_requirements": {"type": "object"},
          "source": {"type": "string"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research ALL workshop sizes (under 100 sq ft, 100-200, 200-300, 300-500, etc.)
- Include ALL space optimization techniques (vertical storage, mobile tools, fold-down surfaces, multi-function areas, etc.)
- Find data for ALL workshop types (garage, basement, shed, dedicated building, etc.)
- Research climate-specific considerations for Canadian workshops
- Include accessibility and ergonomic considerations
- Expand to cover specialized space needs (dust collection, finishing areas, lumber storage, etc.)
- Add any additional space optimization data you discover beyond the schema
- **CRITICAL: Include source URLs and citations like the excellent safety research**
- **Provide quantified efficiency data (space savings percentages, time improvements, cost reductions)**
- **Include specific measurements and dimensions for optimization techniques**
- **Reference Canadian academic studies, industry reports, and professional shop analyses**
- **Add trade-off analysis (efficiency gains vs. setup time, cost, accessibility)**

**Research Focus Areas:**
- Small Canadian woodworking workshop space utilization studies (under 300 sq ft)
- Canadian basement woodworking workshop specific optimization
- Woodworking tool placement efficiency research
- Storage vs. workspace balance studies for woodworking shops
- Traffic pattern optimization in small woodworking workshops
- Frequency-based woodworking tool placement studies
- Canadian climate considerations for workshop organization
- Provincial building code impacts on workshop layout

**Requirements:**
- Focus on workshops under 300 square feet
- Include specific space savings percentages with source citations
- Provide efficiency metrics and trade-offs with quantified data
- Include basement-specific considerations with measurements
- Include source URLs for verification (like the safety research)
- Mark priority as MEDIUM for space optimization
- **Follow the same thorough research approach as the safety findings**