import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuthStore } from '@/store/auth.store';

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Login = React.lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Patients = React.lazy(() => import('@/pages/patients/PatientsPage').then(module => ({ default: module.PatientsPage })));
const Appointments = React.lazy(() => import('@/pages/appointments/AppointmentsPage').then(module => ({ default: module.default })));
const Doctors = React.lazy(() => import('@/pages/doctors/DoctorsPage').then(module => ({ default: module.DoctorsPage })));
const DoctorWizard = React.lazy(() => import('@/pages/doctors/DoctorWizard').then(module => ({ default: module.DoctorWizard })));
const DoctorDetail = React.lazy(() => import('@/pages/doctors/DoctorDetail').then(module => ({ default: module.DoctorDetail })));
const VisitsPage = React.lazy(() => import('@/pages/visits/VisitsPage').then(module => ({ default: module.VisitsPage })));
const VisitEditor = React.lazy(() => import('@/pages/visits/VisitEditor').then(module => ({ default: module.VisitEditor })));

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
            <Dashboard />
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
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
