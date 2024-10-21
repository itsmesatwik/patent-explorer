import { useEffect, useState } from 'react';

export default function DescriptionView({ descriptionXml }) {
    const [parsedContent, setParsedContent] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (descriptionXml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(descriptionXml, 'text/html');
            setParsedContent(doc.body);
        }
    }, [descriptionXml]);

    if (!parsedContent) return <p className="text-gray-500">No description available.</p>;

    const renderContent = (node: ChildNode) => {
        if (!node) return null;

        switch (node.nodeName.toLowerCase()) {
            case '#text':
                return node.textContent?.trim() ? <p>{node.textContent.trim()}</p> : null;
            case 'heading':
                return (
                    <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800">
                        {node.textContent?.trim()}
                    </h3>
                );
            case 'p':
                return <p className="mt-2 text-gray-700">{node.textContent?.trim()}</p>;
            case 'figref':
                return (
                    <p className="italic text-sm text-gray-600">
                        {`Figure: ${node.textContent?.trim()}`}
                    </p>
                );
            case 'description-of-drawings':
                return (
                    <div className="mt-4">
                        <strong className="text-gray-800">Description of Drawings:</strong>
                        {Array.from(node.childNodes).map((child, index) => (
                            <div key={index} className="ml-4">
                                {renderContent(child)}
                            </div>
                        ))}
                    </div>
                );
            default:
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
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
            <div className="prose prose-sm text-gray-700">
                {renderContent(parsedContent)}
            </div>
        </div>
    );
}
