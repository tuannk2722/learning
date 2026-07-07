import AdminSidebar from "@/app/ui/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AdminSidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="md:ml-64">
        {children}
      </div>
    </div>
  );
}