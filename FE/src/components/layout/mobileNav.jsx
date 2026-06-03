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
              <Link
                key={item.path}
                to={item.path}
                className="-mt-8 p-3 rounded-2xl shadow-lg shadow-blue-500/30"
                style={{ background: "linear-gradient(135deg, #3975E6, #9E4CC6)" }}
              >
                <item.icon className="w-6 h-6 text-white" />
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
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