import { Search } from 'lucide-react';
import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';

const BinChecker = () => {
    const [binNumber, setBinNumber] = useState('');
    const [result, setResult] = useState(null);

    const handleCheck = () => {
        // Mock result
        setResult({
            bin: binNumber,
            brand: 'VISA',
            type: 'CREDIT',
            level: 'CLASSIC',
            bank: 'CHASE BANK USA, N.A.',
            country: 'UNITED STATES',
        });
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">BIN Checker</h1>
                <p className="text-gray-400">Check BIN information for credit cards</p>
            </div>

            <div className="card p-6 max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Enter BIN Number
                        </label>
                        <SearchBar
                            placeholder="Enter 6-8 digit BIN number..."
                            value={binNumber}
                            onChange={setBinNumber}
                        />
                    </div>

                    <Button variant="primary" icon={Search} onClick={handleCheck}>
                        Check BIN
                    </Button>

                    {result && (
                        <div className="mt-6 p-4 bg-dark-hover rounded-lg border border-dark-border">
                            <h3 className="font-semibold text-white mb-3">BIN Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">BIN:</span>
                                    <span className="text-white font-mono">{result.bin}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Brand:</span>
                                    <span className="text-white">{result.brand}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type:</span>
                                    <span className="text-white">{result.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Level:</span>
                                    <span className="text-white">{result.level}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Bank:</span>
                                    <span className="text-white">{result.bank}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Country:</span>
                                    <span className="text-white">{result.country}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BinChecker;
