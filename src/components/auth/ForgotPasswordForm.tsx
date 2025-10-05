import { useState } from 'react'
import { Input, Button, Card, CardBody, CardHeader, Link } from '@heroui/react'
import { supabase } from '@/services/supabase'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold">Check Your Email</h1>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-default-500">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-default-500">
              Check your inbox and click the link to reset your password.
            </p>
            <Link href="/auth/login" size="sm" className="text-center">
              Back to sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-default-500">Enter your email to receive a reset link</p>
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

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <Button
            type="submit"
            color="primary"
            isLoading={loading}
            className="w-full"
          >
            Send Reset Link
          </Button>

          <Link href="/auth/login" size="sm" className="text-center">
            Back to sign in
          </Link>
        </form>
      </CardBody>
    </Card>
  )
}
