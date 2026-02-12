'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

interface Result {
  id: number;
  course_id: number;
  score: number;
  grade: string;
  gpa_points: number;
  academic_year: string;
  semester: number;
  course_name: string;
  course_code: string;
  credit_units: number;
  released_date: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [cumulativeGPA, setCumulativeGPA] = useState('0.00');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await fetch('/api/results');
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setCumulativeGPA(data.cumulativeGPA);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const gradeMap: Record<string, { bg: string; text: string; icon: string }> = {
      'A': { bg: 'bg-green-50', text: 'text-green-700', icon: '🌟' },
      'B': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '⭐' },
      'C': { bg: 'bg-amber-50', text: 'text-amber-700', icon: '📊' },
      'D': { bg: 'bg-orange-50', text: 'text-orange-700', icon: '⚠️' },
      'F': { bg: 'bg-red-50', text: 'text-red-700', icon: '❌' },
    };
    return gradeMap[grade] || { bg: 'bg-slate-50', text: 'text-slate-700', icon: '—' };
  };

  // Group results by academic year and semester
  const groupedResults = results.reduce(
    (acc, result) => {
      const key = `${result.academic_year}-S${result.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    },
    {} as Record<string, Result[]>
  );

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading results...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Academic Results</h1>
        <p className="mt-2 text-slate-600">View your course grades and cumulative GPA</p>
      </div>

      {/* Cumulative GPA Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-blue-900">Cumulative GPA</CardTitle>
            <CardDescription className="text-blue-700">Overall academic performance</CardDescription>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600">{cumulativeGPA}</div>
        </CardContent>
      </Card>

      {/* Results by Period */}
      {Object.entries(groupedResults)
        .sort(([keyA], [keyB]) => {
          const [yearA, semA] = keyA.split('-');
          const [yearB, semB] = keyB.split('-');
          if (yearA !== yearB) return yearB.localeCompare(yearA);
          return semB.localeCompare(semA);
        })
        .map(([period, periodResults]) => {
          const [year, semester] = period.split('-');
          const semesterNum = semester.replace('S', '');

          return (
            <div key={period} className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  {year} - Semester {semesterNum}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {periodResults.map((result) => {
                  const gradeColor = getGradeColor(result.grade);

                  return (
                    <Card key={result.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                        <div className="flex-1">
                          <CardTitle className="text-base">{result.course_name}</CardTitle>
                          <CardDescription>{result.course_code}</CardDescription>
                        </div>
                        <div
                          className={`flex items-center justify-center rounded-lg p-3 font-bold ${gradeColor.bg} ${gradeColor.text} text-xl`}
                        >
                          {result.grade}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-slate-500">Score</p>
                            <p className="font-semibold text-slate-900">{result.score}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">GPA</p>
                            <p className="font-semibold text-slate-900">{result.gpa_points}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Units</p>
                            <p className="font-semibold text-slate-900">{result.credit_units}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">
                          Released: {new Date(result.released_date).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Empty State */}
      {results.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-center text-slate-600">
              No released results available yet.
              <br />
              Check back later for your grades.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
