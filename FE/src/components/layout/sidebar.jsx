// src/layouts/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ArrowLeftRight,
  BarChart3,
  MessageSquare,
  Plus,
} from "lucide-react";
import WalleeLogo from "/Users/macbookpro2019/Documents/Dicoding/wallee/FE/src/assets/Logo_Full.png";

const NAV_ITEMS = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/transaksi", icon: ArrowLeftRight,     label: "Transaksi" },
  { to: "/analytics",      icon: BarChart3,       label: "Analitik"      },
  { to: "/aichat",      icon: MessageSquare,        label: "AI Assistant"   },
  { to: "/settings",     icon: Settings,        label: "Pengaturan"     },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30">

      <div className="p-4 border-b border-gray-100">
        <img src={WalleeLogo} alt="Wallee Logo" />
      </div>

      <div className="px-4 mb-2 mt-4">
        <NavLink
          to="/add-transaction"
          className="bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] flex items-center justify-center gap-2 text-white rounded-xl py-3 px-4 text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </NavLink>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-purple-50 text-purple-600"       
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900", 
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.75}
                      className="flex-shrink-0"
                    />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tombol Keluar */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => console.log("logout")} // ganti dengan fungsi logout kamu
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} className="flex-shrink-0" />
          Keluar
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;;