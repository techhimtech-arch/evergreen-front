# Evergreen Platform - Project Implementation Status

## 🌳 Overview
**Evergreen Platform** is a comprehensive environmental and plantation management system (specifically tailored for initiatives like the Himachal Pradesh Community Plantation). It is designed to track tree plantation drives, monitor plant survival rates, manage corporate funding (CSR), and coordinate various stakeholders including Super Admins, Organization Admins, Volunteers, and Citizens.

---

## ✅ Implemented Features & Modules

### 1. Authentication & Security (Auth Module)
- **Login, Registration, and Forgot Password** flows.
- **Role-Based Access Control (RBAC)**: Support for distinct roles:
  - `SUPER_ADMIN` / `ORG_ADMIN`
  - `VOLUNTEER`
  - `CITIZEN`
- **JWT Authentication**: Token interceptors configured for secure API communication.
- **Route Guards**: Protecting admin and user routes based on authentication status and roles.

### 2. Core Architecture & Shared Components
- **Admin Layout**: Responsive sidebar and top toolbar navigation based on user roles.
- **PrimeNG Integration**: Fully upgraded to PrimeNG v20 with components like DataTables, DatePickers, Selects, Dialogs, Charts, and Toasts.
- **Shared Components**: Reusable UI elements such as Data Tables, Image Uploaders, and Loading Spinners.

### 3. Dashboard Analytics
- **Overview Dashboard**: Metrics for Total Groups, Plantation Sites, Total Plants Planted, and Survival Percentage.
- **Survival Monitoring Charts**: Graphical representation of Live vs. Dead plants (30/60/90 days tracking) using `Chart.js`.
- **District-wise Statistics**: Visual breakdown of plantations across different districts.

### 4. Admin & Management Settings (Admin Module)
Fully functioning CRUD (Create, Read, Update, Delete) interfaces for:
- **Event Management**: Managing plantation events (Name, Date, Location, Organizer, Target Plants, Status).
- **User Management**: Managing system users and access.
- **Role Management**: System role configurations.
- **Organization & Group Management**: Managing NGOs, government bodies, and tracking groups.
- **Species Management**: Cataloging different plant/tree species.
- **Target Assignments**: Allocating plantation targets to different groups/users.
- **Village Management**: Geographic and demographic management for plantation sites.

### 5. Plantation Management Module
- **Plantation Assignment**: Assigning specific plantation tasks to volunteers/groups.
- **Plantation Records**: Logging individual tree plantings.
- **Survival Monitoring**: Dedicated module to track the health and survival of plants over time.
- **Verification**: Verifying user-submitted plantation data.

### 6. CSR (Corporate Social Responsibility) Module
- **CSR Dashboard**: Specific views for corporate sponsors.
- **Funded Projects**: Tracking projects funded by external organizations.

### 7. Citizen & Volunteer Portal
- **My Trees**: Personalized view for citizens/volunteers to track their own planted trees.
- **Public Events**: Access to upcoming community plantation drives.
- **Plantation Entry**: Interface for volunteers to log new field entries with image uploads.

### 8. Maps & Geographic Tracking
- **Map Module**: Integrated map markers to view geographic locations of plantation sites.

---

## 🛠️ Tech Stack Used
- **Frontend Framework**: Angular v20 (Standalone Components architecture)
- **UI Library**: PrimeNG v20 (with PrimeIcons & new theming system)
- **Charting**: Chart.js
- **Styling**: CSS / PrimeFlex

---
*Document automatically generated based on the current state of the codebase.*