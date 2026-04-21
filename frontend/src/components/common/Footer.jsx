import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white">🛡️</span>
              </div>
              <span className="font-display font-bold text-white text-lg">SafeBite AI</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered food hygiene monitoring platform. Helping customers eat safely and restaurants improve standards.
            </p>
            <p className="text-xs mt-4 text-primary-light font-medium">🍃 Eat with Confidence</p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-primary-light transition-colors">Find Safe Food</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary-light transition-colors">Leaderboard</Link></li>
              <li><Link to="/register" className="hover:text-primary-light transition-colors">Register Business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-primary-light transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary-light transition-colors">Sign Up</Link></li>
              <li><span className="text-xs">Made for Prayagraj 🏙️</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2024 SafeBite AI · All rights reserved</p>
          <p className="text-xs">Built with ❤️ for public health & food safety</p>
        </div>
      </div>
    </footer>
  );
}
