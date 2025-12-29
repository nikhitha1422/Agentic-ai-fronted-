import { useState, FormEvent, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function SignUp() {
  const [formData, setFormData] = useState({
    fullName: 'SAI NIKHITHA',
    email: '8519921849@ybl',
    phone: '+919626918923',
    password: '',
    acceptTerms: false,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Sign up:', formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-slate-900 font-inter relative overflow-hidden bg-slate-50">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/60 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/60 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[450px] space-y-12 glass-heavy p-10 rounded-3xl relative z-10 shadow-2xl">
        {/* Header Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 glass-input rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Join us to get started with your mission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="glass-input rounded-xl px-4 py-3 text-base font-medium text-slate-900 focus:outline-none transition-all shadow-sm w-full"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="glass-input rounded-xl px-4 py-3 text-base font-medium text-slate-900 focus:outline-none transition-all shadow-sm w-full"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Enter your phone"
            value={formData.phone}
            onChange={handleChange}
            className="glass-input rounded-xl px-4 py-3 text-base font-medium text-slate-900 focus:outline-none transition-all shadow-sm w-full"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            className="glass-input rounded-xl px-4 py-3 text-base font-medium text-slate-900 focus:outline-none transition-all shadow-sm w-full"
          />

          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              required
            />
            <label htmlFor="acceptTerms" className="text-sm font-medium text-slate-600 cursor-pointer">
              I accept the Terms & Privacy Policy
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] text-sm tracking-wide"
            >
              Create Account
            </Button>
          </div>
        </form>

        <p className="text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
