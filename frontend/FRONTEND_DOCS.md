# CCWeb Frontend - Complete Documentation

## 🎉 **Setup Complete!**

Your frontend is now running at: **http://localhost:5173**

---

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx        # Collapsible navigation sidebar
│   │   │   ├── Header.jsx         # Top header with balance & theme toggle
│   │   │   └── Layout.jsx         # Main layout wrapper
│   │   └── common/
│   │       ├── SearchBar.jsx      # Reusable search input
│   │       ├── Button.jsx         # Button component (variants)
│   │       ├── EmptyState.jsx     # Empty state display
│   │       ├── ProductCard.jsx    # Product card for grid layouts
│   │       └── DataTable.jsx      # Advanced sortable table
│   │
│   ├── pages/
│   │   ├── Home.jsx              # Dashboard with tabs & stats
│   │   ├── BuyCards.jsx          # Card purchase page (table)
│   │   ├── BulkCards.jsx         # Bulk cards (empty state)
│   │   ├── BuyLogs.jsx           # Logs page (product grid)
│   │   ├── MyOrders.jsx          # Orders page (table + pagination)
│   │   ├── MyCardOrders.jsx      # Card orders history
│   │   ├── MyLogOrders.jsx       # Log orders history
│   │   ├── MyBulkPurchases.jsx   # Bulk purchase history
│   │   ├── BinChecker.jsx        # BIN lookup tool
│   │   └── CardChecker.jsx       # Card validation tool
│   │
│   ├── assets/
│   │   └── images/               # Image assets directory
│   │
│   ├── hooks/                    # Custom React hooks (future)
│   ├── utils/                    # Utility functions (future)
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind styles
│
├── public/                       # Static assets
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies

```

---

## 🎨 **Design System**

### **Color Palette (Dark Theme)**
- **Background**: `#0a0a0a` (dark-bg)
- **Card Background**: `#141414` (dark-card)
- **Hover State**: `#1a1a1a` (dark-hover)
- **Border**: `#262626` (dark-border)
- **Text Primary**: Gray-100
- **Text Secondary**: Gray-400

### **Component Variants**

#### **Buttons**
- `primary` - White background, black text
- `secondary` - Dark card background with border
- `outline` - Transparent with border
- `ghost` - Transparent, hover effect

#### **Sizes**
- `sm` - Small padding
- `md` - Medium (default)
- `lg` - Large padding

---

## 🧩 **Key Components**

### **1. Layout Components**

#### **Sidebar** (`components/layout/Sidebar.jsx`)
- Collapsible navigation sections
- Active route highlighting
- User info display
- Fully responsive (mobile slide-out)

#### **Header** (`components/layout/Header.jsx`)
- Balance display with add funds button
- Theme toggle (light/dark)
- User avatar
- Mobile menu toggle

#### **Layout** (`components/layout/Layout.jsx`)
- Responsive wrapper
- Mobile sidebar overlay
- Footer with status links
- Outlet for page content

### **2. Common Components**

#### **SearchBar** (`components/common/SearchBar.jsx`)
```jsx
<SearchBar 
  placeholder="Search..." 
  value={searchQuery}
  onChange={setSearchQuery}
/>
```

#### **Button** (`components/common/Button.jsx`)
```jsx
<Button variant="primary" icon={ShoppingCart} onClick={handleClick}>
  Buy Now
</Button>
```

#### **DataTable** (`components/common/DataTable.jsx`)
- Sortable columns
- Row selection
- Checkbox support
- Custom cell rendering

```jsx
<DataTable
  columns={columns}
  data={data}
  selectable
  onSelectionChange={setSelected}
/>
```

#### **ProductCard** (`components/common/ProductCard.jsx`)
- Product image
- Price display
- Stock indicator
- Purchase button

#### **EmptyState** (`components/common/EmptyState.jsx`)
```jsx
<EmptyState
  icon={Package}
  title="No items found"
  description="Description here"
  action={<Button>Action</Button>}
/>
```

---

## 📄 **Pages Overview**

