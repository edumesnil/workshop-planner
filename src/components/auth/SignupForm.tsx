import { useState } from 'react'
import { Input, Button, Card, CardBody, CardHeader, Link } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'

export function SignupForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Create user profile with default preferences
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            preferences: {
              constraint_weights: {
                safety: 40,
                workflow: 25,
                space_efficiency: 20,
                accessibility: 15,
              },
            },
            onboarding_completed: false,
          })

        if (profileError) throw profileError
      }

      navigate('/onboarding')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-default-500">Sign up to start planning your workshop</p>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onValueChange={setEmail}
          />
          <Input
            isRequired
            type="password"
            label="Password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onValueChange={setPassword}
            description="Password must be at least 6 characters"
          />
          <Input
            isRequired
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <Button
            type="submit"
            color="primary"
            isLoading={loading}
            className="w-full"
          >
            Create Account
          </Button>

          <p className="text-sm text-center text-default-500">
            Already have an account?{' '}
            <Link href="/auth/login" size="sm">
              Sign in
            </Link>
          </p>
        </form>
      </CardBody>
    </Card>
  )
}
