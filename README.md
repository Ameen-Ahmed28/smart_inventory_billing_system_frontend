# Smart Inventory & Billing System

A full-stack application for managing inventory, products, and billing for shops, featuring Role-Based Access Control (Admin & Shop Keeper).

## Tech Stack

**Backend:**

- Spring Boot (Java 17+)
- Spring Security + JWT (Authentication)
- Spring Data JPA (Hibernate)
- MySQL (Database)

**Frontend:**

- React (Vite)
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Axios (API Communication)

## Setup Instructions

### Prerequisites

- Java 17 or higher
- Node.js (v16+) and npm
- MySQL Server

### Database Setup

1. Create a MySQL database named `smart_inventory`.
2. The tables will be automatically created by Hibernate when the backend starts.

### Backend Setup

1. Navigate to the `backend` directory.
2. Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   Or use your IDE to run `SmartInventoryApplication.java`.

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Create a `.env` file in the `frontend` directory with the following content:
   ```env
   VITE_API_URL=http://localhost:8080/api
   # Or your deployed backend URL
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

## Features

### Authentication

- **Admin**: Sign in using the "Sign in as Admin" checkbox. (Note: Create an Admin manually in DB or via a bootstrap script if needed. For testing, insert into `admin` table).
- **Shop Keeper**: Sign up and login normally. Default role is `SHOP`.

### Admin Features

- Dashboard: Overview of actions.
- Product Management: Add, Edit, Delete products.
- Inventory: Update stock levels.
- Sales Report: View all bills generated.

### Shop Keeper Features

- Dashboard: Quick links.
- Billing: Add products to cart and generate a bill.
- Stock checks: Alerts if stock is insufficient.

## API Endpoints (Backend)

- `POST /api/auth/signin`: Login
- `POST /api/auth/signup`: Register Shop Keeper
- `GET /api/admin/products`: List all products
- `POST /api/admin/products`: Create product (Admin only)
- `POST /api/shop/bill`: Create a new bill (Shop/Admin)

## Notes

- Ensure Backend is running on port 8080.
- Ensure Frontend is running on port 5173 (default Vite port).
- CORS is configured to allow `*` for development ease.

