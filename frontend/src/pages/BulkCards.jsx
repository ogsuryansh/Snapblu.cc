import { Package } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

const BulkCards = () => {
    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Bulk Cards</h1>
                <p className="text-gray-400">Purchase complete card lots at discounted prices</p>
            </div>

            {/* Empty State */}
            <div className="card">
                <EmptyState
                    icon={Package}
                    title="No bulk cards available"
                    description="There are no bulk card lots available for purchase at the moment."
                />
            </div>
        </div>
    );
};

export default BulkCards;
