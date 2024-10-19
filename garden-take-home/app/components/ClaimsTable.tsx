import { useEffect, useState } from 'react';
import xml2js from 'xml2js';

export default function ClaimsTable({ claimsXml }) {
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        if (claimsXml) {
            xml2js.parseString(claimsXml, { explicitArray: false }, (err, result) => {
                if (!err) {
                    // Assuming claims are parsed into a structured array
                    const parsedClaims = result.claims.claim || [];
                    setClaims(Array.isArray(parsedClaims) ? parsedClaims : [parsedClaims]);
                }
            });
        }
    }, [claimsXml]);

    if (!claims.length) return <p>No claims available.</p>;

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Claims</h2>
            <table className="w-full mt-2">
                <thead>
                    <tr>
                        <th>Claim Number</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {claims.map((claim, index) => (
                        <tr key={index}>
                            <td>{claim.number}</td>
                            <td>{claim.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
