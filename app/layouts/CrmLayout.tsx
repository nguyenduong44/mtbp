import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Loader2 } from "lucide-react";

export default function CrmLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

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

    const now = new Date();
    setCurrentDate(now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--crm-bg)]">
        <Loader2 className="animate-spin text-[var(--crm-navy)]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--crm-bg)] flex flex-col font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[14px] leading-[1.5] text-[var(--crm-text)]">
      {/* HEADER */}
      <header className="bg-[var(--crm-navy)] px-[28px] h-[62px] flex items-center justify-between sticky top-0 z-[200] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigate("/admin/crm")}>
          <div className="w-[34px] h-[34px] bg-[var(--crm-gold)] rounded-[7px] flex items-center justify-center font-[800] text-[15px] color-white text-white">M</div>
          <div>
            <div className="font-[700] text-[18px] text-white leading-tight">MTBP Agency</div>
            <div className="text-[11px] text-[rgba(255,255,255,0.55)]">Client Management Dashboard</div>
          </div>
        </div>
        <div className="text-[13px] text-[rgba(255,255,255,0.65)] hidden sm:block">
          {currentDate}
        </div>
        <button 
          onClick={() => navigate("/admin")}
          className="text-white/70 hover:text-white text-[12px] font-bold uppercase tracking-wider transition-colors"
        >
          Trở về Admin
        </button>
      </header>

      {/* MAIN */}
      <main className="max-w-[1440px] mx-auto w-full p-[28px_24px] flex-1">
        <Outlet />
      </main>

      {/* TOAST container would be handled by a component if needed, but I'll use standard toast if available or just keep it simple */}
    </div>
  );
}
