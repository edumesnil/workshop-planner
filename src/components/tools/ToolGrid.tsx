import { useState, useMemo } from 'react'
import { Input, Select, SelectItem, Button } from '@heroui/react'
import { ToolRow } from '@/types/database'
import { TOOL_CATEGORY_LABELS } from '@/types/toolCategory'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  tools: ToolRow[]
  onEdit: (tool: ToolRow) => void
  onDelete: (tool: ToolRow) => void
  onCreateClick: () => void
}

export function ToolGrid({ tools, onEdit, onDelete, onCreateClick }: ToolGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.type?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [tools, searchQuery, categoryFilter])

  const categoryOptions = [
    { key: 'all', label: 'All Categories' },
    ...Object.entries(TOOL_CATEGORY_LABELS).map(([key, label]) => ({
      key,
      label
    }))
  ]

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          className="flex-1"
          placeholder="Search tools..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          isClearable
        />
        <Select
          className="sm:w-64"
          placeholder="Category"
          selectedKeys={[categoryFilter]}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categoryOptions.map((option) => (
            <SelectItem key={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-default-500">
          {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          {(searchQuery || categoryFilter !== 'all') && ` (filtered from ${tools.length})`}
        </p>
      </div>

      {/* Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-default-500 mb-4">
            {searchQuery || categoryFilter !== 'all'
              ? 'No tools match your filters'
              : 'No tools in your library yet'}
          </p>
          <Button color="primary" onPress={onCreateClick}>
            Add Your First Tool
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
