'use client';

import { useState } from 'react';
import PatentModal from './PatentModal';

export default function PatentTable({ patents }) {
    const [selectedPatent, setSelectedPatent] = useState(null);

    // Function to format date consistently
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-gray-800">Title</th>
                        <th className="px-4 py-2 text-gray-800">ID</th>
                        <th className="px-4 py-2 text-gray-800">Country</th>
                        <th className="px-4 py-2 text-gray-800">Publication Date</th>
                    </tr>
                </thead>
                <tbody>
                    {patents.map((patent) => (
                        <tr
                            key={patent.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedPatent(patent)}
                        >
                            <td className="border px-4 py-2 text-gray-800">{patent.title || 'Untitled'}</td>
                            <td className="border px-4 py-2 text-gray-800">{patent.id}</td>
                            <td className="border px-4 py-2 text-gray-800">{patent.country_code}</td>
                            <td className="border px-4 py-2 text-gray-800">{formatDate(patent.publication_date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedPatent && (
                <PatentModal patent={selectedPatent} onClose={() => setSelectedPatent(null)} />
            )}
        </>
    );
}