# Mobile Tools Research Prompt

I need comprehensive research on mobile tool strategies for small Canadian woodworking workshops. Please provide findings using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant mobile tool findings:

## MOBILE TOOLS JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "mobile_tool_benefits": {
      "type": "array",
      "description": "ALL benefits of mobile tools, not just space savings and flexibility",
      "items": {
        "type": "object",
        "properties": {
          "benefit_type": {"type": "string", "description": "Any benefit type found"},
          "quantified_benefits": {"type": "object", "description": "Measured benefits"},
          "source": {"type": "string"},
          "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]}
        }
      }
    },
    "mobile_tool_requirements": {
      "type": "array",
      "description": "ALL requirements for mobile tools, not just casters, power, and dust",
      "items": {
        "type": "object",
        "properties": {
          "requirement_type": {"type": "string", "description": "Any requirement type"},
          "specifications": {"type": "object", "description": "Detailed specifications"},
          "source": {"type": "string"}
        }
      }
    },
    "tool_specific_analysis": {
      "type": "array",
      "description": "Mobile suitability for ALL woodworking tools, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "tool": {"type": "string", "description": "Any woodworking tool"},
          "mobile_suitability": {"type": "object", "description": "Suitability assessment"},
          "mobile_requirements": {"type": "object", "description": "Specific requirements"},
          "setup_time": {"type": "object", "description": "Time costs"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research mobile strategies for ALL woodworking tools (not just table saw, router table, workbench)
- Include ALL mobile tool benefits (space, flexibility, safety, cost, etc.)
- Find data for ALL mobile tool requirements (structural, electrical, dust collection, storage, etc.)
- Research tool-specific mobile solutions and constraints
- Include Canadian-specific considerations (climate, electrical codes, etc.)
- Expand to cover specialized mobile needs (dust collection routing, power management, etc.)
- Add any additional mobile tool data you discover beyond the schema

**Research Focus Areas:**
- Mobile vs. stationary woodworking tool space savings analysis
- Caster and mobility system requirements for woodworking tools
- Power distribution for mobile woodworking tools in Canadian workshops
- Dust collection efficiency with mobile woodworking setups
- Woodworking tool-specific mobile suitability analysis
- Setup/breakdown time costs for mobile woodworking tools
- Stability and accuracy impacts for woodworking operations
- Canadian electrical code compliance for mobile workshop tools
- Climate considerations for mobile tool storage in Canadian workshops

**Requirements:**
- Include specific space savings percentages
- Provide setup time costs for mobile configurations
- Focus on tools suitable for small workshops
- Include power and dust collection requirements
- Mark priority as HIGH for mobile tool strategies