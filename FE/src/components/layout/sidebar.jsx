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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import WalleeLogo from "../../assets/Logo_Full.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/transaksi", icon: ArrowLeftRight,     label: "Transaksi" },
  { to: "/analitik",      icon: BarChart3,       label: "Analitik"      },
  { to: "/settings",     icon: Settings,        label: "Pengaturan"     },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors z-40"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`p-4 border-b border-gray-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-xl bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] flex items-center justify-center text-white font-bold text-lg">
            W
          </div>
        ) : (
          <img src={WalleeLogo} alt="Wallee Logo" className="h-8 w-auto object-contain" />
        )}
      </div>

      <div className="px-4 mb-2 mt-4 flex justify-center">
        {isCollapsed ? (
          <NavLink
            to="/add-transaction"
            className="bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] flex items-center justify-center text-white rounded-xl w-10 h-10 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            title="Tambah Transaksi"
          >
            <Plus className="w-5 h-5" />
          </NavLink>
        ) : (
          <NavLink
            to="/add-transaction"
            className="bg-[linear-gradient(135deg,#3975E6,#9E4CC6)] flex items-center justify-center gap-2 text-white rounded-xl py-3 px-4 w-full text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </NavLink>
        )}
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                    isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                    isActive
                      ? "bg-purple-50 text-purple-600"       
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900", 
                  ].join(" ")
                }
                title={isCollapsed ? label : ""}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={isCollapsed ? 22 : 18}
                      strokeWidth={isActive ? 2.2 : 1.75}
                      className="flex-shrink-0"
                    />
                    {!isCollapsed && label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tombol Keluar */}
      <div className="p-4 border-t border-gray-100 flex justify-center">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Keluar" : ""}
          className={`flex items-center rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
            isCollapsed ? "justify-center p-2 w-10 h-10" : "gap-3 px-3 py-2.5 w-full"
          }`}
        >
          <LogOut size={isCollapsed ? 22 : 18} strokeWidth={1.75} className="flex-shrink-0" />
          {!isCollapsed && "Keluar"}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;;