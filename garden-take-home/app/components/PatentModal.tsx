export default function PatentModal({ patent, onClose }) {
    // Function to format date consistently
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{patent.title}</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">ID: {patent.id}</p>
                        <p className="text-sm text-gray-500">Country: {patent.country_code}</p>
                        <p className="text-sm text-gray-500">Publication Date: {formatDate(patent.publication_date)}</p>
                        <p className="text-sm text-gray-500">Abstract: {patent.abstract || 'N/A'}</p>
                        {/* Add more patent details as needed */}
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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