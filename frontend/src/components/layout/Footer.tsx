export default function Footer() {
  return (
    <footer className="bg-mapbox-dark text-mapbox-gray border-t border-mapbox-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-mapbox-light font-semibold text-lg mb-4">Atlas 3+3</h3>
            <p className="text-sm text-mapbox-gray leading-relaxed max-w-md">
              A curated atlas of sustainable development projects managed by the Union of
              International Architects (UIA), promoting innovative urban solutions worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-mapbox-light font-medium text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm hover:text-primary-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-sm hover:text-primary-600 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/submit" className="text-sm hover:text-primary-600 transition-colors">
                  Submit Project
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-mapbox-light font-medium text-sm mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@uia-architectes.org"
                  className="hover:text-primary-600 transition-colors"
                >
                  info@uia-architectes.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.uia-architectes.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  www.uia-architectes.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-mapbox-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-mapbox-gray">
              © {new Date().getFullYear()} Union of International Architects. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-mapbox-gray">
              <a href="#" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
