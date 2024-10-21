import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Claim {
    id: string;
    num: string;
    text: string;
    parentId?: string;
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

export default function ClaimsTable({ patentId, claimsXml }: { patentId: string; claimsXml: string }) {
    const { data: session } = useSession();
    const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const claims = parseClaimsXml(claimsXml);
    const userEmail = session?.user?.email;

    const handleToggleClaim = (claim: Claim) => {
        const newSelectedClaims = new Set(selectedClaims);
        if (newSelectedClaims.has(claim.id)) {
            newSelectedClaims.delete(claim.id);
        } else {
            newSelectedClaims.add(claim.id);
            let currentClaim = claim;
            while (currentClaim.parentId) {
                const parent = claims.find(c => c.id === currentClaim.parentId);
                if (parent && !newSelectedClaims.has(parent.id)) {
                    newSelectedClaims.add(parent.id);
                }
                currentClaim = parent!;
            }
        }
        setSelectedClaims(newSelectedClaims);
    };

    const isClaimSelected = (claim: Claim) => selectedClaims.has(claim.id);

    const handleRowClick = (claim: Claim) => {
        setSelectedClaim(claim);
    };

    const handleSaveSelection = async () => {
        if (!userEmail) {
            alert('You need to be logged in to save selections.');
            return;
        }

        const selection = Array.from(selectedClaims);

        const response = await fetch(`/api/patents/${patentId}/save-selection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, claimIds: selection }),
        });

        if (response.ok) {
            alert('Selection saved successfully!');
            window.location.href = `/patents/${patentId}/selections`;
        } else {
            alert('Failed to save selection.');
        }
    };

    return (
        <div className="mt-8 p-6 bg-gray-50 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Claims</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-sm font-semibold text-gray-600 uppercase">
                        <tr>
                            <th className="p-3">Select</th>
                            <th className="p-3">Claim Number</th>
                            <th className="p-3">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {claims.map((claim) => (
                            <tr
                                key={claim.id}
                                onClick={() => handleRowClick(claim)}
                                className={`cursor-pointer transition-colors hover:bg-gray-50 ${isClaimSelected(claim) ? 'bg-gray-50' : 'bg-white'}`}
                            >
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={isClaimSelected(claim)}
                                        onChange={() => handleToggleClaim(claim)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="cursor-pointer"
                                    />
                                </td>
                                <td className="p-3 text-gray-700">{claim.num}</td>
                                <td className="p-3 text-gray-600">{claim.text ? claim.text.slice(0, 100) : 'No description available'}...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedClaim && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-700">Claim {selectedClaim.num} Details</h3>
                    <p className="mt-2 text-gray-600">{selectedClaim.text || 'No description available'}</p>
                    <button
                        className="mt-4 text-blue-500 hover:underline"
                        onClick={() => setSelectedClaim(null)}
                    >
                        Close
                    </button>
                </div>
            )}

            <button
                onClick={handleSaveSelection}
                className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 disabled:opacity-50"
                disabled={selectedClaims.size === 0}
            >
                Save Selection
            </button>
        </div>
    );
}
