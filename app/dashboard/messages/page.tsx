'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send, Clock } from 'lucide-react';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject: string;
  message_text: string;
  is_read: boolean;
  created_at: string;
  sender_first_name: string;
  sender_last_name: string;
  recipient_first_name: string;
  recipient_last_name: string;
}

export default function MessagesPage() {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox');
  const [sendForm, setSendForm] = useState({
    recipientEmail: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setAllMessages(data.allMessages);
        setUnreadMessages(data.unreadMessages);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sendForm.recipientEmail || !sendForm.message) {
      alert('Please fill in required fields');
      return;
    }

    try {
      // In a real app, you'd look up the recipient ID by email
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: 1, // This would be replaced with actual lookup
          subject: sendForm.subject,
          message: sendForm.message,
        }),
      });

      if (response.ok) {
        setSendForm({ recipientEmail: '', subject: '', message: '' });
        alert('Message sent successfully');
        loadMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    }
  };

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="mt-2 text-slate-600">Communicate with school management and staff</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`relative px-4 py-3 font-medium transition-colors ${
            activeTab === 'inbox'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail size={18} />
            Inbox
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('send')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'send'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send size={18} className="inline mr-2" />
          Send Message
        </button>
      </div>

      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {allMessages.length > 0 ? (
            allMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                  !msg.is_read ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <CardContent className="flex items-start justify-between py-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${!msg.is_read ? 'text-blue-900' : 'text-slate-900'}`}>
                      {msg.subject || '(No subject)'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      From: {msg.sender_first_name} {msg.sender_last_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">{msg.message_text}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 text-right">
                    <div className="text-xs text-slate-500">
                      <p>{new Date(msg.created_at).toLocaleDateString()}</p>
                      <p className="mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                    </div>
                    {!msg.is_read && (
                      <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="mb-4 h-12 w-12 text-slate-300" />
                <p className="text-center text-slate-600">No messages yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'send' && (
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>
              Send a message to school management or staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipientEmail" className="text-sm font-medium">
                  Recipient Email
                </label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="admin@school.edu"
                  value={sendForm.recipientEmail}
                  onChange={(e) =>
                    setSendForm({ ...sendForm, recipientEmail: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Message subject"
                  value={sendForm.subject}
                  onChange={(e) =>
                    setSendForm({ ...sendForm, subject: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Type your message here..."
                  rows={6}
                  value={sendForm.message}
                  onChange={(e) =>
                    setSendForm({ ...sendForm, message: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Send size={16} className="mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
