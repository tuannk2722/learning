import { auth } from "@/auth";
import { inter } from "./ui/fonts";
import { Footer } from "./ui/footer";
import "./ui/global.css";
import { Navigation } from "./ui/home/navigation";
import SideNav from "./ui/dashboard/sidenav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-100`}>
        {isLoggedIn ? (<SideNav />) : (<Navigation />)}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
