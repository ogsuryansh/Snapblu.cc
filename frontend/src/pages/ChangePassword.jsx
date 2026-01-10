import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock password change logic
        console.log('Password Changed:', formData);
        navigate('/');
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Change Password</h1>
                <p className="text-gray-600 dark:text-gray-400">Update your password to keep your account secure.</p>
            </div>

            {/* Form Card */}
            <div className="card p-6 md:p-8 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Enter your current password and choose a new one.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Enter current password"
                            className="input-field w-full"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password (min. 6 characters)"
                            className="input-field w-full"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="input-field w-full"
                            required
                        />
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <Button type="submit">
                            Change Password
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