### **1. Dashboard (Home.jsx)**
- **Tabs**: Overview, Purchases, Deposits
- **Stats Cards**: 
  - Current Balance
  - Total Orders
  - Total Spent
  - Cards Purchased
  - Total Deposits
  - Deposit Amount
  - Order Status (Completed, Refunded, Partial)
- **Colored Borders**: Blue, Purple, Green, Orange, Cyan, Teal

### **2. Buy Cards (BuyCards.jsx)**
- **Search**: Cards, BIN, brand, base name
- **Filters**: Base selector, column visibility
- **Table**: Sortable columns with selection
- **Actions**: Buy selected cards

### **3. Bulk Cards (BulkCards.jsx)**
- Empty state when no bulk lots available

### **4. Buy Logs (BuyLogs.jsx)**
- **Product Grid**: 3 columns on desktop
- **Search & Filter**: Category dropdown
- **Product Cards**: Image, price, stock, purchase button

### **5. My Orders (MyOrders.jsx)**
- **Data Table**: Order history
- **Pagination**: Page navigation, rows per page
- **Column Visibility**: Toggle columns
- **Search**: Order search

### **6. Other Pages**
- My Card Orders (empty state)
- My Log Orders (empty state)
- My Bulk Purchases (empty state)
- BIN Checker (tool interface)
- Card Checker (under development)

---

## 🎯 **Responsive Breakpoints**

- **Mobile**: `< 768px` - Single column, mobile sidebar
- **Tablet**: `768px - 1024px` - 2 columns
- **Desktop**: `> 1024px` - 3-4 columns, sidebar visible

---

## 🚀 **How to Run**

```bash
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🔧 **Build for Production**

```bash
npm run build
npm run preview
```

---

## 📦 **Dependencies**

### **Core**
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing

### **UI & Icons**
- `lucide-react` - Icon library
- `tailwindcss` - Utility-first CSS

### **Dev Tools**
- `vite` - Build tool
- `eslint` - Code linting
- `postcss` - CSS processing

---

## ✨ **Features Implemented**

✅ **Fully Responsive Design**  
✅ **Dark Theme**  
✅ **Modular Component Structure**  
✅ **Client-Side Routing**  
✅ **Sortable Tables**  
✅ **Product Grid Layout**  
✅ **Empty States**  
✅ **Search & Filters**  
✅ **Column Visibility Toggle**  
✅ **Pagination**  
✅ **Mobile Navigation**  
✅ **Tabbed Dashboard**  
✅ **Stat Cards with Colored Borders**  

---

## 🎨 **Customization Guide**

### **Change Theme Colors**

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0a0a0a',      // Main background
        card: '#141414',    // Card background
        hover: '#1a1a1a',   // Hover state
        border: '#262626',  // Borders
      }
    }
  }
}
```

### **Add New Pages**

1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="new-page" element={<NewPage />} />
```
3. Add link in `Sidebar.jsx`

### **Add New Components**

Create in `src/components/common/` for reusable components or `src/components/layout/` for layout components.

---

## 🔗 **API Integration (Future)**

To connect to the backend API:

1. Create `src/utils/api.js`:
```js
const API_URL = 'http://localhost:5000/api';

export const fetchCards = async () => {
  const response = await fetch(`${API_URL}/cards`);
  return response.json();
};
```

2. Use in components:
```jsx
import { fetchCards } from '../utils/api';

useEffect(() => {
  fetchCards().then(setCards);
}, []);
```

---

## 📝 **Next Steps**

1. **Connect to Backend API**
   - Implement API service layer
   - Add authentication
   - Connect real data

2. **Add Features**
   - User authentication/login
   - Payment integration
   - Real-time updates
   - Notifications

3. **Enhance UI**
   - Add loading states
   - Toast notifications
   - Modals/dialogs
   - Form validation

4. **Optimize**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Performance monitoring

---

## 🐛 **Troubleshooting**

### **Tailwind not working**
```bash
npm install -D tailwindcss postcss autoprefixer
```

### **Icons not showing**
```bash
npm install lucide-react
```

### **Routing issues**
Ensure `BrowserRouter` wraps the app in `App.jsx`

---

## 📚 **Resources**

- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Built with ❤️ using React + Vite + Tailwind CSS**
