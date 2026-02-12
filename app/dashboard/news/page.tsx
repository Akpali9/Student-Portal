'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Calendar, User } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  category: string;
  first_name: string;
  last_name: string;
  published_date: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
      }
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading news...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">School News & Updates</h1>
        <p className="mt-2 text-slate-600">Stay informed about the latest school announcements</p>
      </div>

      {news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="md:flex">
                {item.image_url && (
                  <div className="relative h-48 md:w-48 md:h-auto flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <CardDescription className="mt-2">{item.category}</CardDescription>
                      </div>
                      {item.category && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between">
                    <p className="text-slate-600 line-clamp-3">{item.content}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {new Date(item.published_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>
                          {item.first_name} {item.last_name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-center text-slate-600">No news available at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
