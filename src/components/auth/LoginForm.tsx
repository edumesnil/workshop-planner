import { useState } from 'react'
import { Input, Button, Card, CardBody, CardHeader, Link } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-default-500">Enter your credentials to continue</p>
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
            errorMessage={error && error.includes('email') ? error : undefined}
          />
          <Input
            isRequired
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onValueChange={setPassword}
            errorMessage={error && error.includes('password') ? error : undefined}
          />

          {error && !error.includes('email') && !error.includes('password') && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <Button
            type="submit"
            color="primary"
            isLoading={loading}
            className="w-full"
          >
            Sign In
          </Button>

          <div className="flex flex-col gap-2 text-sm text-center">
            <Link href="/auth/forgot-password" size="sm">
              Forgot password?
            </Link>
            <p className="text-default-500">
              Don't have an account?{' '}
              <Link href="/auth/signup" size="sm">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
