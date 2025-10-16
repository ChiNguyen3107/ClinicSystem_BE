import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuthStore } from '@/store/auth.store';
import { OptimizedSuspense, OptimizedErrorBoundary } from '@/components/performance/OptimizedComponents';

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardPage').then(module => ({ default: module.default })));
const Login = React.lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Patients = React.lazy(() => import('@/pages/patients/PatientsPage').then(module => ({ default: module.PatientsPage })));
const Appointments = React.lazy(() => import('@/pages/appointments/AppointmentsPage').then(module => ({ default: module.default })));
const Doctors = React.lazy(() => import('@/pages/doctors/DoctorsPage').then(module => ({ default: module.DoctorsPage })));
const DoctorWizard = React.lazy(() => import('@/pages/doctors/DoctorWizard').then(module => ({ default: module.DoctorWizard })));
const DoctorDetail = React.lazy(() => import('@/pages/doctors/DoctorDetail').then(module => ({ default: module.DoctorDetail })));
const VisitsPage = React.lazy(() => import('@/pages/visits/VisitsPage').then(module => ({ default: module.VisitsPage })));
const VisitEditor = React.lazy(() => import('@/pages/visits/VisitEditor').then(module => ({ default: module.VisitEditor })));
const ServicesPage = React.lazy(() => import('@/pages/services/ServicesPage').then(module => ({ default: module.ServicesPage })));
const PrescriptionsPage = React.lazy(() => import('@/pages/prescriptions/PrescriptionsPage').then(module => ({ default: module.PrescriptionsPage })));
const PrescriptionEditor = React.lazy(() => import('@/pages/prescriptions/PrescriptionEditor').then(module => ({ default: module.PrescriptionEditor })));
const PrescriptionDetail = React.lazy(() => import('@/pages/prescriptions/PrescriptionDetail').then(module => ({ default: module.PrescriptionDetail })));
const BillingPage = React.lazy(() => import('@/pages/billing/BillingPage').then(module => ({ default: module.BillingPage })));
const BillingEditor = React.lazy(() => import('@/pages/billing/BillingEditor').then(module => ({ default: module.BillingEditor })));
const BillingDetail = React.lazy(() => import('@/pages/billing/BillingDetail').then(module => ({ default: module.BillingDetail })));
const ReportsPage = React.lazy(() => import('@/pages/reports/ReportsPage').then(module => ({ default: module.ReportsPage })));
const AdvancedPage = React.lazy(() => import('@/pages/advanced/AdvancedPage').then(module => ({ default: module.default })));
const SettingsPage = React.lazy(() => import('@/pages/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const PerformanceDashboard = React.lazy(() => import('@/pages/performance/PerformanceDashboard').then(module => ({ default: module.PerformanceDashboard })));

// Public pages
const PublicHome = React.lazy(() => import('@/pages/public/Home').then(module => ({ default: module.Home })));
const PublicBooking = React.lazy(() => import('@/pages/public/Booking').then(module => ({ default: module.Booking })));
const PublicDoctor = React.lazy(() => import('@/pages/public/DoctorPublic').then(module => ({ default: module.DoctorPublic })));
const PublicBookingStatus = React.lazy(() => import('@/pages/public/BookingStatus').then(module => ({ default: module.BookingStatus })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Optimized loading component with better UX
const OptimizedLoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p className="text-sm text-gray-600">Đang tải...</p>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
          <Login />
        </OptimizedSuspense>
      </PublicRoute>
    ),
  },
  // Public routes (no authentication required)
  {
    path: '/public',
    element: (
      <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
        <PublicHome />
      </OptimizedSuspense>
    ),
  },
  {
    path: '/public/booking',
    element: (
      <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
        <PublicBooking />
      </OptimizedSuspense>
    ),
  },
  {
    path: '/public/doctors/:id',
    element: (
      <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
        <PublicDoctor />
      </OptimizedSuspense>
    ),
  },
  {
    path: '/public/booking/:id/status',
    element: (
      <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
        <PublicBookingStatus />
      </OptimizedSuspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <DashboardPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'patients',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <Patients />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'appointments',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <Appointments />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'appointments/calendar',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <Appointments />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'doctors',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <Doctors />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'doctors/new',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <DoctorWizard />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'doctors/:id',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <DoctorDetail />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'doctors/:id/edit',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <DoctorWizard />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'visits',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <VisitsPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'visits/:id',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <VisitEditor />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'visits/:id/edit',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <VisitEditor />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'services',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <ServicesPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'prescriptions',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <PrescriptionsPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'prescriptions/new',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <PrescriptionEditor />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'prescriptions/:id',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <PrescriptionDetail />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'prescriptions/:id/edit',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <PrescriptionEditor />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'billing',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <BillingPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'billing/new',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <BillingEditor />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'billing/:id',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <BillingDetail />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'billing/:id/edit',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <BillingEditor />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <ReportsPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'advanced',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <AdvancedPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <SettingsPage />
          </OptimizedSuspense>
        ),
      },
      {
        path: 'performance',
        element: (
          <OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>
            <PerformanceDashboard />
          </OptimizedSuspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
