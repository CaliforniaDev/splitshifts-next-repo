import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email?: string | null;
    orgId?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      email?: string | null;
      orgId?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    orgId?: string | null;
  }
}