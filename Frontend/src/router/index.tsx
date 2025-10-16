import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuthStore } from '@/store/auth.store';

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
        <Suspense fallback={<LoadingSpinner />}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  // Public routes (no authentication required)
  {
    path: '/public',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PublicHome />
      </Suspense>
    ),
  },
  {
    path: '/public/booking',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PublicBooking />
      </Suspense>
    ),
  },
  {
    path: '/public/doctors/:id',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PublicDoctor />
      </Suspense>
    ),
  },
  {
    path: '/public/booking/:id/status',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PublicBookingStatus />
      </Suspense>
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
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'patients',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Patients />
          </Suspense>
        ),
      },
      {
        path: 'appointments',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Appointments />
          </Suspense>
        ),
      },
      {
        path: 'appointments/calendar',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Appointments />
          </Suspense>
        ),
      },
      {
        path: 'doctors',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Doctors />
          </Suspense>
        ),
      },
      {
        path: 'doctors/new',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DoctorWizard />
          </Suspense>
        ),
      },
      {
        path: 'doctors/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DoctorDetail />
          </Suspense>
        ),
      },
      {
        path: 'doctors/:id/edit',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DoctorWizard />
          </Suspense>
        ),
      },
      {
        path: 'visits',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <VisitsPage />
          </Suspense>
        ),
      },
      {
        path: 'visits/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <VisitEditor />
          </Suspense>
        ),
      },
      {
        path: 'visits/:id/edit',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <VisitEditor />
          </Suspense>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ServicesPage />
          </Suspense>
        ),
      },
      {
        path: 'prescriptions',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrescriptionsPage />
          </Suspense>
        ),
      },
      {
        path: 'prescriptions/new',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrescriptionEditor />
          </Suspense>
        ),
      },
      {
        path: 'prescriptions/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrescriptionDetail />
          </Suspense>
        ),
      },
      {
        path: 'prescriptions/:id/edit',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrescriptionEditor />
          </Suspense>
        ),
      },
      {
        path: 'billing',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BillingPage />
          </Suspense>
        ),
      },
      {
        path: 'billing/new',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BillingEditor />
          </Suspense>
        ),
      },
      {
        path: 'billing/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BillingDetail />
          </Suspense>
        ),
      },
      {
        path: 'billing/:id/edit',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BillingEditor />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: 'advanced',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
