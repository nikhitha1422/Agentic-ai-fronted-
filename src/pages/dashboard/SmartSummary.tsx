import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../services/api';
import { DashboardLayout } from '../../components/DashboardLayout';
import {
  Loader2,
  CheckCircle2,
  Users,
  Sparkles,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ChatBot } from '../../components/ChatBot';

interface Meeting {
  meetingId: string;
  title: string;
  date: string;
  summary: string;
  description?: string;
  status: string;
  participants?: string[];
}

export function SmartSummary() {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<string>('loading');

  // Fetch meeting details once
  useEffect(() => {
    const fetchMeeting = async () => {
      if (!meetingId) return;
      try {
        const res = await fetch(`${API_URL}/meetings/${meetingId}`);
        if (!res.ok) throw new Error('Failed to fetch meeting');
        const data = await res.json();
        setMeeting(data);
      } catch (err) {
        setError('Could not load meeting details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [meetingId]);

  // Poll for summary status after meeting ends
  useEffect(() => {
    if (!meetingId) return;
    let intervalId: any;
    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/meetings/${meetingId}/summary`);
        if (!res.ok) return;
        const data = await res.json();
        setBackendStatus(data.status);
        if (data.status === 'ready') {
          setMeeting((prev) =>
            prev ? { ...prev, summary: data.summary, status: 'summarized' } : null
          );
          clearInterval(intervalId);
        } else if (data.status === 'failed') {
          setError(data.error || 'Summary generation failed');
          setMeeting((prev) => (prev ? { ...prev, status: 'failed' } : null));
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };
    if (!loading && meeting && meeting.status !== 'summarized' && meeting.status !== 'failed') {
      intervalId = setInterval(poll, 4000);
      poll();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading, meeting?.status, meetingId]);

  const parseSummary = (text: string) => {
    if (!text) return [];
    const sections = text.split(/##\s+/);
    return sections
      .filter((s) => s.trim())
      .map((section) => {
        const lines = section.split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        return { title, content };
      });
  };

  // Render **bold** text correctly
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-bold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Meeting Summary">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium text-base">Loading meeting data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!meeting) {
    return (
      <DashboardLayout pageTitle="Meeting Summary">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <p className="text-slate-500 font-medium">{error || 'Meeting not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const isFailed = meeting.status === 'failed';
  const summarySections = parseSummary(meeting.summary);
  const showProcessing =
    !isFailed && (!meeting.summary || meeting.summary.trim() === '');

  return (
    <DashboardLayout pageTitle="Meeting Summary">
      <div className="max-w-4xl mx-auto px-4 pb-24 text-slate-900">
        {/* Meeting Info Card */}
        <div className="glass-panel rounded-[2rem] p-8 shadow-sm mb-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {meeting.title}
            </h2>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${meeting.status === 'summarized'
                  ? 'bg-green-100 text-green-700'
                  : isFailed
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
            >
              {meeting.status === 'summarized'
                ? 'Completed'
                : isFailed
                  ? 'Failed'
                  : 'Processing'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-500" />
              <span>
                {new Date(meeting.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span>
                {meeting.participants && meeting.participants.length > 0
                  ? meeting.participants.join(', ')
                  : 'Participants not recorded'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isFailed ? (
          <div className="glass-panel rounded-[2rem] p-16 text-center shadow-sm border border-red-100 bg-red-50/50">
            <AlertCircle className="mx-auto mb-6 text-red-500" size={40} />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Generation Failed</h3>
            <p className="text-slate-500 font-medium text-sm">
              {meeting.summary && meeting.summary.startsWith('Error')
                ? meeting.summary
                : 'No meeting summary available'}
            </p>
          </div>
        ) : showProcessing ? (
          <div className="glass-panel rounded-[2rem] p-16 text-center shadow-sm">
            <Sparkles className="mx-auto mb-6 text-blue-500" size={40} />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Generating Intelligence</h3>
            <p className="text-slate-500 font-medium text-sm">
              Our AI is analyzing the meeting audio to generate a comprehensive summary. This may take a moment.
              <br />
              Status: <span className="text-blue-600 capitalize">{backendStatus}</span>
            </p>
          </div>
        ) : meeting.summary ? (
          <div className="space-y-8">
            {summarySections.map((section, idx) => (
              <div key={idx} className="glass-panel rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" />
                    {section.title.replace(/^\d+️⃣\s*/, '')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.content.split('\n').map((line, lIdx) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return null;
                    const isBullet =
                      cleanLine.startsWith('-') ||
                      cleanLine.startsWith('*') ||
                      /^\d+\./.test(cleanLine);
                    if (isBullet) {
                      return (
                        <div key={lIdx} className="flex items-start gap-4">
                          <div className="mt-2.5 flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          </div>
                          <p className="text-base text-slate-600 leading-relaxed font-normal">
                            {renderFormattedText(
                              cleanLine.replace(/^[-*]\s*|\d+\.\s*/, '').trim()
                            )}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={lIdx} className="text-base text-slate-600 leading-relaxed font-normal mb-2">
                        {renderFormattedText(cleanLine)}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-[2rem] p-16 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-6 text-slate-500" size={40} />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Summary Available</h3>
            <p className="text-slate-500 font-medium text-sm">No meeting summary available</p>
          </div>
        )}
      </div>
      <ChatBot meetingId={meetingId || ''} />
    </DashboardLayout>
  );
}
