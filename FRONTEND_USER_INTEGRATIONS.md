# HP Evergreen - Frontend User Integration Guide

## Overview
This document provides a comprehensive overview of all user types and their frontend integrations in the HP Evergreen platform. It covers the complete feature set, API integrations, and mobile capabilities for each user role.

---

## User Types & Role-Based Access Control

### 1. SUPER_ADMIN
**Access Level**: System-wide administrative control
**Dashboard**: Full system overview with all metrics

#### Core Features Implemented:
- **Authentication & Security**
  - JWT-based authentication with automatic token refresh
  - Role-based route guards
  - Secure API communication with interceptors

- **Dashboard Analytics**
  - Total Groups overview
  - Plantation Sites monitoring
  - Total Plants Planted tracking
  - Survival Percentage calculations
  - District-wise statistics visualization
  - Live vs Dead plants charts (30/60/90 days)

- **User Management**
  - Create, Read, Update, Delete system users
  - Role assignment and permissions management
  - User activity monitoring
  - Bulk user operations

- **Organization Management**
  - NGO and government body management
  - Organization hierarchy setup
  - Organization performance tracking
  - CSR funding management

- **Group Management**
  - Village-level group creation
  - Group type classification (Mahila Mandal, etc.)
  - Group performance analytics
  - Group member management

- **Event Management**
  - Plantation event creation and scheduling
  - Event location mapping
  - Target assignment to events
  - Event participation tracking

- **Target Assignment System**
  - Land area allocation to groups
  - Target plants assignment
  - Species restrictions configuration
  - Officer assignment management
  - Assignment tracking and reporting

- **Species Management**
  - Plant species catalog
  - Scientific and common names
  - Growth characteristics
  - Survival rate tracking by species

- **Village Management**
  - Geographic location management
  - Demographic data handling
  - Village-level plantation tracking
  - Regional performance analytics

#### API Integrations:
```
GET  /api/v1/dashboard - System statistics
GET  /api/v1/users - User management
POST /api/v1/users - Create user
PUT  /api/v1/users/:id - Update user
DELETE /api/v1/users/:id - Delete user

GET  /api/v1/organizations - Organization data
POST /api/v1/organizations - Create organization
PUT  /api/v1/organizations/:id - Update organization

GET  /api/v1/groups - Group management
POST /api/v1/groups - Create group
PUT  /api/v1/groups/:id - Update group

GET  /api/v1/events - Event management
POST /api/v1/events - Create event
PUT  /api/v1/events/:id - Update event

GET  /api/v1/assignments - Target assignments
POST /api/v1/assignments - Create assignment
PUT  /api/v1/assignments/:id - Update assignment

GET  /api/v1/plants - Species management
POST /api/v1/plants - Add species
PUT  /api/v1/plants/:id - Update species

GET  /api/v1/villages - Village management
POST /api/v1/villages - Create village
PUT  /api/v1/villages/:id - Update village
```

---

### 2. ORG_ADMIN (Organization Administrator)
**Access Level**: Organization-specific administrative control
**Dashboard**: Organization-focused metrics and team management

#### Core Features Implemented:
- **Organization Dashboard**
  - Organization-specific plantation metrics
  - Team performance overview
  - Resource allocation tracking
  - CSR fund utilization

- **Team Management**
  - Organization member management
  - Role assignment within organization
  - Team performance tracking
  - Volunteer coordination

- **Event Coordination**
  - Organization-level event creation
  - Resource allocation for events
  - Team assignment to events
  - Event progress monitoring

- **Resource Management**
  - Equipment and resource tracking
  - Budget management
  - Supply chain coordination
  - Vendor management

- **Reporting & Analytics**
  - Organization performance reports
  - Team productivity metrics
  - Resource utilization reports
  - Compliance tracking

#### API Integrations:
```
GET  /api/v1/organizations/:orgId/dashboard - Organization stats
GET  /api/v1/organizations/:orgId/members - Team members
POST /api/v1/organizations/:orgId/members - Add member
PUT  /api/v1/organizations/:orgId/members/:id - Update member

GET  /api/v1/organizations/:orgId/events - Organization events
POST /api/v1/organizations/:orgId/events - Create event
PUT  /api/v1/organizations/:orgId/events/:id - Update event

GET  /api/v1/organizations/:orgId/resources - Resources
POST /api/v1/organizations/:orgId/resources - Add resource
PUT  /api/v1/organizations/:orgId/resources/:id - Update resource

GET  /api/v1/organizations/:orgId/reports - Performance reports
```

---

