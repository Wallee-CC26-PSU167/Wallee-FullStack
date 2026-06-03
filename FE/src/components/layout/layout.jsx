import React, { useState } from "react";
import Sidebar from "./sidebar.jsx";
import MobileNav from "./mobileNav.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
            
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />
            
            <main className={`transition-all duration-300 min-h-screen pb-28 lg:pb-0 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Outlet />
            </main>
            
            {/* Floating Mobile Nav */}
            <MobileNav />
        </div>
    );
}

export default Layout;