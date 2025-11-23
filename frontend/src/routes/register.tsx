import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useRegister } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { toast } from 'sonner'
import { FieldInfo } from '../components/ui/field'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

function RegisterPage() {
  const registerMutation = useRegister()
  const navigate = useNavigate()
  
  const form = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    validators: {
        // @ts-ignore
        onChange: registerSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const { confirmPassword, ...registerData } = value
        await registerMutation.mutateAsync(registerData);
        toast.success('Registration successful');
        navigate({ to: '/' })
      } catch (error: any) {
        toast.error('Registration failed: ' + (error.message || 'Unknown error'));
      }
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join us to book your favorite movies
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
              name="fullName"
              children={(field) => (
                <FieldInfo field={field} label="Full Name" placeholder="John Doe" />
              )}
            />
            <form.Field
              name="username"
              children={(field) => (
                <FieldInfo field={field} label="Username" placeholder="johndoe" />
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <FieldInfo field={field} label="Email" type="email" placeholder="john@example.com" />
              )}
            />
            <form.Field
              name="phone"
              children={(field) => (
                <FieldInfo field={field} label="Phone (Optional)" placeholder="0123456789" />
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <FieldInfo field={field} label="Password" type="password" placeholder="******" />
              )}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <FieldInfo field={field} label="Confirm Password" type="password" placeholder="******" />
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting || registerMutation.isPending}>
                  {isSubmitting || registerMutation.isPending ? 'Registering...' : 'Register'}
                </Button>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" search={{ redirect: undefined }} className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
