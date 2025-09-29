# Workflow Patterns Research Prompt

I need woodworking workshop workflow efficiency research for layout optimization. Please provide findings using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant workflow findings:

## WORKFLOW PATTERNS JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "time_motion_studies": {
      "type": "array",
      "description": "Comprehensive time-motion studies for ALL woodworking workflows, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "study_name": {"type": "string"},
          "workflow_sequence": {"type": "array", "items": {"type": "string"}, "description": "Any woodworking workflow sequence"},
          "optimal_distances": {"type": "object", "description": "Distances between any tools in workflow"},
          "efficiency_metrics": {"type": "object", "description": "Time savings, motion reduction, etc."},
          "source": {"type": "string"},
          "project_types": {"type": "array", "items": {"type": "string"}, "description": "ALL project types this applies to"},
          "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]}
        }
      }
    },
    "project_workflows": {
      "type": "array",
      "description": "Workflows for ALL woodworking project types, not just furniture and cabinetry",
      "items": {
        "type": "object",
        "properties": {
          "project_type": {"type": "string", "description": "Any woodworking project (furniture, cabinetry, millwork, turning, carving, outdoor projects, repairs, etc.)"},
          "typical_sequence": {"type": "array", "description": "Complete workflow sequence for this project type"},
          "critical_tool_distances": {"type": "object", "description": "Important tool spacing for this project type"},
          "material_requirements": {"type": "object", "description": "Material handling needs"},
          "source": {"type": "string"}
        }
      }
    },
    "frequency_analysis": {
      "type": "array",
      "description": "Usage frequency for ALL woodworking tools, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "tool": {"type": "string", "description": "Any woodworking tool"},
          "usage_frequency": {"type": "string", "enum": ["daily", "weekly", "monthly", "occasional"]},
          "accessibility_priority": {"type": "string", "enum": ["high", "medium", "low"]},
          "optimal_placement": {"type": "string"},
          "reasoning": {"type": "string"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research ALL woodworking project types (furniture, cabinetry, millwork, turning, carving, outdoor projects, repairs, custom work, etc.)
- Include workflows for ALL skill levels (beginner, intermediate, professional)
- Find data for ALL woodworking tools and their usage patterns
- Research seasonal workflows and project variations
- Include data for different workshop sizes and configurations
- Expand to cover specialized woodworking (boat building, instrument making, restoration, etc.)
- Add any additional workflow data you discover beyond the schema

**Research Focus Areas:**
- Time-motion studies for Canadian woodworking workshop operations
- Tool sequence optimization research for small woodworking shops
- Material flow patterns in Canadian woodworking workshops
- Project-specific workflow analysis for woodworking (furniture vs. cabinetry)
- Tool usage frequency studies in Canadian woodworking operations
- Distance/time relationships for common woodworking tasks
- Canadian woodworking industry productivity studies
- Small shop woodworking workflow optimization research

**Requirements:**
- Include specific distance measurements
- Provide efficiency gain percentages
- Focus on small furniture and cabinetry workflows
- Include source citations from academic studies
- Mark priority as HIGH for workflow efficiency