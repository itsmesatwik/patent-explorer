'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-green-700 via-green-500 to-green-700 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/dashboard">
                    <span className="text-2xl font-light tracking-wide hover:text-green-100 transition-colors duration-200">
                        Dashboard
                    </span>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link href="/selections-dash">
                        <span className="text-lg font-medium hover:text-green-100 transition-colors duration-200">
                            My Selections
                        </span>
                    </Link>
                    {/* <Link href="/profile">
                        <span className="text-lg font-medium hover:text-green-100 transition-colors duration-200">
                            Profile
                        </span>
                    </Link> */}
                    <button
                        onClick={() => signOut()}
                        className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors duration-200"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}
