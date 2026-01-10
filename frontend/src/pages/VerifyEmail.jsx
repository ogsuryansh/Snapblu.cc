import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import API_URL from '../config/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const verifyCalled = useRef(false);

    useEffect(() => {
        const verifyAccount = async () => {
            if (verifyCalled.current) return;
            verifyCalled.current = true;

            try {
                const { data } = await axios.get(`${API_URL}/api/users/verify/${token}`);
                setStatus('success');
                setMessage(data.message);
            } catch (error) {
                // If the error says "Invalid token", it might be because it was JUST verified processing quickly.
                // But generally, the fix above prevents the double call.
                setStatus('error');
                setMessage(
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message
                );
            }
        };

        if (token) {
            verifyAccount();
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            {/* Header / Logo */}
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold">Snapblu.cc</span>
            </div>

            <div className="max-w-md w-full bg-[#111] border border-[#333] rounded-2xl p-8 text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={48} className="text-blue-500 animate-spin" />
                        <h2 className="text-xl font-bold">Verifying your email...</h2>
                        <p className="text-gray-400">Please wait while we activate your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-green-500">Email Verified!</h2>
                        <p className="text-gray-400">{message}</p>
                        <Link
                            to="/login"
                            className="mt-4 w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors block"
                        >
                            Continue to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                            <XCircle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-red-500">Verification Failed</h2>
                        <p className="text-gray-400">{message}</p>
                        <Link
                            to="/register"
                            className="mt-4 w-full bg-[#222] text-white font-medium py-3 rounded-lg hover:bg-[#333] transition-colors block"
                        >
                            Back to Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
