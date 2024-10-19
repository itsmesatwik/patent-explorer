import { useEffect, useState } from 'react';
import xml2js from 'xml2js';

export default function DescriptionView({ descriptionXml }) {
    const [parsedDescription, setParsedDescription] = useState(null);

    useEffect(() => {
        if (descriptionXml) {
            xml2js.parseString(descriptionXml, { explicitArray: false }, (err, result) => {
                if (!err) {
                    setParsedDescription(result);
                }
            });
        }
    }, [descriptionXml]);

    if (!parsedDescription) return <p>No description available.</p>;

    const renderContent = (content) => {
        if (typeof content === 'string') {
            return content;
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

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="mt-2 text-sm text-zinc-500">
                {renderContent(parsedDescription)}
            </div>
        </div>
    );
}
