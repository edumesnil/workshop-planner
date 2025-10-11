import { Tabs, Tab } from '@heroui/react'
import { Workshop } from '@/types/workshop'
import { OverviewTab } from './OverviewTab'

interface WorkshopTabsProps {
  workshop: Workshop
  onUpdate: () => void
}

export function WorkshopTabs({ workshop }: WorkshopTabsProps) {
  return (
    <div className="mt-6">
      <Tabs aria-label="Workshop sections">
        <Tab key="overview" title="Overview">
          <div className="py-6">
            <OverviewTab workshop={workshop} />
          </div>
        </Tab>
        <Tab key="constraints" title="Constraints">
          <div className="py-6">
            <p className="text-default-500">
              Constraint management coming in next step
            </p>
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
