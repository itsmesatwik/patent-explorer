import { useEffect, useState } from 'react';
import xml2js from 'xml2js';

export default function PatentModal({ patent, onClose }) {
    const [parsedClaims, setParsedClaims] = useState(null);
    const [parsedDescription, setParsedDescription] = useState(null);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toISOString().split('T')[0];
    };

    // Function to parse XML to JSON
    const parseXml = (xmlString) => {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xmlString, { trim: true, explicitArray: false }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Recursive function to render nested XML content
    const renderContent = (content) => {
        if (typeof content === 'string') {
            return <span>{content}</span>;
        } else if (Array.isArray(content)) {
            return content.map((item, index) => (
                <div key={index} className="ml-4 border-l-2 pl-2">
                    {renderContent(item)}
                </div>
            ));
        } else if (typeof content === 'object' && content !== null) {
            return Object.keys(content).map((key, index) => (
                <div key={index} className="ml-4 mb-2">
                    <strong className="block text-zinc-800">{key}:</strong>
                    <div className="ml-2 border-l-2 pl-2">
                        {renderContent(content[key])}
                    </div>
                </div>
            ));
        }
        return null;
    };


    // Parse XML fields if available
    useEffect(() => {
        if (patent.claims_xml) {
            parseXml(patent.claims_xml)
                .then((result) => setParsedClaims(result))
                .catch((error) => console.error('Error parsing claims XML:', error));
        }
        if (patent.description_xml) {
            parseXml(patent.description_xml)
                .then((result) => setParsedDescription(result))
                .catch((error) => console.error('Error parsing description XML:', error));
        }
    }, [patent]);

    return (
        <div className="fixed inset-0 bg-zinc-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                <div className="mt-3">
                    <h3 className="text-2xl font-semibold leading-6 text-zinc-900 text-center">{patent.title || 'Untitled Patent'}</h3>
                    <div className="mt-4 px-8 py-6 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <p className="text-sm font-medium text-zinc-700">ID:</p>
                            <p className="text-sm text-zinc-500">{patent.id || 'N/A'}</p>
                            <p className="text-sm font-medium text-zinc-700">Country:</p>
                            <p className="text-sm text-zinc-500">{patent.country_code || 'N/A'}</p>
                            <p className="text-sm font-medium text-zinc-700">Publication Date:</p>
                            <p className="text-sm text-zinc-500">{formatDate(patent.publication_date)}</p>
                            <p className="text-sm font-medium text-zinc-700">Filing Date:</p>
                            <p className="text-sm text-zinc-500">{formatDate(patent.filing_date)}</p>
                            <p className="text-sm font-medium text-zinc-700">Grant Date:</p>
                            <p className="text-sm text-zinc-500">{formatDate(patent.grant_date)}</p>
                            <p className="text-sm font-medium text-zinc-700">Priority Date:</p>
                            <p className="text-sm text-zinc-500">{formatDate(patent.priority_date)}</p>
                            <p className="text-sm font-medium text-zinc-700">Assignees:</p>
                            <p className="text-sm text-zinc-500">{patent.assignees?.join(', ') || 'N/A'}</p>
                            <p className="text-sm font-medium text-zinc-700">Inventors:</p>
                            <p className="text-sm text-zinc-500">{patent.inventors?.join(', ') || 'N/A'}</p>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-zinc-800">Abstract</h4>
                            <p className="text-sm text-zinc-500 mt-2">{patent.abstract || 'N/A'}</p>
                        </div>
                        {parsedDescription && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-zinc-800">Description</h4>
                                <div className="text-sm text-zinc-500 mt-2">
                                    {renderContent(parsedDescription)}
                                </div>
                            </div>
                        )}
                        {parsedClaims && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-zinc-800">Claims</h4>
                                <div className="text-sm text-zinc-500 mt-2">
                                    {renderContent(parsedClaims)}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            id="ok-btn"
                            className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
