export function ContactUs() {
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
            The AI Meeting Assistant is accessible through the Dashboard after login.
            For queries, feedback, or collaboration, feel free to contact me directly.
          </p>
        </div>

        {/* Contact Info Card */}
        <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-xl relative group overflow-hidden text-center">
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Email Addresses</h2>

              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Primary Email</p>
                  <a
                    href="mailto:greeshmamalineni@gmail.com"
                    className="text-lg md:text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors break-all"
                  >
                    greeshmamalineni@gmail.com
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Institutional Email</p>
                  <a
                    href="mailto:mekapatisainikhitha5110.sse@saveetha.com"
                    className="text-lg md:text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors break-all"
                  >
                    mekapatisainikhitha5110.sse@saveetha.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer spacing */}
        <div className="mt-12 h-8" />
      </div>
    </main>
  )
}
