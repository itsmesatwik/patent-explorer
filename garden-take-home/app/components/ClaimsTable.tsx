import { useEffect, useState } from 'react';
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

    // Toggle claim selection
    const handleToggleClaim = (claim: Claim) => {
        const newSelectedClaims = new Set(selectedClaims);
        if (newSelectedClaims.has(claim.id)) {
            newSelectedClaims.delete(claim.id);
        } else {
            newSelectedClaims.add(claim.id);
            // Ensure parent claims are selected
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

    // Save selected claims to history (mock implementation)
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
        } else {
            console.log(response)
            alert('Failed to save selection.');
        }
    };


    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Claims</h2>
            <table className="w-full mt-2 border-collapse border border-gray-300">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-400">
                    <tr>
                        <th className="border border-zinc-300 p-2">Select</th>
                        <th className="border border-zinc-300 p-2">Claim Number</th>
                        <th className="border border-zinc-300 p-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {claims.map((claim) => (
                        <tr
                            key={claim.id}
                            onClick={() => handleRowClick(claim)}
                            className="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 cursor-pointer"
                        >
                            <td className="border border-zinc-300 p-2 dark:text-white">
                                <input
                                    type="checkbox"
                                    checked={isClaimSelected(claim)}
                                    onChange={() => handleToggleClaim(claim)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                            <td className="border border-zinc-300 p-2 dark:text-white">{claim.num}</td>
                            <td className="border border-zinc-300 p-2 dark:text-white">
                                {claim.text ? claim.text.slice(0, 100) : 'No description available'}...
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedClaim && (
                <div className="mt-4 p-4 border border-zinc-300 rounded">
                    <h3 className="text-lg font-semibold">Claim {selectedClaim.num} Details</h3>
                    <p>{selectedClaim.text || 'No description available'}</p>
                    <button
                        className="mt-2 text-blue-500 hover:underline"
                        onClick={() => setSelectedClaim(null)}
                    >
                        Close
                    </button>
                </div>
            )}

            <button
                onClick={handleSaveSelection}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={selectedClaims.size === 0}
            >
                Save Selection
            </button>
        </div>
    );
}
