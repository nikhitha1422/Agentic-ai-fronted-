import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { CheckSquare, Clock, Bell, ArrowLeft, Loader2, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../services/api'

import { io } from 'socket.io-client'

const socket = io(API_URL.replace('/api', ''));

interface Task {
  id: string;
  task: string;
  assignedTo: string;
  status: 'pending' | 'neutralizing' | 'done' | 'failed';
  dueDate?: string;
  meetingTitle?: string;
  meetingId?: string;
  hasReminder?: boolean;
  agentOutput?: string;
  confidenceScore?: number;
  nextSteps?: string[];
  failureReason?: string;
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'assigned-to-me' | 'assigned-by-me'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done' | 'failed'>('all') // Removed neutralizing from standard filter view

  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // 1. Fetch Current User
    fetch(`${API_URL}/users/default_operator`)
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Error fetching user:', err));

    fetchTasks()

    // Real-time status updates
    socket.on('task-status-updated', (data: { taskId: string, status: any, task?: any }) => {
      setTasks(prev => prev.map(t => {
        if (t.id === data.taskId) {
          // Allow partial updates if task data is provided, or just status
          return { ...t, ...(data.task || {}), status: data.status };
        }
        return t;
      }));
    });

    return () => {
      socket.off('task-status-updated');
    };
  }, [])

  const fetchTasks = () => {
    fetch(`${API_URL}/meetings/tasks/all`)
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching tasks:', err)
        setLoading(false)
      })
  }

  // UPDATED: Manual "Mark Complete" Action
  const handleMarkComplete = async (task: Task) => {
    // Optimistic Update
    const originalStatus = task.status;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done' } : t));

    try {
      const res = await fetch(`${API_URL}/meetings/tasks/${task.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: task.meetingId,
          status: 'done'
        })
      });
      if (!res.ok) throw new Error('Failed to update status');
    } catch (err) {
      console.error("Task completion error:", err);
      // Revert on error
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: originalStatus } : t));
      alert("Failed to mark task as complete.");
    }
  }



  const filteredTasks = tasks.filter(task => {
    // 1. Status Filter
    if (statusFilter !== 'all') {
      if (task.status === 'neutralizing' && statusFilter === 'pending') {
        // Include neutralizing in pending view if desired, or strict match
      } else if (task.status !== statusFilter) {
        return false;
      }
    }

    // 2. Assignment Filter (Me vs Delegated)
    if (currentUser) {
      // Normalize names for comparison (simple check)
      const myName = currentUser.fullName.toLowerCase();
      const assignee = (task.assignedTo || '').toLowerCase();

      if (filter === 'assigned-to-me') {
        // Check if assignee contains part of my name or strictly matches
        // Also include "Unassigned" in "Me" bucket? Or separate? Usually "Me" is strict.
        // Let's assume strict match or simple include
        if (!assignee.includes(myName) && assignee !== 'me' && assignee !== 'self') return false;
      }
      if (filter === 'assigned-by-me') {
        // "Delegated" -> Assigned to someone else
        if (assignee.includes(myName) || assignee === 'me') return false;
      }
    }

    return true;
  })

  // Helper to map status to UI friendly terms
  const getStatusLabel = (status: string) => {
    if (status === 'neutralizing') return 'Processing';
    if (status === 'done') return 'Completed';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  if (loading) {
    return (
      <DashboardLayout pageTitle="Tasks">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Tasks">
      <div className="space-y-8 text-slate-900 font-inter pb-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <button className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all group">
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Your Tasks
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Track and manage action items from your meetings.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="glass-panel p-1.5 rounded-xl border border-white/50 shadow-sm">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'assigned-to-me', label: 'Assigned to Me' },
              { id: 'assigned-by-me', label: 'Delegated' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <Filter size={16} className="text-slate-400" />
            <div className="glass-panel p-1 rounded-xl flex gap-1">
              {['all', 'pending', 'done', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all lowercase first-letter:uppercase border ${statusFilter === status ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100/50'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="glass-panel rounded-2xl border border-white/60 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100/50">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-6 hover:bg-white/40 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleMarkComplete(task)}
                        disabled={task.status === 'done'}
                        className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.status === 'done'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm scale-100'
                          : 'border-slate-300 text-transparent hover:border-blue-400 bg-white/50'
                          }`}
                      >
                        <CheckSquare size={14} fill="currentColor" />
                      </button>

                      <div className="space-y-1">
                        <h3 className={`text-base font-bold text-slate-900 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                          {task.task}
                        </h3>
                        {task.meetingTitle && (
                          <Link to={`/dashboard/meetings/${task.meetingId}/summary`} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors">
                            <span>From: {task.meetingTitle}</span>
                          </Link>
                        )}
                      </div>

                      {task.hasReminder && (
                        <div className="flex items-start">
                          <Bell size={16} className="text-orange-500 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 ml-10 pl-0.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border ${(task.assignedTo || '').includes(currentUser?.fullName.split(' ')[0] || 'Unknown')
                          ? 'bg-blue-100 text-blue-600 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                          {(task.assignedTo || 'U')[0]}
                        </div>
                        <span className="text-xs font-medium text-slate-500">{task.assignedTo || 'Unassigned'}</span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <Clock size={14} />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-10 md:pl-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${task.status === 'done' ? 'bg-green-50/50 border-green-100 text-green-600' :
                        task.status === 'neutralizing' ? 'bg-blue-50/50 border-blue-100 text-blue-600' :
                          task.status === 'failed' ? 'bg-red-50/50 border-red-100 text-red-600' :
                            'bg-amber-50/50 border-amber-100 text-amber-600'
                        }`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-medium">No tasks found matching your filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
