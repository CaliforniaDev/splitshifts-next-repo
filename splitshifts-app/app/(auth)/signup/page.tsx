'use client';
import { useState } from 'react';
import Button from '@/app/components/ui/buttons/button';
import TextField from '@/app/components/ui/inputs/text-field';
export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    inquiryType: '',
    message: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  return (
    <form action='' className='relative flex gap-4 border-4 p-10'>
      <TextField
        onChange={handleChange}
        label='First name'
        name='firstName'
        value={form.firstName}
        supportingText='*Required'
      />
      <TextField
        error="*Last name is required"
        onChange={handleChange}
        label='Last name'
        name='lastName'
        value={form.lastName}
        supportingText='*Required'
      />
   
    </form>
  );
}
   {
     /* <div>
        <label htmlFor='name'>Name</label>
        <input id='name' name='name' placeholder='Name' />
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' name='email' type='email' placeholder='Email' />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input id='password' name='password' type='password' />
      </div>
      <Button variant='filled' type='submit'>Sign Up</Button> */
   }