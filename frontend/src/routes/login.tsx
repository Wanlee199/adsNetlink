import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useLogin } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { toast } from 'sonner'
import { FieldInfo } from '../components/ui/field'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: search.redirect as string | undefined,
    }
  },
})

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const search = Route.useSearch()
  
  const form = useForm({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value);
        toast.success('Login successful');
        
        if (search.redirect) {
          navigate({ to: search.redirect })
        } else {
          navigate({ to: '/' })
        }
      } catch (error: any) {
        toast.error('Login failed: ' + (error.message || 'Unknown error'));
      }
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field
              name="usernameOrEmail"
              validators={{
                onChange: loginSchema.shape.usernameOrEmail,
              }}
              children={(field) => (
                <FieldInfo field={field} label="Username or Email" placeholder="user@example.com" />
              )}
            />
            <form.Field
              name="password"
              validators={{
                onChange: loginSchema.shape.password,
              }}
              children={(field) => (
                <FieldInfo field={field} label="Password" type="password" placeholder="******" />
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting || loginMutation.isPending}>
                  {isSubmitting || loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
