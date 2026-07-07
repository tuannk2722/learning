import type { NextAuthConfig } from 'next-auth';

// Danh sách email có quyền admin
const ADMIN_EMAILS = ['admin@learnquest.com', 'admin@gmail.com'];

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const is_onboarded = (auth?.user as any)?.is_onboarded;
      const isAdmin = (auth?.user as any)?.role === 'admin';
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');
      const isOnAuthPages = nextUrl.pathname === '/login' || nextUrl.pathname === '/signup' || nextUrl.pathname === '/' || nextUrl.pathname === '/courses';
      // Các trang reset mật khẩu luôn public, không cần đăng nhập
      const isOnPasswordResetPages = nextUrl.pathname === '/forgot-password' || nextUrl.pathname === '/reset-password';

      if (isOnPasswordResetPages) return true;

      if (isLoggedIn) {
        // Admin: redirect về /admin nếu đang vào auth pages
        if (isAdmin) {
          if (isOnAuthPages || isOnOnboarding) {
            return Response.redirect(new URL('/admin', nextUrl));
          }
          // Cho phép admin truy cập mọi route
          return true;
        }

        // User thường không được vào trang admin
        if (isOnAdmin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }

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

      // Chưa đăng nhập cố vào /admin => về login
      if (isOnAdmin) return false;

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
        // Gán role dựa trên email
        const email = user.email ?? '';
        token.role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
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
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;