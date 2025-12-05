import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-mapbox-black border-b border-mapbox-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-semibold text-white tracking-tight">
                Atlas 3+3
              </h1>
              <p className="text-xs text-mapbox-gray tracking-wide">
                UIA Sustainable Development
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-mapbox-gray hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-mapbox-gray hover:text-primary-400 transition-colors"
            >
              SDG Atlas
            </Link>
            <Link
              to="/submit"
              className="text-sm font-medium text-mapbox-gray hover:text-primary-400 transition-colors"
            >
              Submit Project
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-mapbox-gray hover:text-primary-400 transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-400 transition-colors shadow-sm"
            >
              Submit Project
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
