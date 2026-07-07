import { auth } from "@/auth";
import { inter } from "./ui/fonts";
import { Footer } from "./ui/footer";
import "./ui/global.css";
import { Navigation } from "./ui/home/navigation";
import SideNav from "./ui/dashboard/sidenav";
import { getUserById } from "./lib/data/users";
import { Toaster } from 'sonner';
import { getEffectiveStreak } from "./lib/actions/streak";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAdmin = (session?.user as any)?.role === 'admin';
  let avatarUrl = null;
  let userName = null;
  let currentStreak = 0;

  if (isLoggedIn && session?.user?.id) {
    const userInfo = await getUserById(session.user.id);
    if (userInfo) {
      avatarUrl = userInfo.avatar_url;
      userName = userInfo.name;
      currentStreak = await getEffectiveStreak(userInfo.current_streak, userInfo.last_study_date);
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-100`}>
        {isLoggedIn ? (<SideNav avatarUrl={avatarUrl} userName={userName} currentStreak={currentStreak} isAdmin={isAdmin} />) : (<Navigation />)}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
