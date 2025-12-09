import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Hero Section - Compact & Elegant */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-24">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-60"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-primary-700 text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Union of International Architects
          </h2>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
            ATLAS <span className="text-primary-600">3+3</span>
          </h1>
          
          <p className="text-lg sm:text-xl font-light text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            The definitive global database of architectural projects driving the <span className="font-medium text-slate-900 border-b-2 border-accent-300">UN 2030 Agenda</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="min-w-[160px] px-8 py-3 bg-primary-600 text-white text-sm font-bold rounded hover:bg-primary-700 transition-all shadow-md hover:shadow-primary-600/20 hover:-translate-y-0.5 tracking-wide"
            >
              Explore Atlas
            </Link>
            <Link
              to="/submit"
              className="min-w-[160px] px-8 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded hover:border-primary-600 hover:text-primary-600 transition-all hover:-translate-y-0.5 tracking-wide"
            >
              Submit Project
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics Bar - Slimmer */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="py-8 px-6 text-center group">
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">17</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">SDG Goals</div>
            </div>
            <div className="py-8 px-6 text-center group">
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">5</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Regions</div>
            </div>
            <div className="py-8 px-6 text-center group">
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">2030</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Compact */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Architecture for a Better Future</h2>
            <p className="text-lg font-light text-slate-600 leading-relaxed">
              Connecting the global architectural community to share knowledge, track progress, and inspire solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group">
              <div className="w-10 h-10 bg-primary-50 rounded flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Global Visibility</h3>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Showcase your sustainable projects on a world-class platform, reaching peers and policymakers worldwide.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 hover:shadow-lg hover:border-accent-200 transition-all duration-300 group">
              <div className="w-10 h-10 bg-accent-50 rounded flex items-center justify-center text-accent-600 mb-6 group-hover:bg-accent-400 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Impact Tracking</h3>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Quantify architectural contributions to the UN SDGs with real-time data visualization.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group">
              <div className="w-10 h-10 bg-primary-50 rounded flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Knowledge Exchange</h3>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Access a library of proven solutions to accelerate the transition to a sustainable built environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Compact */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
            Ready to Contribute?
          </h2>
          <p className="text-lg font-light text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Join the movement. Submit your project to the Atlas 3+3.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              className="px-8 py-3 bg-primary-600 text-white text-sm font-bold rounded hover:bg-primary-700 transition-all shadow-md hover:shadow-primary-600/20 hover:-translate-y-0.5 tracking-wide"
            >
              Submit Your Project
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded hover:border-slate-400 hover:text-slate-900 transition-all hover:-translate-y-0.5 tracking-wide"
            >
              View the Atlas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}