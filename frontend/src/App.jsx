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
import ChangePassword from './pages/ChangePassword';
import Deposit from './pages/Deposit';
import MyDeposits from './pages/MyDeposits';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="bin-checker" element={<BinChecker />} />
            <Route path="card-checker" element={<CardChecker />} />
            <Route path="components" element={<ComponentShowcase />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
