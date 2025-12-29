import { useState, FormEvent, ChangeEvent } from 'react'
import { Input, Textarea } from '../components/Input'
export function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  })
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <main className="bg-white min-h-screen text-slate-900 font-inter selection:bg-blue-50">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-50/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto font-medium">
            Our team is ready to answer your questions and help you get started.
          </p>
        </div>

        {/* Center Aligned Form Card */}
        <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-xl relative group overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name + Email Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <Input
                  name="fullName"
                  type="text"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="bg-white border border-slate-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white border border-slate-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
              <Textarea
                name="message"
                placeholder="How can we assist you?"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-white border border-slate-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium min-h-[150px] resize-none shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* footer spacing */}
        <div className="mt-12 h-8" />
      </div>
    </main>
  )
}
