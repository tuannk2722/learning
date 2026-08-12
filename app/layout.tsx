import type { Metadata } from "next";
import { auth } from "@/auth";
import { inter } from "./ui/fonts";
import { Footer } from "./ui/footer";
import "./ui/global.css";
import { Navigation } from "./ui/home/navigation";
import ConditionalNav from "./ui/conditional-nav";
import { getUserById } from "./lib/data/users";
import { Toaster } from 'sonner';
import { getEffectiveStreak } from "./lib/actions/streak";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Learning",
    default: "Learning – Online Learning Platform",
  },
  description:
    "Learning is a modern e-learning platform. Explore courses, study with flashcards, track your progress, and climb the leaderboard.",
  keywords: [
    "online learning",
    "e-learning",
    "courses",
    "flashcards",
    "education",
    "learning platform",
    "study",
  ],
  authors: [{ name: "Learning" }],
  creator: "Learning",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Learning",
    title: {
      template: "%s | Learning",
      default: "Learning – Online Learning Platform",
    },
    description:
      "Learning is a modern e-learning platform. Explore courses, study with flashcards, track your progress, and climb the leaderboard.",
    images: [
      {
        url: "/OG.png",
        width: 1200,
        height: 630,
        alt: "Learning – Online Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Learning",
      default: "Learning – Online Learning Platform",
    },
    description:
      "Learning is a modern e-learning platform. Explore courses, study with flashcards, track your progress, and climb the leaderboard.",
    images: ["/OG.png"],
  },
};

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
        {isLoggedIn ? (<ConditionalNav avatarUrl={avatarUrl} userName={userName} currentStreak={currentStreak} isAdmin={isAdmin} />) : (<Navigation />)}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
