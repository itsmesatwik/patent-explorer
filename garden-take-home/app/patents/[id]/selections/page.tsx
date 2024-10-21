'use client';

import { SessionProvider } from 'next-auth/react';
import SelectionsTable from '../../../components/SelectionsTable'; // Adjust the import path if necessary
import { useParams } from 'next/navigation';

export default function SelectionsPage() {
    const params = useParams();
    const patentId = params?.id;

    if (!patentId || typeof patentId !== 'string') {
        return <p>Invalid patent ID.</p>;
    }

    return (
        <SessionProvider>
            <SelectionsTable patentId={patentId} />
        </SessionProvider>
    );
}
