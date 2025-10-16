import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  UserCheck, 
  FileText, 
  Pill, 
  CreditCard,
  Settings,
  BarChart3,
  Stethoscope,
  Package,
  Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/ui.store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Bệnh nhân', href: '/patients', icon: Users },
  { name: 'Lịch hẹn', href: '/appointments', icon: Calendar },
  { name: 'Bác sĩ', href: '/doctors', icon: UserCheck },
  { name: 'Khám bệnh', href: '/visits', icon: Stethoscope },
  { name: 'Đơn thuốc', href: '/prescriptions', icon: FileText },
  { name: 'Dịch vụ', href: '/services', icon: Package },
  { name: 'Thuốc', href: '/medications', icon: Pill },
  { name: 'Hóa đơn', href: '/billing', icon: CreditCard },
  { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
  { name: 'Tính năng nâng cao', href: '/advanced', icon: Sparkles },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { sidebar, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebar.isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 lg:translate-x-0",
        sidebar.isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b px-6">
            <h2 className="text-lg font-semibold">Clinic System</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="text-xs text-muted-foreground">
              Clinic System v1.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
