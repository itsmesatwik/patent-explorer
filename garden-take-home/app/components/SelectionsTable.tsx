import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DescriptionView from './DescriptionView';

interface Claim {
    id: string;
    num: string;
    text: string;
    parentId?: string;
}

interface ClaimSelection {
    id: string;
    claimIds: string[];
    createdAt: string;
}

interface Patent {
    id: string;
    title: string;
    abstract: string;
    claimsXml: string;
}

// Function to parse claims XML (copied from ClaimsTable.tsx)
const parseClaimsXml = (xml: string): Claim[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const claims = Array.from(xmlDoc.getElementsByTagName('claim'));

    return claims.map((claim) => ({
        id: claim.getAttribute('id') || '',
        num: claim.getAttribute('num') || '',
        text: Array.from(claim.getElementsByTagName('claim-text'))
            .map((el) => el.textContent)
            .join('\n') || '',
        parentId: claim.getElementsByTagName('claim-ref').length > 0
            ? claim.getElementsByTagName('claim-ref')[0].getAttribute('idref') || undefined
            : undefined
    }));
};

export default function SelectionsTable({ patentId }: { patentId: string }) {
    const { data: session } = useSession();
    const [patent, setPatent] = useState<Patent | null>(null);
    const [selections, setSelections] = useState<ClaimSelection[]>([]);
    const [selectedClaims, setSelectedClaims] = useState<Claim[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);

    useEffect(() => {
        const fetchSelections = async () => {
            if (!session || !patentId) return;
            const response = await fetch(`/api/patents/${patentId}/selections?email=${session.user.email}`);
            if (response.ok) {
                const data = await response.json();
                setPatent(data.patent);
                setSelections(data.selections);
                // Parse the claims XML to get the list of claims
                const parsedClaims = parseClaimsXml(data.patent.claims_xml);
                setClaims(parsedClaims);
            }
        };
        fetchSelections();
    }, [session, patentId]);

    const handleSelectionClick = (selection: ClaimSelection) => {
        // Filter the parsed claims to show only the ones in the current selection
        const selected = claims.filter(claim => selection.claimIds.includes(claim.id));
        setSelectedClaims(selected);
    };

    if (!patent) return <p>Loading...</p>;

    return (
        <div className="mt-6 p-8">
            <h1 className="text-2xl font-bold mb-4">{patent.title || 'Untitled Patent'}</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Patent Information</h2>
                <p><strong>ID:</strong> {patent.id}</p>
                <p><strong>Country:</strong> {patent.country_code}</p>
                <p><strong>Publication Date:</strong> {new Date(patent.publication_date).toLocaleDateString()}</p>
            </div>

            <h3 className="mt-4 text-lg font-semibold">{session?.user?.email}'s Selected Claims for {patentId}</h3>
            {selections.length === 0 ? (
                <p>No selections found.</p>
            ) : (
                <table className="w-full mt-2 border-collapse border border-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="border border-gray-300 p-2">Selection Date</th>
                            <th className="border border-gray-300 p-2">Claim IDs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selections.map((selection) => (
                            <tr
                                key={selection.id}
                                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectionClick(selection)}
                            >
                                <td className="border border-gray-300 p-2">
                                    {new Date(selection.createdAt).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {Array.isArray(selection.claimIds) ? selection.claimIds.join(', ') : 'No claims selected'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedClaims.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Selected Claims Details</h3>
                    <ul>
                        {selectedClaims.map(claim => (
                            <li key={claim.id} className="border-b border-gray-300 py-2">
                                <strong>Claim {claim.num}:</strong>
                                <p>{claim.text || 'No description available'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <DescriptionView descriptionXml={patent.description_xml} />
        </div>
    );
}
