'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import Input from '@/app/components/ui/inputs/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/app/components/ui/form';

import Button from '@/app/components/ui/buttons/button';

const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    ),
  passwordConfirm: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });
  const submitHandler = async (data: FormData) => {};
  return (
    <main className='flex min-h-screen justify-center'>
      <Card className='w-[720px] shadow-elevation-0'>
        <CardHeader>
          <CardTitle>Welcome | Sign Up Today</CardTitle>
          <CardDescription className='typescale-body-large'>
            Already have an account? Log In
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className='space-y-8'
              onSubmit={form.handleSubmit(submitHandler)}
            >
              <div className='flex space-x-4'>
                <FormField
                  name='firstName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem className='w-1/2'>
                      <FormControl>
                        <Input
                          {...field}
                          label='First Name *'
                          type='text'
                          onBlur={field.onBlur}
                          error={!!fieldState.error}
                          errorMessage='First name is required'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='lastName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem className='w-1/2'>
                      <FormControl>
                        <Input
                          {...field}
                          label='Last Name *'
                          type='text'
                          onBlur={field.onBlur}
                          error={!!fieldState.error}
                          errorMessage='Last name is required'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        {...field}
                        label='Email *'
                        error={!!fieldState.error}
                        onBlur={field.onBlur}
                        errorMessage='Invalid email address'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex space-x-4'>
                <FormField
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem className='w-1/2'>
                      <FormControl>
                        <Input
                          {...field}
                          label='Password *'
                          type='password'
                          onBlur={field.onBlur}
                          error={!!fieldState.error}
                          errorMessage='Password must be at least 8 characters and contain at least one special character'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='passwordConfirm'
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className='w-1/2'>
                        <FormControl>
                          <Input
                            {...field}
                            label='Confirm Password *'
                            type='password'
                            onBlur={field.onBlur}
                            error={!!fieldState.error}
                            errorMessage='Passwords do not match'
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Button className='w-full' type='submit' variant='filled'>
                Get Started
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
