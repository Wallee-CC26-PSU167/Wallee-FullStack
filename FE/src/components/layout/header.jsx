import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
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
                        <a href="/#home" className="text-gray-900 hover:text-blue-600 transition-colors">
                            Halaman Utama
                        </a>
                        <a href="/#about" className="text-gray-900 hover:text-blue-600 transition-colors">
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
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                Masuk
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-5 py-2 rounded-md transition-all shadow-sm hover:shadow-md">
                                Daftar
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
