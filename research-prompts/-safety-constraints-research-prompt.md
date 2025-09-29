# Safety Constraints Research Prompt

I need comprehensive woodworking workshop safety research for layout optimization, prioritizing Canadian safety standards. Please provide findings using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant safety findings:

## SAFETY CONSTRAINTS JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "safety_findings": {
      "type": "array",
      "description": "Safety constraints for ALL woodworking tools, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "tool": {"type": "string", "description": "Any woodworking tool (table_saw, band_saw, router, planer, jointer, drill_press, miter_saw, lathe, etc.)"},
          "requirement_type": {"type": "string", "enum": ["clearance", "ventilation", "power", "stability"]},
          "measurements": {
            "type": "object",
            "properties": {
              "front": {"type": "object", "properties": {"min": {"type": "number"}, "ideal": {"type": "number"}, "unit": {"type": "string"}}},
              "back": {"type": "object", "properties": {"min": {"type": "number"}, "ideal": {"type": "number"}, "unit": {"type": "string"}}},
              "sides": {"type": "object", "properties": {"min": {"type": "number"}, "ideal": {"type": "number"}, "unit": {"type": "string"}}}
            }
          },
          "source": {"type": "string", "description": "Canadian safety standard reference"},
          "reasoning": {"type": "string"},
          "accident_reduction_percentage": {"type": "number"},
          "priority": {"type": "string", "enum": ["REQUIRED"]}
        },
        "required": ["tool", "requirement_type", "measurements", "source", "reasoning", "priority"]
      }
    },
    "workshop_safety": {
      "type": "array",
      "description": "General workshop safety requirements beyond tool-specific",
      "items": {
        "type": "object",
        "properties": {
          "requirement": {"type": "string", "description": "Emergency egress, fire safety, ventilation, lighting, etc."},
          "measurements": {"type": "object"},
          "source": {"type": "string"},
          "reasoning": {"type": "string"},
          "priority": {"type": "string", "enum": ["REQUIRED"]}
        }
      }
    },
    "electrical_safety": {
      "type": "array",
      "description": "Electrical safety requirements for woodworking workshops",
      "items": {
        "type": "object",
        "properties": {
          "requirement": {"type": "string", "description": "Panel clearance, outlet placement, grounding, etc."},
          "measurements": {"type": "object"},
          "source": {"type": "string"},
          "reasoning": {"type": "string"},
          "priority": {"type": "string", "enum": ["REQUIRED"]}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Include ALL woodworking tools you can find safety data for, not just table saws and band saws
- Research ALL types of safety requirements (clearances, ventilation, electrical, fire, dust, noise, etc.)
- Find data for specialized woodworking operations (turning, carving, finishing, etc.)
- Include requirements for workshop infrastructure (lighting, flooring, ceiling height, etc.)
- Expand beyond the schema properties if you find additional relevant data

**Research Focus Areas:**
- CSA (Canadian Standards Association) guidelines for woodworking tool clearances
- CCOHS (Canadian Centre for Occupational Health and Safety) woodworking safety standards
- WorkSafeBC and provincial WCB woodworking safety requirements
- Canadian Building Code and Fire Code requirements for workshops
- Canadian Electrical Code (CEC) standards for workshop electrical safety
- Accident prevention studies specific to Canadian woodworking operations
- Dust collection safety protocols for Canadian workshops
- Provincial occupational health and safety regulations for woodworking

**Requirements:**
- Include specific measurements in inches/feet
- Provide source citations (CSA, CCOHS, CEC, NBC, NFC, provincial WCB/WorkSafe)
- Include accident reduction percentages where available
- Focus only on layout-relevant safety constraints
- Mark priority as REQUIRED for all safety items