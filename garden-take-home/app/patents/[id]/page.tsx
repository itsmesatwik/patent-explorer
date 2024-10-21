'use client';

import { useParams } from 'next/navigation';
import ClaimsTable from '../../components/ClaimsTable';
import DescriptionView from '../../components/DescriptionView';
import Navbar from '@/app/components/Navbar';
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function PatentPage() {
    const [patent, setPatent] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetch(`/api/patents/${id}`)
                .then(response => response.json())
                .then(data => setPatent(data))
                .catch(error => console.error('Error fetching patent:', error));
        }
    }, [id]);

    if (!patent) return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{patent.title || 'Untitled Patent'}</h1>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Patent Information</h2>
                    <div className="grid grid-rows-1 sm:grid-rows-2 gap-4 text-gray-600">
                        <p><strong>ID:</strong> {patent.id}</p>
                        <p><strong>Country:</strong> {patent.country_code}</p>
                        <p><strong>Publication Date:</strong> {new Date(patent.publication_date).toLocaleDateString()}</p>
                    </div>
                </div>

                <SessionProvider>
                    <div className="mb-8">
                        <ClaimsTable patentId={patent.id} claimsXml={patent.claims_xml} />
                    </div>
                </SessionProvider>

                <DescriptionView descriptionXml={patent.description_xml} />
            </div>
        </>
    );
}
