# Project Pattern Data Generation Prompt

I need specific layout patterns for different woodworking project types. Please provide data in this EXACT JSON format:

## PROJECT PATTERN DATA

```json
{
  "small_furniture_patterns": [
    {
      "project_type": "small_furniture",
      "typical_projects": ["side_table", "nightstand", "small_bookshelf", "coffee_table"],
      "primary_tools_sequence": [
        {"tool": "table_saw", "usage_frequency": "high", "stage": "rough_cutting"},
        {"tool": "router_table", "usage_frequency": "medium", "stage": "joinery"},
        {"tool": "workbench", "usage_frequency": "high", "stage": "assembly"},
        {"tool": "sanding_station", "usage_frequency": "medium", "stage": "finishing_prep"}
      ],
      "optimal_tool_triangle": {
        "primary": ["table_saw", "workbench", "router_table"],
        "max_distance_between": 84,
        "reasoning": "Most frequent tool transitions for small furniture"
      },
      "material_requirements": {
        "lumber_length": {"typical": 96, "max": 120, "unit": "inches"},
        "sheet_goods": false,
        "assembly_space": {"min": 48, "ideal": 72, "unit": "inches"}
      },
      "workflow_bottlenecks": [
        {"bottleneck": "lumber_to_saw_distance", "impact": "high", "solution": "close_lumber_storage"},
        {"bottleneck": "clamp_storage_access", "impact": "medium", "solution": "workbench_adjacent_storage"}
      ]
    }
  ],
  "cabinetry_patterns": [
    {
      "project_type": "cabinetry",
      "typical_projects": ["kitchen_cabinets", "bathroom_vanity", "built_in_storage", "entertainment_center"],
      "primary_tools_sequence": [
        {"tool": "panel_saw", "usage_frequency": "high", "stage": "sheet_goods_breakdown"},
        {"tool": "table_saw", "usage_frequency": "high", "stage": "precise_cuts"},
        {"tool": "drill_press", "usage_frequency": "high", "stage": "hardware_holes"},
        {"tool": "assembly_table", "usage_frequency": "high", "stage": "box_assembly"},
        {"tool": "edge_bander", "usage_frequency": "medium", "stage": "edge_finishing"}
      ],
      "optimal_tool_triangle": {
        "primary": ["panel_saw", "assembly_table", "drill_press"],
        "max_distance_between": 96,
        "reasoning": "Heavy sheet goods require minimal transport distances"
      },
      "material_requirements": {
        "sheet_goods": true,
        "sheet_size": {"length": 96, "width": 48, "unit": "inches"},
        "assembly_space": {"min": 96, "ideal": 120, "unit": "inches"},
        "material_support": "required_for_large_panels"
      },
      "workflow_bottlenecks": [
        {"bottleneck": "sheet_goods_handling", "impact": "high", "solution": "panel_saw_to_assembly_proximity"},
        {"bottleneck": "hardware_organization", "impact": "medium", "solution": "drill_press_storage_integration"}
      ]
    }
  ],
  "general_woodworking_patterns": [
    {
      "project_type": "general_woodworking",
      "typical_projects": ["repair_work", "small_projects", "hobby_builds", "mixed_projects"],
      "primary_tools_sequence": [
        {"tool": "workbench", "usage_frequency": "high", "stage": "all_stages"},
        {"tool": "table_saw", "usage_frequency": "medium", "stage": "cutting"},
        {"tool": "drill_press", "usage_frequency": "medium", "stage": "holes_and_joinery"},
        {"tool": "hand_tool_station", "usage_frequency": "high", "stage": "detail_work"}
      ],
      "optimal_tool_triangle": {
        "primary": ["workbench", "table_saw", "hand_tool_station"],
        "max_distance_between": 72,
        "reasoning": "Flexibility for varied project requirements"
      },
      "material_requirements": {
        "lumber_variety": true,
        "storage_flexibility": "high_priority",
        "workspace_adaptability": "essential"
      },
      "workflow_bottlenecks": [
        {"bottleneck": "tool_switching_time", "impact": "high", "solution": "central_workbench_location"},
        {"bottleneck": "material_variety_storage", "impact": "medium", "solution": "flexible_storage_system"}
      ]
    }
  ],
  "space_optimization_patterns": [
    {
      "workshop_size": "under_200_sqft",
      "recommended_pattern": "linear_workflow",
      "tool_arrangement": "wall_mounted_with_mobile_center",
      "priority_tools": ["workbench", "table_saw"],
      "space_saving_techniques": ["vertical_storage", "mobile_tools", "fold_down_surfaces"]
    },
    {
      "workshop_size": "200_300_sqft", 
      "recommended_pattern": "triangle_workflow",
      "tool_arrangement": "stationary_triangle_with_mobile_support",
      "priority_tools": ["table_saw", "workbench", "assembly_table"],
      "space_saving_techniques": ["mobile_support_tools", "overhead_storage"]
    }
  ]
}
```

**Focus Areas:**
- Common project types for each category
- Tool usage frequency and sequence for each project type
- Optimal tool arrangements and distances
- Material handling requirements
- Common workflow bottlenecks and solutions
- Space-specific layout patterns

**Requirements:**
- Base patterns on real woodworking project workflows
- Include specific measurements and distances
- Focus on small workshop constraints (under 300 sq ft)
- Provide practical, implementable layout patterns
- Consider both efficiency and space limitations