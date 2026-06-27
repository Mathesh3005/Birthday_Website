const Message = ({ variant = 'info', children }) => {
    const getVariantClass = () => {
        switch (variant) {
            case 'danger': return 'bg-red-100 text-red-700 border-red-400';
            case 'success': return 'bg-green-100 text-green-700 border-green-400';
            default: return 'bg-blue-100 text-blue-700 border-blue-400';
        }
    };

    return (
        <div className={`border px-4 py-3 rounded relative mb-4 ${getVariantClass()}`} role="alert">
            <span className="block sm:inline">{children}</span>
        </div>
    );
};

export default Message;
