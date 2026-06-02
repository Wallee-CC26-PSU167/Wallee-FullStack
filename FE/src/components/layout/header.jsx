import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-white/30 backdrop-blur-lg shadow-sm border border-white/40 rounded-2xl px-6 lg:px-8">
                <div className="flex justify-between items-center h-[72px]">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-1.5 rounded-lg">
                            <Wallet size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                            Wallee
                        </span>
                    </Link>

                    {/* Navigation Links (Center) */}
                    <nav className="hidden md:flex items-center space-x-8 font-medium">
                        <a href="/#home" className="text-gray-500 hover:text-blue-600 transition-colors">
                            Halaman Utama
                        </a>
                        <a href="/#about" className="text-gray-500 hover:text-blue-600 transition-colors">
                            Tentang Kami
                        </a>
                        <a href="/#feature" className="text-gray-500 hover:text-blue-600 transition-colors">
                            Fitur
                        </a>
                        <a href="/#testimoni" className="text-gray-500 hover:text-blue-600 transition-colors">
                            Testimoni
                        </a>
                    </nav>

                    {/* Login and Register Button */}
                    <div className="flex items-center space-x-6">
                        <Link to="/register" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition-colors">
                            <User size={22} strokeWidth={2} />
                            <span className="text-[17px]">Daftar</span>
                        </Link>
                        <Link to="/login" className="group rounded-full p-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all hover:shadow-md hover:shadow-purple-500/20 active:scale-95 flex items-center justify-center">
                            <div className="bg-white group-hover:bg-transparent group-active:bg-transparent transition-all duration-300 rounded-full px-6 py-1 flex items-center justify-center">
                                <span className="text-[17px] font-medium bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-white group-hover:to-white group-active:from-white group-active:to-white bg-clip-text text-transparent transition-all duration-300">
                                    Masuk
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
