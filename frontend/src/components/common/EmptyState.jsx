const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {Icon && (
                <div className="mb-4 text-gray-600">
                    <Icon size={64} strokeWidth={1.5} />
                </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-400 text-center max-w-md">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};

export default EmptyState;
