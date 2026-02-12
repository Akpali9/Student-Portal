'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, AlertCircle, CreditCard, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    coursesRegistered: 0,
    paymentsOutstanding: 0,
    completedAssignments: 0,
    averageGPA: 0,
  });

  useEffect(() => {
    // Load dashboard stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // This would be replaced with actual API calls
      setStats({
        coursesRegistered: 5,
        paymentsOutstanding: 2,
        completedAssignments: 8,
        averageGPA: 3.8,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const quickActions = [
    { label: 'Register Courses', href: '/dashboard/courses', icon: BookOpen, color: 'blue' },
    { label: 'Make Payment', href: '/dashboard/payments', icon: CreditCard, color: 'green' },
    { label: 'View Results', href: '/dashboard/results', icon: BarChart3, color: 'purple' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Registered</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesRegistered}</div>
            <p className="text-xs text-slate-500">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paymentsOutstanding}</div>
            <p className="text-xs text-slate-500">Urgent action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAssignments}</div>
            <p className="text-xs text-slate-500">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGPA}</div>
            <p className="text-xs text-slate-500">Last semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
              green: 'bg-green-50 text-green-600 hover:bg-green-100',
              purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
            };

            return (
              <Button
                key={action.href}
                asChild
                variant="outline"
                className={`h-auto flex-col justify-start gap-3 p-6 ${colorClasses[action.color as keyof typeof colorClasses]}`}
              >
                <a href={action.href}>
                  <Icon size={28} />
                  <span className="text-base font-semibold">{action.label}</span>
                </a>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest activities on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="font-medium text-slate-900">Mathematics Assignment Submitted</p>
                <p className="text-sm text-slate-500">2 hours ago</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Submitted
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="font-medium text-slate-900">Biology Test Results Released</p>
                <p className="text-sm text-slate-500">1 day ago</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Released
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Tuition Payment Received</p>
                <p className="text-sm text-slate-500">3 days ago</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Processed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
