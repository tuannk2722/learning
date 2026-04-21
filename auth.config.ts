import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAuthPages = nextUrl.pathname === '/login' || nextUrl.pathname === '/signup' || nextUrl.pathname === '/' || nextUrl.pathname === '/courses';
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && isOnAuthPages) {
        // Chỉ khi đang mở trang Login/Signup thì mới đá vào Dashboard
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      // Khi user đăng nhập thành công, NextAuth sẽ truyền object user vào đây
      // Ta lấy id của user gắn vào token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // Hàm này chạy mỗi khi gọi await auth()
      // Ta gán id từ token sang biến session.user để tiện sử dụng
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;