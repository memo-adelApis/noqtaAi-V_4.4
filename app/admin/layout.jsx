import AdminSidebar from "@/components/admin/AdminSidebar"; // استدعاء المكون الجديد

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white" dir="rtl">
      
      {/* استدعاء الشريط الجانبي (Client Component) */}
      <AdminSidebar />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}