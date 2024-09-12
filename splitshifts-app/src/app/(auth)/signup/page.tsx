import Button from '@/app/components/ui/buttons/button';
export default function SignUpPage() {
  return (
    <form action=''>
      <div>
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
      <Button variant='filled' type='submit'>Sign Up</Button>
    </form>
  );
}
