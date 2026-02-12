'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  CreditCard,
  MessageSquare,
  Users,
  BarChart3,
  Download,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
        // User is not authenticated
      }
    };

    checkAuth();
  }, [router]);

  const features = [
    {
      icon: BookOpen,
      title: 'Course Registration',
      description: 'Easily register for courses and manage your academic schedule',
    },
    {
      icon: CreditCard,
      title: 'Payment Management',
      description: 'Pay school fees and purchase scratch cards securely',
    },
    {
      icon: BarChart3,
      title: 'Check Results',
      description: 'View your grades and cumulative GPA for all courses',
    },
    {
      icon: Download,
      title: 'Download E-Books',
      description: 'Access course materials and study resources anytime',
    },
    {
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Communicate with school management and staff members',
    },
    {
      icon: Users,
      title: 'Class Directory',
      description: 'Connect with classmates and view their contact information',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">EduPortal</h1>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Student Portal for
          <span className="block text-blue-600">Academic Success</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
          Manage your courses, payments, grades, and communications all in one place.
          Your complete academic management solution.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button
            onClick={() => router.push('/register')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Account
          </Button>
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            size="lg"
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h3 className="mb-12 text-center text-3xl font-bold text-slate-900">
          Everything You Need
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className="mb-4 h-8 w-8 text-blue-600" />
                <h4 className="mb-2 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h4>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="rounded-lg bg-blue-50 px-8 py-12">
          <h3 className="text-3xl font-bold text-slate-900">Ready to Get Started?</h3>
          <p className="mt-4 text-slate-600">
            Join thousands of students using our platform for academic success.
          </p>
          <Button
            onClick={() => router.push('/register')}
            size="lg"
            className="mt-6 bg-blue-600 hover:bg-blue-700"
          >
            Register Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-slate-600">
          <p>&copy; 2024 EduPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
