import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-mapbox-black text-mapbox-light selection:bg-primary-500 selection:text-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-32 sm:pt-12 sm:pb-40">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8">
            <span className="block bg-gradient-to-b from-white to-mapbox-gray bg-clip-text text-transparent pb-2">
              Building a Sustainable
            </span>
            <span className="block text-primary-500">Future, Together.</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-mapbox-gray max-w-3xl mx-auto font-light leading-relaxed">
            The definitive global atlas of sustainable development projects.
            Curated by the <span className="text-white font-normal">Union of International Architects</span>.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-primary-600 rounded-full hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 focus:ring-offset-mapbox-black"
            >
              Start Exploring
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/submit"
              className="text-base font-medium text-mapbox-gray hover:text-white transition-colors flex items-center gap-2"
            >
              Submit a Project <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>
    </section>

    {/* CTA Footer */}
    <section className="py-24 bg-mapbox-dark border-t border-mapbox-border relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready to contribute?
          </h2>
          <p className="text-xl text-mapbox-gray mb-12 max-w-2xl mx-auto font-light">
            Join the movement. Submit your project to the Atlas 3+3 and help shape the future of sustainable architecture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              className="px-8 py-4 bg-white text-mapbox-black font-bold rounded-full hover:bg-primary-50 transition-colors"
            >
              Submit Project
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-transparent border border-mapbox-border text-white font-medium rounded-full hover:border-white transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-900/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      </section>
    </div>
  );
}