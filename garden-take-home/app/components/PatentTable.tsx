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
            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title..."
                    className="border border-green-300 p-3 rounded-lg w-full focus:outline-none focus:border-green-500"
                />
                <button
                    onClick={handleSearch}
                    className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    Search
                </button>
            </div>
            <div className="overflow-x-auto shadow-lg sm:rounded-lg">
                <table className="w-full text-sm text-left text-green-900">
                    <thead className="text-xs uppercase bg-green-100 text-green-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Country</th>
                            <th scope="col" className="px-6 py-3">Publication Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patents.map((patent) => (
                            <tr
                                key={patent.id}
                                className="bg-white border-b hover:bg-green-50 cursor-pointer"
                                onClick={() => router.push(`/patents/${patent.id}`)}
                            >
                                <td className="px-6 py-4 font-medium text-green-900 whitespace-nowrap">{patent.title || 'Untitled'}</td>
                                <td className="px-6 py-4">{patent.id}</td>
                                <td className="px-6 py-4">{patent.country_code}</td>
                                <td className="px-6 py-4">{formatDate(patent.publication_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-5 py-2 bg-green-200 text-green-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-300 transition-colors duration-200"
                >
                    Previous
                </button>
                <span className="text-green-800">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-5 py-2 bg-green-200 text-green-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-300 transition-colors duration-200"
                >
                    Next
                </button>
            </div>
        </>
    );
}
