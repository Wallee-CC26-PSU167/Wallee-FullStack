import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Plus, BarChart3, MessageSquare, Settings } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: "Home",     path: "/dashboard"       },
  { icon: ArrowLeftRight,  label: "Transaksi", path: "/transaksi"    },
  { icon: Plus,            label: "Tambah",    path: "/add-transaction", isCenter: true },
  { icon: BarChart3,       label: "Analitik",  path: "/analitik"       },
  { icon: Settings,        label: "Pengaturan", path: "/settings"      },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 bg-white/70 backdrop-blur-md shadow-lg shadow-gray-200/50 border border-white/40 rounded-3xl px-2 pb-1 pt-1">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isCenter) {
            return (
              <div key={item.path} className="relative -mt-10 flex items-center justify-center">
                {/* Fake cutout background properly centered */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] bg-slate-50 rounded-[28px] z-0" />
                
                <Link
                  to={item.path}
                  className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg shadow-blue-500/40"
                  style={{ background: "linear-gradient(135deg, #3975E6, #9E4CC6)" }}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                "relative z-10 flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}