'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, IdCard } from 'lucide-react';

interface Classmate {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  registration_number: string;
  profile_photo_url: string;
}

interface CurrentClass {
  name: string;
  academicYear: string;
  semester: number;
}

export default function DirectoryPage() {
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [currentClass, setCurrentClass] = useState<CurrentClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDirectory();
  }, []);

  const loadDirectory = async () => {
    try {
      const response = await fetch('/api/directory');
      if (response.ok) {
        const data = await response.json();
        setClassmates(data.classmates);
        setCurrentClass(data.currentClass);
      }
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClassmates = classmates.filter(
    (classmate) =>
      classmate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classmate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classmate.registration_number.includes(searchTerm) ||
      classmate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading directory...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Class Directory</h1>
        <p className="mt-2 text-slate-600">Connect with your classmates and view their details</p>
      </div>

      {currentClass && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Current Class</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div>
              <p className="text-sm text-blue-700">Class</p>
              <p className="text-lg font-semibold text-blue-900">{currentClass.name}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Academic Year</p>
              <p className="text-lg font-semibold text-blue-900">{currentClass.academicYear}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Semester</p>
              <p className="text-lg font-semibold text-blue-900">{currentClass.semester}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Classmates ({filteredClassmates.length})
            </h2>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by name, registration number, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
        />
      </div>

      {filteredClassmates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClassmates.map((classmate) => (
            <Card key={classmate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {classmate.profile_photo_url ? (
                    <img
                      src={classmate.profile_photo_url}
                      alt={`${classmate.first_name} ${classmate.last_name}`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
                      <span className="text-sm font-bold text-blue-900">
                        {classmate.first_name[0]}
                        {classmate.last_name[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {classmate.first_name} {classmate.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <IdCard size={14} />
                      {classmate.registration_number}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const mailto = `mailto:${classmate.email}`;
                    window.location.href = mailto;
                  }}
                >
                  <Mail size={16} className="mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searchTerm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-center text-slate-600">No classmates match your search</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-center text-slate-600">
              No classmates found. Class enrollment information may not be available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
