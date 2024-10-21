// components/UserSelectionsTable.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserSelection {
    id: string;
    patentTitle: string;
    patentId: string,
    claimIds: string[];
    createdAt: string;
}

export default function UserSelectionsTable() {
    const { data: session } = useSession();
    const [selections, setSelections] = useState<UserSelection[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUserSelections = async () => {
            if (!session) return;
            try {
                const response = await fetch(`/api/my-selections?email=${session.user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setSelections(data);
                }
            } catch (error) {
                console.error('Error fetching selections:', error);
            }
        };

        fetchUserSelections();
    }, [session]);

    if (!session) {
        return <p className="text-center mt-8">Please log in to view your selections.</p>;
    }

    if (selections.length === 0) {
        return <p className="text-center mt-8">No selections found.</p>;
    }

    return (
        <div className="overflow-x-auto shadow-lg mt-4">
            <table className="w-full text-left border-collapse">
                <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
                    <tr>
                        <th className="p-3">Patent Title</th>
                        <th className="p-3">Patent ID</th>
                        <th className="p-3">Selection Date</th>
                        <th className="p-3">Claim IDs</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {selections.map((selection) => (
                        <tr key={selection.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => router.push(`/patents/${selection.patentId}/selections`)}>
                            <td className="p-3">{selection.patentTitle || 'Untitled Patent'}</td>
                            <td className="p-3">{selection.patentId}</td>
                            <td className="p-3">{new Date(selection.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">{selection.claimIds.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
