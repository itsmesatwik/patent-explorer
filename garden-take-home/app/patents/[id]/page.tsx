'use client'; // Add this at the top to make the component a Client Component

import { useParams } from 'next/navigation';
import ClaimsTable from '../../components/ClaimsTable'; // Adjust the import path if needed
import DescriptionView from '../../components/DescriptionView'; // Adjust the import path if needed
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function PatentPage() {
    const [patent, setPatent] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            // Fetch patent data based on the ID
            fetch(`/api/patents/${id}`)
                .then(response => response.json())
                .then(data => setPatent(data))
                .catch(error => console.error('Error fetching patent:', error));
        }
    }, [id]);

    if (!patent) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">{patent.title || 'Untitled Patent'}</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Patent Information</h2>
                <p><strong>ID:</strong> {patent.id}</p>
                <p><strong>Country:</strong> {patent.country_code}</p>
                <p><strong>Publication Date:</strong> {new Date(patent.publication_date).toLocaleDateString()}</p>
            </div>
            <SessionProvider>
                <ClaimsTable patentId={patent.id} claimsXml={patent.claims_xml} />
            </SessionProvider>
            <DescriptionView descriptionXml={patent.description_xml} />
        </div>
    );
}
