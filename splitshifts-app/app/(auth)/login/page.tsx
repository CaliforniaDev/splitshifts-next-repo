'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Form } from '@/app/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {nameSchema, passwordSchema } from '@/validation/authSchema';

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema
})

type LoginFormData = z.infer<typeof formSchema>

export default function LogIn() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })
  const handleSubmit = async (data: LoginFormData) => {
    console.log('submitting', data)
  }

  return (
    <main className='flex min-h-screen justify-center'>
      <Card className='w-[720px] shadow-elevation-0'>
        <CardHeader>
          <CardTitle>
            Login to your account
          </CardTitle>
          <CardDescription className='typescale-body-large'>
            Enter your email and password to log in.
          </CardDescription>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>

              </form>
            </Form>

          </CardContent>
        </CardHeader>
      </Card>

    </main>
  )
}