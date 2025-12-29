import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import {
  User,
  Briefcase,
  Calendar,
  Edit,
  Key,
  Trash2,
  ArrowLeft,
  Loader2,
  Camera,
  Save,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../services/api'

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  rank: string;
  specialization: string;
  affiliation: string;
  avatar: string;
  metrics: {
    sessionCount: number;
    objectivesNeutralized: number;
    intelligenceExtractions: number;
    missionEfficiency: number;
  };
}

export function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<UserData | null>(null)
  const [showSecurity, setShowSecurity] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [passwordStatus, setPasswordStatus] = useState({ message: '', type: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = () => {
    fetch(`${API_URL}/users/default_operator`)
      .then(res => res.json())
      .then(data => {
        setUserData(data)
        setEditForm(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching profile:', err)
        setLoading(false)
      })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editForm) {
      setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }
  }

  const saveProfile = async () => {
    if (!editForm) return;
    try {
      const res = await fetch(`${API_URL}/users/default_operator/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setUserData(editForm);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);

      try {
        const res = await fetch(`${API_URL}/users/default_operator/avatar`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.avatar) {
          setUserData(prev => prev ? { ...prev, avatar: data.avatar } : null);
        }
      } catch (err) {
        console.error('Error uploading avatar:', err);
      }
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordStatus({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/default_operator/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ message: 'Password updated successfully', type: 'success' });
        setPasswordForm({ current: '', new: '', confirm: '' });
        setTimeout(() => setShowSecurity(false), 2000);
      } else {
        setPasswordStatus({ message: data.error || 'Failed to update password', type: 'error' });
      }
    } catch (err) {
      setPasswordStatus({ message: 'Network error', type: 'error' });
    }
  }

  if (loading || !userData) {
    return (
      <DashboardLayout pageTitle="Profile">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const initials = userData.fullName.split(' ').map(n => n[0]).join('')

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="max-w-4xl mx-auto space-y-8 text-slate-900 font-inter pb-20">
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-xs group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Profile Header */}
        <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              {userData.avatar ? (
                <img
                  src={`${API_URL}${userData.avatar}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover shadow-lg shadow-blue-500/30 ring-4 ring-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/30 ring-4 ring-white">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {userData.fullName}
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1">{userData.rank} • {userData.affiliation}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveProfile}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-green-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setEditForm(userData); }}
                      className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowSecurity(true)}
                      className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all font-bold text-sm flex items-center gap-2"
                    >
                      <Key size={16} />
                      Security
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <User size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Personal Information
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editForm?.fullName}
                    onChange={handleEditChange}
                    className="glass-input w-full px-3 py-2 rounded-lg text-slate-900 font-semibold text-sm"
                  />
                ) : (
                  <div className="text-base font-semibold text-slate-900">{userData.fullName}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm?.email}
                    onChange={handleEditChange}
                    className="glass-input w-full px-3 py-2 rounded-lg text-slate-900 font-semibold text-sm"
                  />
                ) : (
                  <div className="text-base font-semibold text-slate-900">{userData.email}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm?.phone}
                    onChange={handleEditChange}
                    className="glass-input w-full px-3 py-2 rounded-lg text-slate-900 font-semibold text-sm"
                  />
                ) : (
                  <div className="text-base font-semibold text-slate-900">{userData.phone}</div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Role & Organization
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="rank"
                    value={editForm?.rank}
                    onChange={handleEditChange}
                    className="glass-input w-full px-3 py-2 rounded-lg text-slate-900 font-semibold text-sm"
                  />
                ) : (
                  <div className="text-base font-semibold text-slate-900">{userData.rank}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Specialization</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={editForm?.specialization}
                    onChange={handleEditChange}
                    className="glass-input w-full px-3 py-2 rounded-lg text-slate-900 font-semibold text-sm"
                  />
                ) : (
                  <div className="text-base font-semibold text-slate-900">{userData.specialization}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="affiliation"
                    value={editForm?.affiliation}
                    onChange={handleEditChange}
                    className="glass-input w-full px-3 py-2 rounded-lg text-slate-900 font-semibold text-sm"
                  />
                ) : (
                  <div className="text-base font-semibold text-slate-900">{userData.affiliation}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Calendar size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Activity Metrics
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1 p-4 rounded-xl bg-slate-50/50 border border-slate-100/50">
              <div className="text-3xl font-bold text-slate-900">
                {userData.metrics.sessionCount}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Sessions</div>
            </div>
            <div className="space-y-1 p-4 rounded-xl bg-slate-50/50 border border-slate-100/50">
              <div className="text-3xl font-bold text-blue-600">
                {userData.metrics.objectivesNeutralized}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Tasks Done</div>
            </div>
            <div className="space-y-1 p-4 rounded-xl bg-slate-50/50 border border-slate-100/50">
              <div className="text-3xl font-bold text-purple-600">
                {userData.metrics.intelligenceExtractions}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Insights</div>
            </div>
            <div className="space-y-1 p-4 rounded-xl bg-slate-50/50 border border-slate-100/50">
              <div className="text-3xl font-bold text-green-600">
                {userData.metrics.missionEfficiency}%
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Efficiency</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 rounded-[1.5rem] p-8 border border-red-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100/50 text-red-600 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-red-900">
              Delete Account
            </h3>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-red-700 text-sm font-medium">
              This action is permanent and cannot be undone. All your data will be erased.
            </p>
            <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-sm active:scale-95 whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Security Modal */}
      {showSecurity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-heavy w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
            <button
              onClick={() => setShowSecurity(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Key className="text-blue-600" size={20} />
              Change Password
            </h3>

            <form onSubmit={changePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl text-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">New Password</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl text-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl text-slate-900"
                  required
                />
              </div>

              {passwordStatus.message && (
                <div className={`text-sm font-bold text-center p-2 rounded-lg ${passwordStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {passwordStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all active:scale-95"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
