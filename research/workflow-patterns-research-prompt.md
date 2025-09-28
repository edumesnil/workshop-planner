# Workflow Patterns Research Prompt

I need woodworking workflow efficiency research for workshop layout optimization. Please provide findings in this EXACT JSON format:

## WORKFLOW PATTERNS DATA

```json
{
  "time_motion_studies": [
    {
      "study_name": "lumber_handling_efficiency",
      "workflow_sequence": ["lumber_storage", "table_saw", "assembly_table", "sanding_station"],
      "optimal_distances": {
        "lumber_to_saw": {"value": 72, "max": 96, "unit": "inches"},
        "saw_to_assembly": {"value": 60, "max": 84, "unit": "inches"},
        "assembly_to_sanding": {"value": 48, "max": 72, "unit": "inches"}
      },
      "efficiency_metrics": {
        "time_savings_percentage": 23,
        "motion_reduction_percentage": 31,
        "material_handling_improvement": 18
      },
      "source": "Industrial Engineering Study, Michigan Tech 2019",
      "project_types": ["small_furniture", "cabinetry"],
      "priority": "HIGH"
    },
    {
      "study_name": "crosscut_to_rip_workflow",
      "tool_sequence": ["crosscut_saw", "rip_saw", "workbench"],
      "setup_time_savings": {"percentage": 15, "minutes_saved": 8},
      "optimal_distance": {"value": 48, "max": 72, "unit": "inches"},
      "source": "Woodworking Efficiency Analysis 2020",
      "priority": "HIGH"
    }
  ],
  "project_workflows": [
    {
      "project_type": "small_furniture",
      "typical_sequence": [
        {"step": "rough_cut", "tools": ["table_saw"], "frequency": "high"},
        {"step": "joinery", "tools": ["router_table", "chisel_work"], "frequency": "medium"},
        {"step": "assembly", "tools": ["workbench", "clamps"], "frequency": "high"},
        {"step": "sanding", "tools": ["sanding_station"], "frequency": "medium"},
        {"step": "finishing", "tools": ["spray_booth", "drying_rack"], "frequency": "low"}
      ],
      "critical_tool_distances": {
        "saw_to_workbench": {"value": 72, "reasoning": "frequent_material_transfer"},
        "workbench_to_assembly": {"value": 60, "reasoning": "component_movement"}
      },
      "source": "Fine Woodworking Workshop Study 2021"
    },
    {
      "project_type": "cabinetry",
      "typical_sequence": [
        {"step": "sheet_goods_breakdown", "tools": ["panel_saw"], "frequency": "high"},
        {"step": "edge_banding", "tools": ["edge_bander"], "frequency": "high"},
        {"step": "drilling", "tools": ["drill_press"], "frequency": "high"},
        {"step": "assembly", "tools": ["assembly_table"], "frequency": "high"},
        {"step": "hardware_installation", "tools": ["workbench"], "frequency": "medium"}
      ],
      "material_flow_requirements": {
        "sheet_goods_support": {"length": 96, "width": 48, "unit": "inches"},
        "assembly_clearance": {"all_sides": 48, "unit": "inches"}
      },
      "source": "Cabinet Making Efficiency Research 2020"
    }
  ],
  "frequency_analysis": [
    {
      "tool": "table_saw",
      "usage_frequency": "daily",
      "accessibility_priority": "high",
      "optimal_placement": "central_location",
      "reasoning": "Most frequently used tool in 89% of projects"
    },
    {
      "tool": "workbench", 
      "usage_frequency": "daily",
      "accessibility_priority": "high",
      "optimal_placement": "near_assembly_area",
      "reasoning": "Primary assembly and detail work surface"
    }
  ]
}
```

**Research Focus Areas:**
- Time-motion studies for woodworking tasks
- Tool sequence optimization research
- Material flow patterns in workshops
- Project-specific workflow analysis (furniture vs. cabinetry)
- Tool usage frequency studies
- Distance/time relationships for common tasks

**Requirements:**
- Include specific distance measurements
- Provide efficiency gain percentages
- Focus on small furniture and cabinetry workflows
- Include source citations from academic studies
- Mark priority as HIGH for workflow efficiency