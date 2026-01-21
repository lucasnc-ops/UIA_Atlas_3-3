import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">

      {/* Hero Section - Enhanced with Gradients */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-40"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 shadow-sm mb-8 hover:shadow-md transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-primary-700 text-xs font-bold tracking-wider uppercase">
              Union of International Architects
            </span>
          </div>

          {/* Main Title with Gradient */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-600 to-slate-900">
              ATLAS
            </span>
            {' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700">
              3+3
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-light text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
            The definitive global database of architectural projects driving the{' '}
            <span className="font-semibold text-slate-900 relative">
              UN 2030 Agenda
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-accent-400 transform origin-left"></span>
            </span>
          </p>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
            Connecting sustainable architecture projects worldwide to inspire, track progress, and accelerate global impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="group relative min-w-[200px] px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-base font-bold rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary-600/30 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Atlas
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              to="/submit"
              className="group min-w-[200px] px-10 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 text-base font-bold rounded-xl hover:border-primary-600 hover:text-primary-600 hover:bg-white transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Submit Project
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics Bar - Enhanced */}
      <section className="relative border-y border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="py-10 px-8 text-center group cursor-pointer hover:bg-primary-50/50 transition-all duration-300">
              <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-primary-800 mb-2 group-hover:scale-110 transition-transform">17</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">SDG Goals</div>
            </div>
            <div className="py-10 px-8 text-center group cursor-pointer hover:bg-accent-50/50 transition-all duration-300">
              <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-accent-500 to-accent-700 mb-2 group-hover:scale-110 transition-transform">5</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Global Regions</div>
            </div>
            <div className="py-10 px-8 text-center group cursor-pointer hover:bg-primary-50/50 transition-all duration-300">
              <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-accent-600 mb-2 group-hover:scale-110 transition-transform">2030</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Target Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Enhanced Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Architecture for a{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                Better Future
              </span>
            </h2>
            <p className="text-xl font-light text-slate-600 leading-relaxed">
              Connecting the global architectural community to share knowledge, track progress, and inspire sustainable solutions.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Global Visibility */}
            <div className="relative bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:border-primary-200 transition-all duration-500 group overflow-hidden hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">Global Visibility</h3>
                <p className="text-base font-light text-slate-600 leading-relaxed">
                  Showcase your sustainable projects on a world-class platform, reaching peers and policymakers worldwide.
                </p>
              </div>
            </div>

            {/* Card 2 - Impact Tracking */}
            <div className="relative bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:border-accent-200 transition-all duration-500 group overflow-hidden hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-accent-600 transition-colors">Impact Tracking</h3>
                <p className="text-base font-light text-slate-600 leading-relaxed">
                  Quantify architectural contributions to the UN SDGs with real-time data visualization and analytics.
                </p>
              </div>
            </div>

            {/* Card 3 - Knowledge Exchange */}
            <div className="relative bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:border-primary-200 transition-all duration-500 group overflow-hidden hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">Knowledge Exchange</h3>
                <p className="text-base font-light text-slate-600 leading-relaxed">
                  Access a library of proven solutions to accelerate the transition to a sustainable built environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="relative py-28 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl font-light text-primary-50 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join architects worldwide in building a sustainable future. Submit your project to Atlas 3+3 today.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/submit"
              className="group px-10 py-4 bg-white text-primary-700 text-base font-bold rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Submit Your Project
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              to="/dashboard"
              className="group px-10 py-4 bg-transparent border-2 border-white text-white text-base font-bold rounded-xl hover:bg-white hover:text-primary-700 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:-translate-y-1"
            >
              Explore the Atlas
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2026 Atlas 3+3 · Union of International Architects · Building a Sustainable Future
          </p>
        </div>
      </footer>
    </div>
  );
}
