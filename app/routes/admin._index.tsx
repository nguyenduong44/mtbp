import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../supabase-client";
import { Palette, Building2, Settings2, Mail, ArrowRight } from "lucide-react";

type Counts = {
  projects: number;
  clients: number;
  categories: number;
  contacts: number;
};

export default function AdminIndex() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, clients: 0, categories: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const [
        { count: projects },
        { count: clients },
        { count: categories },
        { count: contacts },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: projects ?? 0,
        clients: clients ?? 0,
        categories: categories ?? 0,
        contacts: contacts ?? 0,
      });
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const cards = [
    { title: "Dự án", count: counts.projects, href: "/admin/projects", icon: Palette, color: "bg-blue-500" },
    { title: "Khách hàng", count: counts.clients, href: "/admin/clients", icon: Building2, color: "bg-purple-500" },
    { title: "Dịch vụ", count: counts.categories, href: "/admin/categories", icon: Settings2, color: "bg-orange-500" },
    { title: "Liên hệ mới", count: counts.contacts, href: "/admin/contacts", icon: Mail, color: "bg-cyan-500" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
        <p className="text-gray-500 mt-1">Chào mừng bạn quay trở lại hệ thống quản trị MTBP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              to={card.href}
              className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                </div>
                <div className={`${card.color} p-3 rounded-xl text-white`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                Xem chi tiết
                <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
