# Professional Workshop Layout Research Prompt

I need research on how professional Canadian woodworking shops organize their layouts for different project types. Please provide findings using this JSON SCHEMA as a guide, but EXPAND BEYOND these examples to include ALL relevant professional layout findings:

## PROFESSIONAL WORKSHOP PATTERN SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "professional_layout_studies": {
      "type": "array",
      "description": "Studies for ALL types of professional woodworking shops, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "study_name": {"type": "string"},
          "shop_type": {"type": "string", "description": "Any woodworking shop type (furniture, cabinetry, millwork, restoration, etc.)"},
          "shop_size_range": {"type": "object"},
          "workflow_zones": {"type": "array", "description": "ALL workflow zones found"},
          "productivity_metrics": {"type": "object", "description": "Quantified productivity data"},
          "source": {"type": "string"},
          "source_url": {"type": "array", "items": {"type": "string"}, "description": "Source URLs for verification"},
          "efficiency_improvements": {"type": "object", "description": "Measured efficiency gains and cost savings"},
          "trade_offs": {"type": "object", "description": "Setup time, cost, accessibility impacts"},
          "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]}
        }
      }
    },
    "layout_optimization_principles": {
      "type": "array",
      "description": "ALL optimization principles found, not just examples",
      "items": {
        "type": "object",
        "properties": {
          "principle": {"type": "string", "description": "Any optimization principle"},
          "description": {"type": "string"},
          "quantified_benefit": {"type": "string"},
          "implementation": {"type": "string"},
          "source": {"type": "string"}
        }
      }
    }
  }
}
```

**IMPORTANT: This schema is a GUIDE, not a limitation. Please:**
- Research ALL types of woodworking shops (furniture, cabinetry, millwork, restoration, boat building, instrument making, etc.)
- Include shops of ALL sizes (small custom shops to large production facilities)
- Find data for ALL workflow optimization principles used in professional settings
- Research Canadian-specific shop organization practices
- Include seasonal and regional variations in shop organization
- Expand to cover specialized woodworking operations
- Add any additional professional layout data you discover beyond the schema

**Research Focus Areas:**
- Professional Canadian custom furniture shop layouts and efficiency studies
- Canadian cabinet manufacturing workflow organization research
- Industrial engineering principles for Canadian woodworking workshop layout
- Small Canadian woodworking shop adaptations of professional techniques
- Canadian woodworking industry benchmarks for layout efficiency metrics
- Zone separation and material flow optimization studies for woodworking
- Canadian woodworking industry best practices and standards
- Provincial regulations impact on workshop organization

**Requirements:**
- Focus on quantified efficiency metrics and measurements with specific percentages
- Include professional shop size ranges and productivity data with source citations
- Provide specific distance measurements and space percentages (inches/feet)
- Include trade-off analyses (efficiency vs. setup time, cost, accessibility)
- **CRITICAL: Include source URLs and citations like the excellent safety research**
- **Provide productivity improvement percentages and cost-benefit data**
- **Include specific measurements and dimensions for professional techniques**
- **Reference Canadian professional shop studies, industry reports, and trade organization data**
- **Add quantified efficiency data (productivity gains, time savings, cost reductions)**
- Source professional studies and industry research with verification URLs
- Mark priority as MEDIUM for professional layout strategies
- **Follow the same thorough research approach as the safety and workflow findings**