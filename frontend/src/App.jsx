import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BuyCards from './pages/BuyCards';
import BulkCards from './pages/BulkCards';
import BuyLogs from './pages/BuyLogs';
import MyOrders from './pages/MyOrders';
import MyCardOrders from './pages/MyCardOrders';
import MyLogOrders from './pages/MyLogOrders';
import MyBulkPurchases from './pages/MyBulkPurchases';
import BinChecker from './pages/BinChecker';
import CardChecker from './pages/CardChecker';
import ComponentShowcase from './pages/ComponentShowcase';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ChangePassword from './pages/ChangePassword';
import Deposit from './pages/Deposit';
import MyDeposits from './pages/MyDeposits';
import Transactions from './pages/Transactions';
import Tickets from './pages/Tickets';
import TicketDetails from './pages/TicketDetails'; // Import Added
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTickets from './pages/admin/AdminTickets';
import AdminTicketDetails from './pages/admin/AdminTicketDetails';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="deposits" element={<AdminDeposits />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="tickets/:id" element={<AdminTicketDetails />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Home />} />
              <Route path="buy-cards" element={<BuyCards />} />
              <Route path="bulk-cards" element={<BulkCards />} />
              <Route path="buy-logs" element={<BuyLogs />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="my-card-orders" element={<MyCardOrders />} />
              <Route path="my-log-orders" element={<MyLogOrders />} />
              <Route path="my-bulk-purchases" element={<MyBulkPurchases />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="my-deposits" element={<MyDeposits />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="bin-checker" element={<BinChecker />} />
              <Route path="card-checker" element={<CardChecker />} />
              <Route path="components" element={<ComponentShowcase />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
