# 🚚 166Cargo – Logistics Backend System

**166Cargo** is a powerful and scalable logistics backend system built with NestJS. It provides core features like order management, user authentication, rate calculation, multilingual support, and more.

## 🛠 Technologies Used

- **NestJS** – Node.js framework for building efficient and scalable server-side applications
- **PostgreSQL** – Relational database
- **TypeORM** – ORM for database management
- **JWT & Bcrypt** – Authentication and password security
- **Cloudinary + Multer** – Image uploading and storage
- **Nodemailer + Handlebars (hbs)** – Email sending with templates
- **Swagger** – API documentation
- **i18n** – Internationalization (multilingual support)
- **CLS** – Continuation-local storage for request-based context

## ✨ Key Features

### 🔐 Authentication Module
- User registration and login
- Email verification via OTP
- Forgot password and password reset

### 🚛 Rates & Branch Management
- Rate calculator based on shipment details
- Manage branches/locations

### 🖼️ Image Uploading
- Upload and store images using Cloudinary

### 📰 News & Announcements
- Manage news and promotions via admin panel

### ⚙️ General Settings
- Configure site name, logo, contact information, etc.

### 🗂️ Categories & Stores
- Add stores and assign categories to them

### 🛒 Order Management
- Create and track orders based on status

### 🌐 Multilingual Support
- Backend messages and email templates with i18n support
- Currently supports `az` (Azerbaijani), `en` (English) and `ru` (Russian)