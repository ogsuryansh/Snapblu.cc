const AdminDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Total Users</h3>
                    <p className="text-3xl font-bold text-white">Loading...</p>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
