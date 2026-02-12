'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Clock, CheckCircle } from 'lucide-react';

interface Course {
  id: number;
  course_code: string;
  course_name: string;
  description: string;
  credit_units: number;
  first_name: string;
  last_name: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'registered'>('available');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
        setRegisteredCourses(data.registeredCourses);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (courseId: number) => {
    try {
      const response = await fetch('/api/courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        setRegisteredCourses([...registeredCourses, courseId]);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to register course');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register course');
    }
  };

  const handleDrop = async (courseId: number) => {
    if (!confirm('Are you sure you want to drop this course?')) return;

    try {
      const response = await fetch(`/api/courses/register?courseId=${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegisteredCourses(registeredCourses.filter((id) => id !== courseId));
      }
    } catch (error) {
      console.error('Drop failed:', error);
      alert('Failed to drop course');
    }
  };

  const myRegisteredCourses = courses.filter((c) => registeredCourses.includes(c.id));
  const availableCourses = courses.filter((c) => !registeredCourses.includes(c.id));

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Course Registration</h1>
        <p className="mt-2 text-slate-600">Register for courses or view your current enrollments</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'registered'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Courses ({myRegisteredCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'available'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Available Courses ({availableCourses.length})
        </button>
      </div>

      {activeTab === 'registered' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {myRegisteredCourses.length > 0 ? (
            myRegisteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" />
                        {course.course_name}
                      </CardTitle>
                      <CardDescription>{course.course_code}</CardDescription>
                    </div>
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                  <p className="text-sm text-slate-600">{course.description}</p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-500" />
                      <span>{course.first_name} {course.last_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      <span>{course.credit_units} units</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDrop(course.id)}
                    className="w-full"
                  >
                    Drop Course
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-500">You haven't registered for any courses yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'available' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {availableCourses.length > 0 ? (
            availableCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-600" />
                    {course.course_name}
                  </CardTitle>
                  <CardDescription>{course.course_code}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{course.description}</p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-500" />
                      <span>{course.first_name} {course.last_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      <span>{course.credit_units} units</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRegister(course.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Register Course
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-500">You're registered for all available courses</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
