import EmptyState from '../components/common/EmptyState';
import { Layers } from 'lucide-react';

const MyBulkPurchases = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Bulk Card Purchases</h1>
                <p className="text-gray-400">View your bulk card purchase history</p>
            </div>

            <div className="card">
                <EmptyState
                    icon={Layers}
                    title="No bulk purchases found"
                    description="You haven't made any bulk card purchases yet."
                />
            </div>
        </div>
    );
};

export default MyBulkPurchases;
