import { useEffect, useState } from 'react';

export default function DescriptionView({ descriptionXml }) {
    const [parsedContent, setParsedContent] = useState(null);

    useEffect(() => {
        if (descriptionXml) {
            // Parse the HTML-like content using DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(descriptionXml, 'text/html');
            setParsedContent(doc.body); // Use the body of the parsed document
        }
    }, [descriptionXml]);

    if (!parsedContent) return <p>No description available.</p>;

    // Function to render the parsed HTML-like content in a readable format
    const renderContent = (node) => {
        if (!node) return null;

        switch (node.nodeName.toLowerCase()) {
            case '#text': // Text nodes
                return <p>{node.textContent.trim()}</p>;
            case 'heading':
                return (
                    <h3 className="font-bold text-lg mt-4 mb-2">
                        {node.textContent.trim()}
                    </h3>
                );
            case 'p':
                return <p className="mt-2">{node.textContent.trim()}</p>;
            case 'figref':
                return <p className="italic text-sm">{`Figure: ${node.textContent.trim()}`}</p>;
            case 'description-of-drawings':
                return (
                    <div className="mt-4">
                        <strong>Description of Drawings:</strong>
                        {Array.from(node.childNodes).map((child, index) => (
                            <div key={index} className="ml-4">
                                {renderContent(child)}
                            </div>
                        ))}
                    </div>
                );
            default: // Handle other nodes recursively
                return (
                    <div>
                        {Array.from(node.childNodes).map((child, index) => (
                            <div key={index}>{renderContent(child)}</div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="mt-2 text-sm text-zinc-500">
                {renderContent(parsedContent)}
            </div>
        </div>
    );
}
