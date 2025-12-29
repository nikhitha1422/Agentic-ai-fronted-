import { Link } from 'react-router-dom'
import { ChevronRight, Shield, Cpu, BarChart3, Globe, CheckCircle2 } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const revealRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setIsLoaded(true)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, { threshold: 0.1 })

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-white text-slate-900 overflow-hidden font-inter selection:bg-blue-100">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 px-6 sm:px-12 overflow-hidden">
        {/* Soft Blue Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#F0F7FF_0%,#FFFFFF_70%)] -z-10" />
        <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-blue-50/50 rounded-full blur-[120px] -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative">
          {/* Main Hero Copy - Zoom In Effect */}
          <div className={`space-y-10 transition-all duration-1000 ${isLoaded ? 'animate-zoom-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-semibold shadow-sm">
              <Cpu size={14} className="animate-pulse" />
              Next-Gen Meeting Intelligence
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Focus on the Talk. <br />
              <span className="text-blue-600">We'll handle the notes.</span>
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
              The premier agentic assistant for business leaders.
              Seamlessly record, transcribe, and extract intelligence from every interaction.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link to="/signup">
                <button className="px-10 py-5 bg-[#4A90E2] text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg active:scale-95 animate-heartbeat-glow">
                  Begin Free Trial
                </button>
              </Link>
              <button className="flex items-center gap-3 text-slate-600 font-bold text-lg hover:text-blue-600 transition-colors group">
                Watch how it works
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 transition-all">
                  <ChevronRight size={20} />
                </div>
              </button>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="relative group perspective-1000 lg:block hidden">
            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {/* Main "Meeting Interface" Mockup */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl relative z-20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-500">AI Extraction Active</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-slate-50 rounded-full w-full"></div>
                  <div className="h-2 bg-slate-50 rounded-full w-5/6"></div>
                  <div className="h-2 bg-slate-50 rounded-full w-4/6"></div>
                </div>
              </div>

              {/* Floating "Action Items" Card */}
              <div className="absolute -top-10 -right-10 w-64 bg-white border border-slate-100 rounded-2xl p-6 shadow-xl z-30 animate-float">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Action Items Generated</span>
                </div>
                <div className="space-y-3 opacity-40">
                  <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-1.5 bg-slate-100 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Floating "Intelligence" Card */}
              <div className="absolute -bottom-12 -left-12 w-56 bg-white border border-slate-100 rounded-2xl p-6 shadow-xl z-30 animate-float-delayed">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                    <BarChart3 size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Intelligence Report</span>
                </div>
                <div className="h-20 bg-blue-50/30 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with Scroll Reveals */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div
            ref={el => revealRefs.current[0] = el}
            className="reveal text-center space-y-4 mb-24"
          >
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Everything you need for smarter meetings.</h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Built from the ground up for teams that value clarity and execution speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: BarChart3, title: "Executive Summaries", desc: "Complex discussions boiled down to what matters most. Instantly." },
              { icon: Globe, title: "Deep Integrations", desc: "Your notes sync where they belong. Notion, Slack, Jira, and more." },
              { icon: Shield, title: "Enterprise Grade", desc: "Data privacy is our foundation. End-to-end encryption for every byte." }
            ].map((feature, i) => (
              <div
                key={i}
                ref={el => revealRefs.current[i + 1] = el}
                className="reveal space-y-6 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Footer */}
      <footer className="border-t border-slate-100 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4A90E2] flex items-center justify-center text-white font-bold text-[10px] shadow-sm shadow-blue-200">AM</div>
            <span className="text-slate-900 font-bold text-base tracking-tight">Agentic AI <span className="text-blue-600">for Meetings</span></span>
          </div>
          <div className="flex gap-12 text-slate-500 text-sm font-medium">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
          <div className="text-slate-400 text-xs font-medium">
            © 2024 Agentic AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
