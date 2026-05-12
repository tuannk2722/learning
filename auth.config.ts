import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const is_onboarded = (auth?.user as any)?.is_onboarded;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');
      const isOnAuthPages = nextUrl.pathname === '/login' || nextUrl.pathname === '/signup' || nextUrl.pathname === '/' || nextUrl.pathname === '/courses';

      if (isLoggedIn) {
        if (!is_onboarded && !isOnOnboarding) {
          return Response.redirect(new URL('/onboarding', nextUrl));
        }
        if (is_onboarded && isOnOnboarding) {
          return Response.redirect(new URL('/dashboard/courses', nextUrl));
        }
        if (isOnAuthPages) {
          const target = is_onboarded ? '/dashboard/courses' : '/onboarding';
          return Response.redirect(new URL(target, nextUrl));
        }
      }

      if (isOnDashboard || isOnOnboarding) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.is_onboarded = (user as any).is_onboarded;
      }
      if (trigger === "update" && session) {
        token.is_onboarded = session.user?.is_onboarded ?? session.is_onboarded;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).is_onboarded = token.is_onboarded;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;