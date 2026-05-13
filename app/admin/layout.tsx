
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div>{children}</div>
    </div>
  );
}