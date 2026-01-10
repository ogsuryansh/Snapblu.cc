import EmptyState from '../components/common/EmptyState';
import { FileText } from 'lucide-react';

const MyLogOrders = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Log Orders</h1>
                <p className="text-gray-400">View your log purchase history</p>
            </div>

            <div className="card">
                <EmptyState
                    icon={FileText}
                    title="No log orders found"
                    description="You haven't made any log purchases yet."
                />
            </div>
        </div>
    );
};

export default MyLogOrders;
