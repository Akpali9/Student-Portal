'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  course_name: string;
}

interface Submission {
  id: number;
  assignment_id: number;
  title: string;
  course_name: string;
  submission_text: string;
  submitted_at: string;
  score: number;
  feedback: string;
  status: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [showSubmissionForm, setShowSubmissionForm] = useState<number | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await fetch('/api/assignments');
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments);
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId: number) => {
    if (!submissionText.trim()) {
      alert('Please enter your submission');
      return;
    }

    try {
      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          submissionText: submissionText.trim(),
        }),
      });

      if (response.ok) {
        setSubmissionText('');
        setShowSubmissionForm(null);
        loadAssignments();
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit assignment');
    }
  };

  const pendingAssignments = assignments.filter(
    (a) => !submissions.some((s) => s.assignment_id === a.id)
  );

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
        <p className="mt-2 text-slate-600">Submit and track your course assignments</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pending ({pendingAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'submitted'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Submitted ({submissions.length})
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment) => {
              const overdue = isOverdue(assignment.due_date);

              return (
                <Card key={assignment.id} className={overdue ? 'border-red-200' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText size={20} className="text-blue-600" />
                          {assignment.title}
                        </CardTitle>
                        <CardDescription>{assignment.course_name}</CardDescription>
                      </div>
                      {overdue && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          OVERDUE
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{assignment.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={16} />
                        <span>Due: {new Date(assignment.due_date).toLocaleString()}</span>
                      </div>
                      {assignment.max_score && (
                        <div className="text-slate-500">Max Score: {assignment.max_score}</div>
                      )}
                    </div>

                    {showSubmissionForm === assignment.id ? (
                      <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Type your submission here..."
                          className="w-full rounded-lg border border-slate-300 p-3 font-mono text-sm"
                          rows={6}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitAssignment(assignment.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Upload size={16} className="mr-2" />
                            Submit Assignment
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowSubmissionForm(null);
                              setSubmissionText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowSubmissionForm(assignment.id)}
                        className="w-full"
                      >
                        Submit Assignment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="mb-4 h-12 w-12 text-green-300" />
                <p className="text-center text-slate-600">
                  You're all caught up! No pending assignments.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'submitted' && (
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText size={20} className="text-green-600" />
                        {submission.title}
                      </CardTitle>
                      <CardDescription>{submission.course_name}</CardDescription>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        submission.status === 'graded'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Submitted: {new Date(submission.submitted_at).toLocaleString()}</span>
                    {submission.score !== null && (
                      <span className="font-semibold text-green-600">Score: {submission.score}</span>
                    )}
                  </div>

                  {submission.feedback && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-xs font-semibold text-blue-900 mb-2">Instructor Feedback:</p>
                      <p className="text-sm text-blue-700">{submission.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="mb-4 h-12 w-12 text-slate-300" />
                <p className="text-center text-slate-600">No submitted assignments yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
