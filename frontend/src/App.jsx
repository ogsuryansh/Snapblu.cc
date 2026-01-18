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
import Checkers from './pages/Checkers';
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
import PaymentNotice from './pages/PaymentNotice';


import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Payment Notice - All routes redirect here */}
          <Route path="/payment-notice" element={<PaymentNotice />} />

          {/* Redirect all other routes to payment notice */}
          <Route path="*" element={<Navigate to="/payment-notice" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