### 3. VOLUNTEER
**Access Level**: Field operations and plantation activities
**Dashboard**: Personal task management and field data

#### Core Features Implemented:
- **Personal Dashboard**
  - My assigned tasks
  - Plantation progress tracking
  - Achievement badges
  - Performance metrics

- **Plantation Management**
  - Tree registration with GPS coordinates
  - Photo capture and upload
  - Growth stage tracking
  - Health status updates
  - Survival monitoring

- **Inspection System**
  - Assigned tree inspections
  - Health scoring (1-10 scale)
  - Photo evidence capture
  - Inspection reports
  - Follow-up scheduling

- **GPS & Location Services**
  - Current location capture
  - Tree location mapping
  - Area measurement
  - Route planning for field work

- **Mobile Features**
  - Offline data collection
  - Camera integration
  - Photo compression
  - Background sync

- **Communication**
  - Team messaging
  - Task notifications
  - Emergency alerts
  - Progress updates

#### API Integrations:
```
GET  /api/v1/trees - My trees
POST /api/v1/trees - Register tree
PATCH /api/v1/trees/:id/health - Update health
POST /api/v1/trees/:id/photos - Add photo

GET  /api/v1/inspections/my-pending - My inspections
PATCH /api/v1/inspections/:id/complete - Complete inspection
GET  /api/v1/inspections - Inspection history

GET  /api/v1/tasks/my-tasks - Assigned tasks
POST /api/v1/tasks/:id/complete - Complete task
GET  /api/v1/notifications - My notifications

GPS Integration:
- getCurrentLocation()
- watchLocation()
- calculateDistance()
- formatLocation()
```

---

### 4. CITIZEN
**Access Level**: Public access and personal plantation tracking
**Dashboard**: Personal contributions and public events

#### Core Features Implemented:
- **Personal Dashboard**
  - My planted trees
  - Contribution statistics
  - Environmental impact metrics
  - Achievement tracking

- **Public Events**
  - Browse upcoming plantation drives
  - Event registration
  - Location-based event discovery
  - Event participation tracking

- **Tree Registration**
  - Personal tree planting
  - Photo documentation
  - Growth tracking
  - Sharing capabilities

- **Community Features**
  - Community leaderboards
  - Green challenges
  - Social sharing
  - Environmental education

- **Mobile Features**
  - QR code scanning for tree info
  - Augmented reality tree visualization
  - Social media integration
  - Push notifications for events

#### API Integrations:
```
GET  /api/v1/trees/my-trees - My trees
POST /api/v1/trees - Plant tree
GET  /api/v1/events/public - Public events
POST /api/v1/events/:id/register - Register for event

GET  /api/v1/leaderboard - Community rankings
GET  /api/v1/achievements/my-achievements - My badges
POST /api/v1/share/tree/:id - Share tree

Social Integration:
- Facebook sharing API
- Twitter integration
- Instagram story sharing
```

---

## Mobile & PWA Features

### Progressive Web App Capabilities:
- **Offline Support**: Critical data caching for field operations
- **Background Sync**: Queue actions for when online
- **Push Notifications**: Task reminders and updates
- **App Installation**: Native app-like experience

### GPS & Location Services:
- **High Accuracy GPS**: Precise tree location capture
- **Geofencing**: Location-based task assignments
- **Route Optimization**: Efficient field work planning
- **Area Calculation**: Land measurement tools

### Camera Integration:
- **Photo Capture**: Direct tree and inspection photos
- **Image Compression**: Optimize for upload
- **Photo Metadata**: Location and timestamp data
- **Gallery Integration**: Access existing photos

### Offline Capabilities:
- **Data Caching**: Store critical data locally
- **Offline Forms**: Complete forms without connection
- **Sync Queue**: Upload when connection restored
- **Conflict Resolution**: Handle data conflicts

---

## Technical Architecture

### Frontend Stack:
- **Framework**: Angular 20 with Standalone Components
- **UI Library**: PrimeNG v20 with Aura Theme
- **State Management**: Angular Signals & Services
- **HTTP Client**: Angular HttpClient with Interceptors
- **Charts**: Chart.js for data visualization
- **Maps**: Integration ready for mapping services

### API Integration:
- **Base URL**: `http://localhost:5000/api/v1`
- **Authentication**: JWT Bearer tokens with auto-refresh
- **Error Handling**: Global error interceptors
- **Retry Logic**: Automatic retry for failed requests
- **Caching**: Service worker for offline support

