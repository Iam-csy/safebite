import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const features = [
  { icon: '🤖', title: 'AI Hygiene Scanner', desc: 'Upload kitchen photos and get instant AI-powered hygiene scores with detected issues and recommendations.' },
  { icon: '🥦', title: 'Food Freshness Check', desc: 'Analyze food images to detect freshness levels — Fresh, Medium, Spoiled, or Unsafe.' },
  { icon: '🌡️', title: 'Temperature Monitor', desc: 'Real-time cold storage monitoring with automatic alerts when temperatures enter the danger zone.' },
  { icon: '📍', title: 'Nearby Safe Food', desc: 'Discover top-rated hygienic restaurants near you filtered by score, food type, and price.' },
  { icon: '🏅', title: 'Trust Badges & QR', desc: 'Verified restaurants receive a QR trust badge customers can scan to view real-time hygiene data.' },
  { icon: '📢', title: 'Complaint System', desc: 'Report food safety issues with photo evidence. Our admin team reviews every complaint.' },
];

const steps = [
  { step: '01', title: 'Register Your Business', desc: 'Owners sign up and submit their restaurant details for verification.' },
  { step: '02', title: 'Upload Kitchen Images', desc: 'Our AI scans photos and generates a detailed hygiene report instantly.' },
  { step: '03', title: 'Earn Your Badge', desc: 'Pass inspection thresholds to receive Gold, Silver, or verification badges.' },
  { step: '04', title: 'Customers Trust You', desc: 'Display your QR badge. Customers scan it to see your live hygiene score.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #86efac 0%, transparent 60%), radial-gradient(circle at 80% 20%, #6ee7b7 0%, transparent 50%)' }}>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-dark px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI-Powered Food Safety Platform · Prayagraj & Beyond
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 animate-slide-up">
            Eat with<br />
            <span className="text-primary">Confidence</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            SafeBite AI monitors food hygiene across restaurants, street stalls, and cloud kitchens —
            giving you real AI-verified safety scores before you eat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/search" className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
              🔍 Find Safe Food Near You
            </Link>
            <Link to="/register" className="btn-outline text-base px-8 py-3.5 rounded-2xl">
              🏪 Register Your Restaurant
            </Link>
          </div>

          {/* Hero stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in">
            {[
              { val: '500+', label: 'Restaurants Monitored' },
              { val: '98%', label: 'Accuracy Rate' },
              { val: '10K+', label: 'Safe Meals Tracked' },
              { val: '24/7', label: 'AI Monitoring' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary">{val}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Everything You Need for Food Safety</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Comprehensive AI-driven tools for customers, restaurant owners, and health inspectors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">From registration to trust — in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-primary to-transparent"></div>
                )}
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary-light font-display font-bold text-xl mb-4">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score badges preview */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Hygiene Score Badges</h2>
          <p className="text-gray-500 text-lg">Transparent, AI-calculated scores updated after every inspection</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {[
            { score: 92, name: 'The Green Kitchen', cat: 'Restaurant' },
            { score: 74, name: 'Mama\'s Dhaba', cat: 'Street Food' },
            { score: 55, name: 'Quick Bites', cat: 'Cloud Kitchen' },
          ].map(({ score, name, cat }) => {
            const color = score >= 85 ? '#F59E0B' : score >= 65 ? '#9CA3AF' : '#EF4444';
            const label = score >= 85 ? '🥇 Gold Safe' : score >= 65 ? '🥈 Silver Safe' : '⚠️ Needs Improvement';
            return (
              <div key={name} className="card flex flex-col items-center gap-4 w-52 text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 font-display font-bold text-2xl"
                  style={{ borderColor: color, color, backgroundColor: color + '12' }}>
                  {score}
                  <span className="text-xs font-normal opacity-60">/100</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-xs text-gray-500">{cat}</p>
                  <p className="text-xs font-semibold mt-2" style={{ color }}>{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Ready to Eat Safer?</h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of customers and restaurant owners building a safer food ecosystem in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="bg-white text-primary font-bold px-8 py-3.5 rounded-2xl hover:bg-primary-50 transition-colors">
              Find Safe Restaurants
            </Link>
            <Link to="/register?role=owner" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors">
              Register My Restaurant
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
