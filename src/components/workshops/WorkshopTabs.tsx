import { Tabs, Tab } from '@heroui/react'
import { Workshop } from '@/types/workshop'
import { OverviewTab } from './OverviewTab'
import { ConstraintsTab } from './ConstraintsTab'

interface WorkshopTabsProps {
  workshop: Workshop
  onUpdate: (updates: Partial<Workshop>) => void
  selectedTab: string
  onTabChange: (tab: string) => void
}

export function WorkshopTabs({ workshop, onUpdate, selectedTab, onTabChange }: WorkshopTabsProps) {
  return (
    <div className="mt-6">
      <Tabs
        aria-label="Workshop sections"
        selectedKey={selectedTab}
        onSelectionChange={(key) => onTabChange(key as string)}
      >
        <Tab key="overview" title="Overview">
          <div className="py-6">
            <OverviewTab workshop={workshop} />
          </div>
        </Tab>
        <Tab key="constraints" title="Constraints">
          <div className="py-6">
            <ConstraintsTab workshop={workshop} onUpdate={onUpdate} />
          </div>
        </Tab>
        <Tab key="tools" title="Tools">
          <div className="py-6">
            <p className="text-default-500">
              Tool management coming in Phase 4
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
