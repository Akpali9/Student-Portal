'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, FileText } from 'lucide-react';

interface EBook {
  id: number;
  title: string;
  author: string;
  description: string;
  course_name: string;
  file_type: string;
  file_size: number;
  isbn: string;
  is_downloaded: number;
}

export default function EBooksPage() {
  const [ebooks, setEbooks] = useState<EBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadedBooks, setDownloadedBooks] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    try {
      const response = await fetch('/api/ebooks');
      if (response.ok) {
        const data = await response.json();
        setEbooks(data.ebooks);
        // Track which books are downloaded
        const downloaded = new Set(
          data.ebooks
            .filter((book: EBook) => book.is_downloaded)
            .map((book: EBook) => book.id)
        );
        setDownloadedBooks(downloaded);
      }
    } catch (error) {
      console.error('Failed to load ebooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (ebook: EBook) => {
    // In a real app, this would download the file
    alert(`Download started: ${ebook.title}`);
    setDownloadedBooks(new Set([...downloadedBooks, ebook.id]));
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  // Group ebooks by course
  const groupedEbooks = ebooks.reduce(
    (acc, ebook) => {
      if (!acc[ebook.course_name]) {
        acc[ebook.course_name] = [];
      }
      acc[ebook.course_name].push(ebook);
      return acc;
    },
    {} as Record<string, EBook[]>
  );

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading e-books...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Course E-Books</h1>
        <p className="mt-2 text-slate-600">Download course materials and study resources</p>
      </div>

      {ebooks.length > 0 ? (
        Object.entries(groupedEbooks).map(([courseName, courseBooks]) => (
          <div key={courseName} className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">{courseName}</h2>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                {courseBooks.length} book{courseBooks.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {courseBooks.map((ebook) => (
                <Card key={ebook.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-start gap-2">
                        <FileText size={18} className="text-blue-600 flex-shrink-0 mt-1" />
                        <span className="line-clamp-2">{ebook.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">{ebook.author}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                    {ebook.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{ebook.description}</p>
                    )}

                    <div className="space-y-1 text-xs text-slate-500">
                      {ebook.isbn && <p>ISBN: {ebook.isbn}</p>}
                      <p>Type: {ebook.file_type.toUpperCase()}</p>
                      {ebook.file_size && <p>Size: {formatFileSize(ebook.file_size)}</p>}
                    </div>

                    <Button
                      onClick={() => handleDownload(ebook)}
                      variant={downloadedBooks.has(ebook.id) ? 'outline' : 'default'}
                      className={`w-full ${
                        downloadedBooks.has(ebook.id)
                          ? 'text-green-600 border-green-300'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Download size={16} className="mr-2" />
                      {downloadedBooks.has(ebook.id) ? 'Downloaded' : 'Download'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-center text-slate-600">
              No e-books available for your courses yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
