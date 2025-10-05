-- Add onboarding_completed column to user_profiles table
-- Migration: 2025-10-05 - Add onboarding tracking

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add index for querying onboarding status
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding
ON user_profiles(onboarding_completed);

-- Comment
COMMENT ON COLUMN user_profiles.onboarding_completed IS 'Whether the user has completed the onboarding flow';
