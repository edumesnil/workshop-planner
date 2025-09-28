# Safety Constraints Research Prompt

I need comprehensive woodworking workshop safety research for layout optimization. Please provide findings in this EXACT JSON format:

## SAFETY CONSTRAINTS DATA

```json
{
  "safety_findings": [
    {
      "tool": "table_saw",
      "requirement_type": "clearance",
      "measurements": {
        "front": {"min": 96, "ideal": 120, "unit": "inches"},
        "back": {"min": 48, "ideal": 60, "unit": "inches"},
        "sides": {"min": 36, "ideal": 48, "unit": "inches"}
      },
      "source": "OSHA 1910.213",
      "reasoning": "Blade contact accident prevention",
      "accident_reduction_percentage": 67,
      "priority": "REQUIRED"
    },
    {
      "tool": "band_saw",
      "requirement_type": "clearance",
      "measurements": {
        "front": {"min": 72, "ideal": 96, "unit": "inches"},
        "back": {"min": 36, "ideal": 48, "unit": "inches"},
        "sides": {"min": 30, "ideal": 36, "unit": "inches"}
      },
      "source": "ANSI Safety Standard",
      "reasoning": "Operator safety and material handling",
      "accident_reduction_percentage": 45,
      "priority": "REQUIRED"
    }
  ],
  "workshop_safety": [
    {
      "requirement": "emergency_egress",
      "min_width": {"value": 36, "unit": "inches"},
      "max_distance_to_exit": {"value": 50, "unit": "feet"},
      "source": "OSHA 1910.36",
      "reasoning": "Emergency evacuation requirements",
      "priority": "REQUIRED"
    },
    {
      "requirement": "fire_extinguisher_access",
      "max_distance": {"value": 30, "unit": "feet"},
      "clearance_around": {"value": 36, "unit": "inches"},
      "source": "NFPA 10",
      "reasoning": "Fire safety accessibility",
      "priority": "REQUIRED"
    }
  ],
  "electrical_safety": [
    {
      "requirement": "electrical_panel_clearance",
      "front_clearance": {"min": 36, "ideal": 48, "unit": "inches"},
      "side_clearance": {"min": 30, "unit": "inches"},
      "source": "NEC 110.26",
      "reasoning": "Electrical code compliance",
      "priority": "REQUIRED"
    }
  ]
}
```

**Research Focus Areas:**
- OSHA guidelines for woodworking tool clearances
- ANSI safety standards for workshop equipment
- Accident prevention studies with specific statistics
- Emergency egress requirements
- Electrical safety standards (NEC codes)
- Fire safety requirements (NFPA standards)
- Dust collection safety protocols

**Requirements:**
- Include specific measurements in inches/feet
- Provide source citations (OSHA, ANSI, NEC, NFPA)
- Include accident reduction percentages where available
- Focus only on layout-relevant safety constraints
- Mark priority as REQUIRED for all safety items