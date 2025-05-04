
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-primary">InsightGuardian</div>
          <div className="space-x-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Register
            </Link>
          </div>
        </header>
        
        <main>
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Workplace Monitoring Powered by AI
              </h1>
              <p className="text-lg mb-8 text-gray-700">
                Enhance productivity and ensure safety with our advanced ML and Computer Vision
                monitoring system. Get real-time insights and analytics to make data-driven decisions.
              </p>
              <div className="flex gap-4">
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link href="#features" className="btn-secondary">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="AI Monitoring Dashboard" 
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
          
          <section id="features" className="py-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Monitoring Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Mobile Detection", desc: "Identify unauthorized mobile phone usage in restricted areas" },
                { title: "Presence Detection", desc: "Monitor workspace occupancy and attendance automatically" },
                { title: "Sleepiness Detection", desc: "Ensure alertness in critical safety environments" },
                { title: "Smoking Detection", desc: "Enforce no-smoking policies in designated areas" },
                { title: "Weapons Detection", desc: "Enhanced security with immediate threat alerts" },
                { title: "Eating Detection", desc: "Ensure compliance with food safety regulations" },
                { title: "Loitering Detection", desc: "Identify unusual lingering in secure areas" },
                { title: "Altercations Detection", desc: "Improve workplace safety with conflict alerts" }
              ].map((feature, index) => (
                <div key={index} className="card hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-primary">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="py-16 bg-muted rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-secondary mb-4">99%</div>
                <p className="text-gray-700">Detection Accuracy</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-secondary mb-4">24/7</div>
                <p className="text-gray-700">Real-time Monitoring</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-secondary mb-4">GDPR</div>
                <p className="text-gray-700">Privacy Compliant</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="mt-20 pt-10 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">InsightGuardian</h3>
              <p className="text-gray-600">Advanced workplace monitoring powered by AI and computer vision.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Support</li>
                <li>Sales</li>
                <li>Demo Request</li>
                <li>Partner Program</li>
              </ul>
            </div>
          </div>
          <div className="text-center py-6 border-t border-gray-200 text-gray-600">
            &copy; {new Date().getFullYear()} InsightGuardian. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
