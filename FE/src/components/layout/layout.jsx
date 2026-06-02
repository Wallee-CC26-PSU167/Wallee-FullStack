import React, { useState } from "react";
import Sidebar from "./sidebar.jsx";
import MobileNav from "./mobileNav.jsx";
import { Outlet } from "react-router-dom";

const Layout = ()=>{
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`transition-all duration-300 min-h-screen pb-24 lg:pb-0 bg-slate-50 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
}

export default Layout;