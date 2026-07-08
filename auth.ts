import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUserByEmail } from './app/lib/data/users';
import { db } from './app/lib/db';
import { users } from './app/lib/db/schema';
import { logActivity } from './app/lib/actions/activity-log';

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password_hash) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password_hash);

          if (passwordsMatch) {
            // Gắn rememberMe vào user object để jwt callback có thể đọc
            return {
              ...user,
              rememberMe: (credentials as any).rememberMe === 'true',
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        // Log login event for credentials
        void logActivity({
          userId: (user as any).id ?? null,
          action: 'USER_LOGIN',
          entityType: 'user',
          entityName: user.name ?? undefined,
          metadata: { provider: 'credentials' },
        });
        return true;
      }

      if (account?.provider === 'google') {
        try {
          const email = user.email;
          if (!email) return false;

          let dbUser = await getUserByEmail(email);
          let isNewUser = false;

          if (!dbUser) {
            const insertResult = await db.insert(users).values({
              name: user.name || 'User',
              email: email,
              avatar_url: user.image,
              is_onboarded: false,
            }).returning();

            if (insertResult.length > 0) {
              dbUser = {
                id: insertResult[0].id,
                name: insertResult[0].name,
                email: insertResult[0].email,
                is_onboarded: insertResult[0].is_onboarded ?? false,
              };
              isNewUser = true;
            }
          }

          if (dbUser) {
            user.id = dbUser.id;
            (user as any).is_onboarded = dbUser.is_onboarded;

            // Log register or login
            void logActivity({
              userId: dbUser.id,
              action: isNewUser ? 'USER_REGISTER' : 'USER_LOGIN',
              entityType: 'user',
              entityName: dbUser.name ?? undefined,
              metadata: { provider: 'google' },
            });

            return true;
          }

          return false;
        } catch (error) {
          console.error("OAuth login error:", error);
          return false;
        }
      }
      return true;
    }
  }

});
