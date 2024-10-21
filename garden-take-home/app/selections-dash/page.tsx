// app/selections-dash/page.tsx

'use client';

import Navbar from '../components/Navbar';
import UserSelectionsTable from '../components/UserSelectionsTable';
import { SessionProvider } from 'next-auth/react';

export default function MySelectionsPage() {
    return (
        <>
            <Navbar />
            <SessionProvider>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">My Selections</h1>
                    <UserSelectionsTable />
                </div>
            </SessionProvider>
        </>
    );
}
