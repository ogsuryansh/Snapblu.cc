import EmptyState from '../components/common/EmptyState';
import { CheckCircle } from 'lucide-react';

const CardChecker = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Card Checker</h1>
                <p className="text-gray-400">Validate credit card information</p>
            </div>

            <div className="card">
                <EmptyState
                    icon={CheckCircle}
                    title="Card Checker Tool"
                    description="This feature is currently under development."
                />
            </div>
        </div>
    );
};

export default CardChecker;
