import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Progress } from '@heroui/react'
import { WorkshopDimensionsStep } from './WorkshopDimensionsStep'
import { ToolSelectionStep } from './ToolSelectionStep'
import { SummaryStep } from './SummaryStep'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'

type OnboardingStep = 1 | 2 | 3

interface WorkshopData {
  length: number
  width: number
  height: number
}

export function OnboardingFlow() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null)
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([])

  const handleWorkshopNext = (data: WorkshopData) => {
    setWorkshopData(data)
    setCurrentStep(2)
  }

  const handleToolsNext = (toolIds: string[]) => {
    setSelectedToolIds(toolIds)
    setCurrentStep(3)
  }

  const handleComplete = async () => {
    if (!user) return

    try {
      // Create workshop
      let workshopId: string | null = null

      if (workshopData) {
        const { data: workshop, error: workshopError } = await supabase
          .from('workshops')
          .insert({
            user_id: user.id,
            name: 'My Workshop',
            dimensions: {
              length: workshopData.length,
              width: workshopData.width,
              height: workshopData.height,
            },
            constraints: [],
          })
          .select()
          .single()

        if (workshopError) throw workshopError
        workshopId = workshop.id
      }

      // Add tools to user's collection
      if (selectedToolIds.length > 0 && workshopId) {
        // Get template details
        const { data: templates, error: templateError } = await supabase
          .from('tool_templates')
          .select('*')
          .in('id', selectedToolIds)

        if (templateError) throw templateError

        // Create user tools from templates
        const toolsToInsert = templates.map((template) => ({
          user_id: user.id,
          workshop_id: workshopId,
          name: template.name,
          type: template.category,
          dimensions: template.dimensions,
          is_mobile: template.is_mobile,
          power_requirement: template.power_requirement,
          dust_collection: template.dust_collection,
          min_clearance: template.min_clearance,
        }))

        const { error: toolsError } = await supabase
          .from('tools')
          .insert(toolsToInsert)

        if (toolsError) throw toolsError
      }

      // Mark onboarding as completed
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Onboarding completion error:', error)
      alert('Failed to complete setup. Please try again.')
    }
  }

  const handleSkip = async () => {
    if (!user) return

    try {
      await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      navigate('/dashboard')
    } catch (error) {
      console.error('Skip onboarding error:', error)
    }
  }

  const progress = (currentStep / 3) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-default-50 to-default-100">
      <div className="w-full max-w-2xl mb-8">
        <Progress
          value={progress}
          color="primary"
          className="mb-2"
          aria-label="Onboarding progress"
        />
        <p className="text-sm text-default-500 text-center">
          Step {currentStep} of 3
        </p>
      </div>

      {currentStep === 1 && (
        <WorkshopDimensionsStep
          onNext={handleWorkshopNext}
          onSkip={handleSkip}
        />
      )}

      {currentStep === 2 && (
        <ToolSelectionStep
          onNext={handleToolsNext}
          onBack={() => setCurrentStep(1)}
          onSkip={handleSkip}
        />
      )}

      {currentStep === 3 && (
        <SummaryStep
          workshop={workshopData}
          toolCount={selectedToolIds.length}
          onBack={() => setCurrentStep(2)}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
