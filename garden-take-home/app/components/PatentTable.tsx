'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatentTable({ patents, totalPatents, currentPage, itemsPerPage, searchQuery }) {
    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const router = useRouter();

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toISOString().split('T')[0];
    };

    const totalPages = Math.ceil(totalPatents / itemsPerPage);

    const handleSearch = () => {
        router.push(`?page=1&search=${encodeURIComponent(searchTerm)}`);
    };

    const goToPage = (page) => {
        router.push(`?page=${page}&search=${encodeURIComponent(searchTerm)}`);
    };

    useEffect(() => {
        setSearchTerm(searchQuery);
    }, [searchQuery]);

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title..."
                    className="border p-2 rounded w-full"
                />
                <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Search</button>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Country</th>
                            <th scope="col" className="px-6 py-3">Publication Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patents.map((patent) => (
                            <tr key={patent.id}
                                className="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 cursor-pointer"
                                onClick={() => router.push(`/patents/${patent.id}`)}>
                                <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap dark:text-white">{patent.title || 'Untitled'}</td>
                                <td className="px-6 py-4">{patent.id}</td>
                                <td className="px-6 py-4">{patent.country_code}</td>
                                <td className="px-6 py-4">{formatDate(patent.publication_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 bg-zinc-300 text-zinc-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-zinc-300 text-zinc-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </>
    );
}
