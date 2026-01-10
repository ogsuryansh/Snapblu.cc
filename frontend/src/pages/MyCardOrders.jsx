import EmptyState from '../components/common/EmptyState';
import { CreditCard } from 'lucide-react';

const MyCardOrders = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Card Orders</h1>
                <p className="text-gray-400">View your card purchase history</p>
            </div>

            <div className="card">
                <EmptyState
                    icon={CreditCard}
                    title="No card orders found"
                    description="You haven't made any card purchases yet."
                />
            </div>
        </div>
    );
};

export default MyCardOrders;
