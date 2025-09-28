# Scoring Algorithm Data Generation Prompt

I need scoring algorithm data for a multi-objective workshop layout optimizer. Please provide data in this EXACT JSON format:

## SCORING ALGORITHM DATA

```json
{
  "scoring_weights": {
    "safety": 0.30,
    "workflow_efficiency": 0.30, 
    "space_utilization": 0.20,
    "accessibility": 0.20
  },
  "safety_scoring": {
    "perfect_score": 100,
    "scoring_criteria": [
      {
        "criterion": "osha_clearance_compliance",
        "weight": 0.40,
        "calculation": "percentage_of_tools_meeting_clearance",
        "penalty_per_violation": 25
      },
      {
        "criterion": "emergency_egress",
        "weight": 0.35,
        "calculation": "egress_path_width_vs_minimum",
        "minimum_required": 36,
        "penalty_below_minimum": 50
      },
      {
        "criterion": "electrical_safety",
        "weight": 0.15,
        "calculation": "electrical_panel_clearance_compliance",
        "penalty_per_violation": 20
      },
      {
        "criterion": "fire_safety_access",
        "weight": 0.10,
        "calculation": "fire_extinguisher_accessibility",
        "max_distance": 30,
        "penalty_per_foot_over": 5
      }
    ]
  },
  "workflow_efficiency_scoring": {
    "perfect_score": 100,
    "scoring_criteria": [
      {
        "criterion": "tool_sequence_optimization",
        "weight": 0.35,
        "calculation": "sum_of_optimal_tool_distances",
        "optimal_distances": {
          "lumber_to_saw": 72,
          "saw_to_assembly": 60,
          "assembly_to_sanding": 48
        },
        "penalty_per_inch_over_optimal": 0.5
      },
      {
        "criterion": "material_flow_efficiency",
        "weight": 0.25,
        "calculation": "material_transport_distance_score",
        "ideal_max_transport": 96,
        "penalty_per_inch_over": 0.3
      },
      {
        "criterion": "frequency_based_placement",
        "weight": 0.25,
        "calculation": "high_frequency_tool_accessibility",
        "high_frequency_tools": ["table_saw", "workbench"],
        "max_steps_from_center": 10,
        "penalty_per_extra_step": 3
      },
      {
        "criterion": "workflow_triangle_efficiency",
        "weight": 0.15,
        "calculation": "primary_triangle_perimeter_score",
        "ideal_perimeter": 180,
        "max_acceptable_perimeter": 240,
        "penalty_per_inch_over_ideal": 0.2
      }
    ]
  },
  "space_utilization_scoring": {
    "perfect_score": 100,
    "scoring_criteria": [
      {
        "criterion": "floor_space_efficiency",
        "weight": 0.40,
        "calculation": "used_space_vs_total_space",
        "optimal_utilization": 0.75,
        "penalty_for_under_utilization": 30,
        "penalty_for_over_utilization": 40
      },
      {
        "criterion": "mobile_tool_optimization",
        "weight": 0.30,
        "calculation": "mobile_vs_stationary_space_savings",
        "space_savings_bonus": 2,
        "setup_time_penalty": 1
      },
      {
        "criterion": "vertical_storage_utilization",
        "weight": 0.20,
        "calculation": "wall_storage_vs_floor_storage",
        "vertical_storage_bonus": 15
      },
      {
        "criterion": "multi_function_space_usage",
        "weight": 0.10,
        "calculation": "shared_vs_dedicated_surfaces",
        "multi_function_bonus": 10
      }
    ]
  },
  "accessibility_scoring": {
    "perfect_score": 100,
    "scoring_criteria": [
      {
        "criterion": "tool_accessibility",
        "weight": 0.40,
        "calculation": "average_tool_access_difficulty",
        "max_acceptable_reach": 72,
        "penalty_per_inch_over": 1
      },
      {
        "criterion": "storage_accessibility", 
        "weight": 0.25,
        "calculation": "storage_reach_and_height_score",
        "optimal_height_range": {"min": 24, "max": 72},
        "penalty_outside_range": 2
      },
      {
        "criterion": "workspace_flexibility",
        "weight": 0.20,
        "calculation": "reconfiguration_ease_score",
        "mobile_tool_bonus": 15,
        "fixed_tool_penalty": 5
      },
      {
        "criterion": "traffic_flow",
        "weight": 0.15,
        "calculation": "pathway_width_and_clarity",
        "min_pathway_width": 36,
        "penalty_below_minimum": 10
      }
    ]
  },
  "bonus_scoring": {
    "efficiency_bonuses": [
      {
        "condition": "all_safety_requirements_met",
        "bonus": 5,
        "description": "Perfect safety compliance bonus"
      },
      {
        "condition": "workflow_triangle_under_180_inches",
        "bonus": 10,
        "description": "Optimal workflow triangle bonus"
      },
      {
        "condition": "mobile_tool_percentage_over_60",
        "bonus": 8,
        "description": "High mobile tool utilization bonus"
      }
    ],
    "penalty_conditions": [
      {
        "condition": "any_safety_violation",
        "penalty": 20,
        "description": "Safety violation penalty"
      },
      {
        "condition": "workflow_triangle_over_240_inches",
        "penalty": 15,
        "description": "Inefficient workflow penalty"
      },
      {
        "condition": "space_utilization_under_50_percent",
        "penalty": 25,
        "description": "Poor space utilization penalty"
      }
    ]
  },
  "scoring_formulas": {
    "overall_score_calculation": "weighted_sum_of_categories + bonuses - penalties",
    "safety_score": "100 - sum_of_safety_penalties",
    "workflow_score": "100 - sum_of_workflow_penalties", 
    "space_score": "100 - sum_of_space_penalties",
    "accessibility_score": "100 - sum_of_accessibility_penalties"
  }
}
```

**Focus Areas:**
- Multi-objective scoring with appropriate weights (30% safety, 30% workflow, 20% space, 20% accessibility)
- Specific penalty calculations for constraint violations
- Bonus systems for exceptional layouts
- Mathematical formulas for each scoring component
- Quantifiable metrics for layout quality assessment

**Requirements:**
- Provide specific penalty values and calculation methods
- Include bonus conditions for exceptional layouts
- Focus on measurable, quantifiable scoring criteria
- Balance competing objectives (safety vs. efficiency vs. space)
- Create actionable scoring that guides optimization algorithms