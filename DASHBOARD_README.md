# Ecommerce Dashboard Analytics

## Overview
This comprehensive analytics dashboard provides real-time insights into your ecommerce store performance. Built with Next.js, Prisma, and Tailwind CSS, it offers a modern, responsive interface for monitoring key business metrics.

## Features

### 📊 Key Metrics Dashboard
- **Total Revenue**: All-time revenue from paid orders
- **Total Sales**: Number of completed orders
- **Products in Stock**: Active products available
- **Average Order Value**: Average amount per order
- **Total Orders**: All orders (paid & pending)
- **Paid Orders**: Successfully paid orders
- **Inventory Value**: Total value of current stock
- **Conversion Rate**: Orders converted to sales

### 📈 Data Visualizations
- **Revenue Trend Chart**: Monthly revenue over the last 6 months
- **Order Status Distribution**: Visual breakdown of order statuses
- **Top Selling Products**: Best-performing products with sales data
- **Low Stock Alerts**: Products that need restocking
- **Category Performance**: Top categories by revenue

### 🎯 Quick Insights
- Order success rate
- Products needing restocking
- Best selling product identification
- Real-time performance indicators

## Components

### Analytics Components
- `AnalyticsCard`: Reusable metric cards with icons and descriptions
- `RevenueChart`: Monthly revenue visualization
- `OrderStatus`: Order status distribution with progress bars
- `TopProducts`: Top-selling products list
- `LowStockAlert`: Low stock product alerts
- `QuickStats`: Overview of key performance indicators
- `SalesChart`: Sales trend visualization

### Utility Functions
- `formatCurrency`: Indian Rupee currency formatting
- `formatNumber`: Number formatting with Indian locale
- `getStatusColor`: Status-based color coding
- `getStatusIcon`: Status-based icons
- `getMonthName`: Month name formatting
- `getPercentageChange`: Percentage change calculations

## Data Sources

The dashboard pulls data from your Prisma database schema:

### Core Entities
- **Store**: Main store information
- **Product**: Product details, pricing, inventory
- **Order**: Order information and status
- **OrderItem**: Individual items in orders
- **Category**: Product categories
- **Size & Color**: Product attributes

### Analytics Calculations
- Revenue calculations from paid orders
- Sales count from completed orders
- Inventory value from product stock
- Conversion rates from order status
- Top products by sales volume
- Category performance by revenue

## Installation & Setup

1. Ensure your Prisma database is set up and migrated
2. Install dependencies: `npm install`
3. Set up environment variables for database connection
4. Run the development server: `npm run dev`

## Usage

Navigate to your store dashboard at `/dashboard/[storeId]` to view the analytics. The dashboard will automatically:

- Load all relevant data for your store
- Calculate key metrics in real-time
- Display visualizations and charts
- Show alerts for low stock items
- Provide insights for business decisions

## Customization

### Adding New Metrics
1. Create new analytics functions in `/actions/get-analytics.ts`
2. Add new components in `/components/dashboard/`
3. Update the main dashboard page to include new metrics

### Styling
- Uses Tailwind CSS for styling
- Responsive design for all screen sizes
- Custom color schemes for different metrics
- Hover effects and transitions

### Data Filtering
- Filter by date ranges
- Filter by product categories
- Filter by order status
- Real-time data updates

## Performance

- Server-side rendering for fast initial load
- Optimized database queries
- Efficient data aggregation
- Responsive UI components

## Future Enhancements

- Real-time notifications
- Export functionality for reports
- Advanced filtering options
- Custom date range selection
- Email reports
- Mobile app integration 