import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShield, FiTrendingUp, FiUsers, FiStar, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../components/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                {/* Logo */}
                <img 
                  src="/images/logo3.png" 
                  alt="CraftConnect Logo" 
                  className="w-10 h-10 mr-3 object-contain"
                />
                <h1 className="text-2xl font-bold text-gray-900">CraftConnect</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 ">
              <Link to="/login">
                <Button variant="secondary" size="medium">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="medium">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Skilled Artisans</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bridge the gap between talented craftspeople and customers who value quality work. 
              Build trust, showcase skills, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="large" className="w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="large" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Solving Real Challenges
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand the struggles both artisans and customers face in today's marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Current Challenges</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <FiSearch className="text-red-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Discovery Problems</h4>
                    <p className="text-gray-600">Customers struggle to find reliable artisans, relying on word-of-mouth and limited local networks.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <FiShield className="text-red-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Trust & Quality Concerns</h4>
                    <p className="text-gray-600">No way to verify skills, see past work, or trust service providers before hiring.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-600 font-bold">$</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pricing & Payment Issues</h4>
                    <p className="text-gray-600">Inconsistent pricing, payment disputes, and lack of transparent transaction processes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <FiTrendingUp className="text-red-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Limited Growth Opportunities</h4>
                    <p className="text-gray-600">Talented artisans struggle to reach new customers beyond their immediate community.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Solutions</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiSearch className="text-green-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Smart Discovery</h4>
                    <p className="text-gray-600">Advanced search and matching system to connect customers with the right artisans for their needs.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiShield className="text-green-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Trust & Verification</h4>
                    <p className="text-gray-600">Portfolio showcases, customer reviews, and skill verification to build confidence.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiStar className="text-green-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Transparent Transactions</h4>
                    <p className="text-gray-600">Clear pricing, secure payments, and project tracking for peace of mind.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiTrendingUp className="text-green-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Business Growth Tools</h4>
                    <p className="text-gray-600">Digital tools to help artisans showcase work, manage clients, and expand their reach.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Both Sides
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're looking to hire or looking for work, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Customers</h3>
              <p className="text-gray-600 mb-6">Find the perfect artisan for your project with confidence</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Browse verified artisan profiles</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">View portfolios and customer reviews</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Get transparent pricing and quotes</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Track project progress in real-time</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Secure payment protection</span>
                </li>
              </ul>
            </div>

            {/* For Artisans */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <FiTrendingUp className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Artisans</h3>
              <p className="text-gray-600 mb-6">Showcase your skills and grow your business</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Create stunning portfolio showcases</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Reach customers beyond your local area</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Set your own rates and availability</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Build reputation through reviews</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Get paid securely and on time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of artisans and customers building better connections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="large" 
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50"
              >
                Join as Artisan
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="primary" 
                size="large" 
                className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 border-blue-700"
              >
                Find Artisans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/images/logo3.png" 
                alt="CraftConnect Logo" 
                className="w-8 h-8 mr-3 object-contain"
              />
              <span className="text-xl font-bold">CraftConnect</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 CraftConnect. Connecting artisans with opportunities.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
