import { useEffect, useState } from 'react';
import xml2js from 'xml2js';

interface Claim {
    id: string;
    num: string;
    text: string;
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
    }));
};

export default function ClaimsTable({ claimsXml }: { claimsXml: string }) {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    // Parse the claims XML
    const claims = parseClaimsXml(claimsXml);

    // Handle row click
    const handleRowClick = (claim: Claim) => {
        setSelectedClaim(claim);
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Claims</h2>
            <table className="w-full mt-2 border-collapse border border-gray-300">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-400">
                    <tr>
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
        </div>
    );
}