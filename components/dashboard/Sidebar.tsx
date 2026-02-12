'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  BarChart3,
  FileText,
  Download,
  MessageSquare,
  Users,
  Newspaper,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Results', href: '/dashboard/results', icon: BarChart3 },
  { label: 'Assignments', href: '/dashboard/assignments', icon: FileText },
  { label: 'E-Books', href: '/dashboard/ebooks', icon: Download },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Directory', href: '/dashboard/directory', icon: Users },
  { label: 'News', href: '/dashboard/news', icon: Newspaper },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">EduPortal</h1>
        <p className="text-xs text-slate-500">Student Management System</p>
      </div>

      <nav className="space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
