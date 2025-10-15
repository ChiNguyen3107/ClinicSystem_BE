# Clinic System Frontend

Frontend cho hệ thống quản lý phòng khám được xây dựng với React 18, TypeScript, Vite, và TailwindCSS.

## 🚀 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **React Router v6** - Routing
- **Zustand** - State Management
- **Axios** - HTTP Client
- **Zod** - Schema Validation
- **React Hook Form** - Form Management
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── api/                 # API services
│   ├── axios.ts         # Axios configuration
│   ├── auth.service.ts  # Authentication API
│   ├── patient.service.ts
│   ├── appointment.service.ts
│   └── doctor.service.ts
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── hooks/              # Custom hooks
├── layouts/            # Page layouts
├── pages/              # Page components
├── router/             # Routing configuration
├── store/              # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm hoặc yarn

### Installation

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Tạo file `.env.local` trong thư mục Frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Clinic System
```

## 🎨 UI Components

Dự án sử dụng shadcn/ui components với TailwindCSS:

- **Button** - Các loại button khác nhau
- **Input** - Form inputs
- **Card** - Container components
- **Badge** - Status indicators
- **Loading** - Loading states
- **Empty State** - Empty data states

## 🔐 Authentication

Hệ thống sử dụng JWT tokens với refresh token:

- **Login/Logout** - Xác thực người dùng
- **Protected Routes** - Bảo vệ các trang cần đăng nhập
- **Token Refresh** - Tự động làm mới token
- **Role-based Access** - Phân quyền theo vai trò

## 📊 State Management

Sử dụng Zustand cho state management:

- **auth.store** - Quản lý authentication
- **ui.store** - Quản lý UI state (theme, sidebar)

## 🚦 API Integration

- **Axios Instance** - Cấu hình HTTP client
- **Request/Response Interceptors** - Xử lý tokens
- **Error Handling** - Xử lý lỗi API
- **Type Safety** - Types cho API responses

## 🎯 Features

### Đã hoàn thành
- ✅ Project setup với Vite + TypeScript
- ✅ TailwindCSS configuration
- ✅ React Router với protected routes
- ✅ Zustand stores (auth, ui)
- ✅ API services với Axios
- ✅ TypeScript types từ backend
- ✅ Base UI components
- ✅ Layout components (Header, Sidebar)
- ✅ Pages: Dashboard, Login, Patients, Appointments, Doctors
- ✅ Authentication flow
- ✅ Responsive design

### TODO tiếp theo
- [ ] Form validation với react-hook-form + Zod
- [ ] Data tables với pagination
- [ ] Modal/Dialog components
- [ ] Toast notifications
- [ ] File upload components
- [ ] Charts và reports
- [ ] Real-time updates
- [ ] PWA support
- [ ] Unit tests
- [ ] E2E tests

## 🔧 Development Guidelines

### Code Style
- Sử dụng TypeScript strict mode
- ESLint + Prettier cho code formatting
- Component naming: PascalCase
- File naming: kebab-case
- Hook naming: use* prefix

### Component Structure
```tsx
// Component với props interface
interface ComponentProps {
  title: string;
  optional?: boolean;
}

export const Component: React.FC<ComponentProps> = ({ title, optional }) => {
  // Component logic
  return <div>{title}</div>;
};
```

### API Service Pattern
```tsx
// Service với error handling
export const service = {
  getData: async (): Promise<DataType> => {
    try {
      const response = await api.get('/endpoint');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  },
};
```

## 🚀 Deployment

### Build cho Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
```bash
# Build sẽ được tạo trong thư mục dist/
# Upload thư mục dist/ lên hosting service
```

## 📝 Notes

- Backend API chạy trên port 8080
- Frontend dev server chạy trên port 3000
- Proxy configuration trong vite.config.ts
- Hot reload enabled trong development
- TypeScript strict mode enabled
- TailwindCSS với custom design system