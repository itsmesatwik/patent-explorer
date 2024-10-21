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
                const parsedClaims = parseClaimsXml(data.patent.claims_xml);
                setClaims(parsedClaims);
            }
        };
        fetchSelections();
    }, [session, patentId]);

    const handleSelectionClick = (selection: ClaimSelection) => {
        const selected = claims.filter(claim => selection.claimIds.includes(claim.id));
        setSelectedClaims(selected);
    };

    if (!patent) return <p className="text-center mt-8">Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{patent.title || 'Untitled Patent'}</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Patent Information</h2>
                <div className="grid grid-rows-2 gap-4 text-gray-600">
                    <p><strong>ID:</strong> {patent.id}</p>
                    <p><strong>Country:</strong> {patent.country_code}</p>
                    <p><strong>Publication Date:</strong> {new Date(patent.publication_date).toLocaleDateString()}</p>
                </div>
            </div>

            <h3 className="mt-8 text-2xl font-semibold text-gray-800">Your Selected Claims</h3>
            {selections.length === 0 ? (
                <p className="text-gray-500 mt-4">No selections found.</p>
            ) : (
                <div className="overflow-x-auto shadow-lg mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
                            <tr>
                                <th className="p-3">Selection Date</th>
                                <th className="p-3">Claim IDs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {selections.map((selection) => (
                                <tr
                                    key={selection.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => handleSelectionClick(selection)}
                                >
                                    <td className="p-3">{new Date(selection.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">{selection.claimIds.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedClaims.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Selected Claims Details</h3>
                    <ul className="space-y-4">
                        {selectedClaims.map(claim => (
                            <li key={claim.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                <strong>Claim {claim.num}:</strong>
                                <p className="text-gray-600 mt-2">{claim.text || 'No description available'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <DescriptionView descriptionXml={patent.description_xml} />
        </div>
    );
}
