# Project Pattern Data Generation Prompt

I need specific layout patterns for different Canadian woodworking project types. Please provide data using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant pattern findings:

## PROJECT PATTERN SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "project_type_patterns": {
      "type": "array",
      "description": "Patterns for ALL woodworking project types, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "project_type": {"type": "string", "description": "Any woodworking project type (furniture, cabinetry, millwork, turning, carving, outdoor, repairs, etc.)"},
          "typical_projects": {"type": "array", "description": "Specific projects in this category"},
          "primary_tools_sequence": {"type": "array", "description": "Tool usage sequence for this project type"},
          "optimal_tool_arrangement": {"type": "object", "description": "Best tool layout for this project type with measurements"},
          "material_requirements": {"type": "object", "description": "Material handling needs with dimensions"},
          "workflow_bottlenecks": {"type": "array", "description": "Common bottlenecks and solutions"},
          "source": {"type": "string"},
          "source_url": {"type": "array", "items": {"type": "string"}, "description": "Source URLs for verification"},
          "efficiency_metrics": {"type": "object", "description": "Time savings, productivity gains, space utilization"},
          "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]}
        }
      }
    },
    "space_optimization_patterns": {
      "type": "array",
      "description": "Patterns for ALL workshop sizes and configurations, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "workshop_size_range": {"type": "string", "description": "Any workshop size range"},
          "recommended_pattern": {"type": "string", "description": "Optimal layout pattern"},
          "tool_arrangement": {"type": "string", "description": "Tool organization strategy"},
          "priority_tools": {"type": "array", "description": "Most important tools for this size"},
          "space_saving_techniques": {"type": "array", "description": "Space optimization methods"}
        }
      }
    },
    "skill_level_adaptations": {
      "type": "array",
      "description": "Layout adaptations for ALL skill levels, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "skill_level": {"type": "string", "description": "Any skill level (beginner, intermediate, advanced, professional)"},
          "layout_priorities": {"type": "array", "description": "What to prioritize for this skill level"},
          "safety_considerations": {"type": "array", "description": "Skill-specific safety needs"},
          "tool_recommendations": {"type": "array", "description": "Recommended tools for this level"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research ALL woodworking project types (furniture, cabinetry, millwork, turning, carving, outdoor projects, repairs, restoration, boat building, instrument making, etc.)
- Include patterns for ALL workshop sizes (under 100 sq ft to 1000+ sq ft)
- Find data for ALL skill levels (beginner to professional)
- Research seasonal and regional project variations
- Include specialized woodworking patterns (power carving, marquetry, steam bending, etc.)
- Expand to cover multi-use workshop patterns
- Add any additional pattern data you discover beyond the schema

**Focus Areas:**
- Common Canadian woodworking project types for each category
- Woodworking tool usage frequency and sequence for each project type
- Optimal woodworking tool arrangements and distances
- Material handling requirements for woodworking projects
- Common woodworking workflow bottlenecks and solutions
- Space-specific layout patterns for Canadian workshops
- Canadian lumber and material size considerations
- Climate-specific storage and workflow requirements

**Requirements:**
- Base patterns on real woodworking project workflows with quantified data
- Include specific measurements and distances (inches/feet)
- Focus on small workshop constraints (under 300 sq ft)
- Provide practical, implementable layout patterns with efficiency metrics
- Consider both efficiency and space limitations with trade-off analysis
- **CRITICAL: Include source URLs and citations like the excellent safety and workflow research**
- **Provide specific efficiency percentages and time savings data**
- **Include quantified measurements for all tool arrangements and distances**
- **Reference Canadian project patterns and regional workflow studies**
- **Add productivity improvement percentages and space utilization data**
- Mark priority as MEDIUM for project pattern optimization
- **Follow the same thorough research approach as the successful findings**