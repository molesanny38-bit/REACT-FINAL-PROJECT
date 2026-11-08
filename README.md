# Find It — Campus Lost & Found Management System

**Find It** is a campus lost-and-found coordination platform tailored for university students and campus intake staff. It enables students to report missing property, browse articles secured across campus desks, and coordinate ownership claims with anti-theft blind verification.

---

## 🗄️ Database: Why MySQL is the Best Choice

For a campus lost-and-found system, **MySQL (Relational SQL)** is ideal because:
1. **Relational Integrity:** A claim strictly belongs to a single registered student and a specific found item. Foreign keys prevent invalid or duplicate claims.
2. **Campus Identity:** Unique constraints guarantee that no two students can share a Student ID (`STU-XXXX`) or institutional email (`@campus.edu`).
3. **Auditability:** Exact timestamps and custody handover records are guaranteed by ACID compliance.

### MySQL Database Schema:
```sql
CREATE DATABASE IF NOT EXISTS find_it_campus_db;
USE find_it_campus_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  major VARCHAR(100) DEFAULT 'General Studies',
  role VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
*(The server automatically runs this migration when it connects to your MySQL instance!)*

---

## 🚀 How to Run the Project

### 1. Run the Frontend (Vite + React)
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. (Optional) Run the Backend & Database (Node.js + Express + MySQL)
1. Copy `.env.example` to `.env` in the `server/` directory:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Set your MySQL password and database name in `server/.env`.
3. Install and start:
   ```bash
   npm install
   npm run dev
   ```
*(Note: If MySQL is not running on your machine, the app includes an automatic demo fallback so you can test student login and registration immediately!)*

---

## 🔑 Features in Step 1 (Student Login & Registration)
- **Student Sign In Tab:** Log in with institutional email or Student ID + password.
- **New Student Registration Tab:** Capture legal name, Student ID, campus email, academic department/major, and password.
- **Campus Honor Code Agreement:** Anti-theft warning acknowledging that false claims violate university policy.
- **Password Visibility Toggle & Validation.**
- **One-Click Auto-Fill Demo:** Test the portal instantly with sample student credentials.
- **JWT & Password Security:** Passwords hashed with `bcryptjs` and authenticated via `jsonwebtoken`.