### Security Features:
- **Token Management**: Secure storage and refresh
- **Route Guards**: Role-based access control
- **CSRF Protection**: Built-in Angular security
- **XSS Prevention**: Sanitization and validation
- **Secure Storage**: Encrypted local storage options

---

## Data Models & Interfaces

### Tree Data Structure:
```typescript
interface ITree {
  id: string;
  plantTypeId: string;
  eventId?: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'PLANTED' | 'GROWING' | 'HEALTHY' | 'WEAK' | 'DEAD';
  growthStage: 'SEEDLING' | 'SAPLING' | 'YOUNG' | 'MATURE' | 'FLOWERING' | 'FRUITING';
  healthRemarks?: string;
  photos?: ITreePhoto[];
  plantedBy?: User;
  plantedAt?: Date;
  plantType?: Plant;
}
```

### Inspection Data Structure:
```typescript
interface IInspection {
  id: string;
  treeId: string;
  inspectorId: string;
  scheduledDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  treeStatus?: string;
  healthScore?: number; // 1-10 scale
  remarks?: string;
  photos?: IInspectionPhoto[];
}
```

### User Data Structure:
```typescript
interface User {
  id: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'VOLUNTEER' | 'CITIZEN';
  email?: string;
  district?: string;
  organizationId?: string;
  profilePicture?: string;
  phoneNumber?: string;
}
```

---

## Component Architecture

### Shared Components:
- **Data Tables**: Reusable table with sorting, filtering, pagination
- **Forms**: Dynamic form generation with validation
- **Charts**: Configurable chart components
- **Maps**: Interactive map components
- **Image Upload**: Multi-format image handling
- **Loading States**: Consistent loading indicators

### Feature Modules:
- **Admin Module**: Administrative interfaces
- **Volunteer Module**: Field operation interfaces
- **Citizen Module**: Public-facing interfaces
- **Auth Module**: Authentication and authorization
- **Core Module**: Shared services and utilities

---

## Performance Optimizations

### Lazy Loading:
- **Route-based**: Component-level code splitting
- **Image Loading**: Progressive image loading
- **Data Loading**: Pagination and infinite scroll
- **Feature Loading**: On-demand feature loading

### Caching Strategy:
- **API Caching**: Service worker caching
- **Image Caching**: Local storage for photos
- **Data Caching**: IndexedDB for large datasets
- **Route Caching**: Prefetching common routes

### Mobile Optimizations:
- **Touch Events**: Optimized touch interactions
- **Viewport**: Responsive design patterns
- **Performance**: Reduced bundle size
- **Battery**: Efficient background operations

---

## Testing Strategy

### Unit Testing:
- **Component Tests**: Individual component testing
- **Service Tests**: API service testing
- **Utility Tests**: Helper function testing
- **Coverage**: Minimum 80% code coverage

### Integration Testing:
- **API Integration**: End-to-end API testing
- **User Flows**: Complete user journey testing
- **Cross-browser**: Browser compatibility testing
- **Mobile Testing**: Device-specific testing

### Performance Testing:
- **Load Testing**: High user load testing
- **Network Testing**: Slow network simulation
- **Battery Testing**: Mobile battery impact
- **Memory Testing**: Memory leak detection

---

## Deployment & DevOps

### Environment Configuration:
- **Development**: Local development setup
- **Staging**: Pre-production testing
- **Production**: Live deployment
- **CI/CD**: Automated deployment pipeline

### Monitoring & Analytics:
- **Error Tracking**: Real-time error monitoring
- **Performance**: Application performance monitoring
- **User Analytics**: User behavior tracking
- **API Analytics**: API performance metrics

---

## Future Enhancements

### Planned Features:
- **AI Integration**: Plant disease detection
- **Blockchain**: Tree ownership verification
- **IoT Integration**: Sensor data collection
- **AR/VR**: Immersive tree visualization
- **Voice Commands**: Hands-free operation

### Scalability Plans:
- **Microservices**: Service decomposition
- **Cloud Native**: Cloud deployment optimization
- **Global CDN**: Content delivery optimization
- **Edge Computing**: Local processing capabilities

---

## Conclusion

The HP Evergreen frontend platform provides a comprehensive, role-based system that caters to all user types from system administrators to citizens. With robust mobile capabilities, offline support, and extensive API integrations, the platform is designed to work seamlessly in both urban and rural environments.

The modular architecture ensures maintainability and scalability, while the user-centric design provides an intuitive experience for all user types. The platform is ready for production deployment and future enhancements.

---

*Last Updated: April 2026*
*Version: 1.0*
*Framework: Angular 20*
