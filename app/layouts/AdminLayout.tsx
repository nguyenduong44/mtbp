import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import {
  LayoutDashboard,
  Palette,
  Building2,
  Settings2,
  Briefcase,
  Mail,
  LogOut,
  Menu,
  X,
  CheckSquare,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/admin/crm", label: "Quản lý Task", icon: CheckSquare },
  { href: "/admin/projects", label: "Dự án", icon: Palette },
  { href: "/admin/clients", label: "Khách hàng", icon: Building2 },
  { href: "/admin/industries", label: "Ngành nghề", icon: Briefcase },
  { href: "/admin/categories", label: "Dịch vụ", icon: Settings2 },
  { href: "/admin/contacts", label: "Liên hệ", icon: Mail },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });

    return () => listener?.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="p-6 border-b flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">MTBP Admin</span>
        {onNavigate && (
          <button onClick={onNavigate}>
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavLinks onNavigate={onNavigate} />
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-4 bg-white border-b md:hidden flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-600"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold">MTBP Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
