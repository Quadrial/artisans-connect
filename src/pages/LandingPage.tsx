import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon, 
  ShieldCheckIcon, 
  StarIcon,
  CheckCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (mobileMenuOpen && !target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <img 
                  src="/images/logo3.png" 
                  alt="CraftConnect Logo" 
                  className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 object-contain group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold flex">
                  <span className="text-purple-600">Craft</span>
                  <span className="text-green-500">Connect</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium">
                Home
              </Link>
              <Link to="/discover" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium">
                Explore Artisan
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium">
                Become an Artisan
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium">
                About
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link 
                to="/login" 
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-purple-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm lg:text-base font-medium shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600 focus:outline-none focus:text-purple-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-96 opacity-100 border-t border-gray-200' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <nav className="py-4 space-y-1">
              <Link 
                to="/" 
                className="block text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 px-3 py-3 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/discover" 
                className="block text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 px-3 py-3 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Artisan
              </Link>
              <Link 
                to="/register" 
                className="block text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 px-3 py-3 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become an Artisan
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 px-3 py-3 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-3 border-t border-gray-200 mt-4">
                <Link 
                  to="/login" 
                  className="block text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium transition-colors duration-200 px-3 py-3 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 px-4 py-3 rounded-lg text-center font-medium shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Find Trusted 
                <br />
                <span className="text-purple-600">Artisans near you</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Tailoring, Photography, Design, and more - all near you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/register" 
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
                >
                  Find Artisan
                </Link>
                <Link 
                  to="/register" 
                  className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium text-center"
                >
                  Become an Artisan
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img src="/images/artisan-1.svg" alt="Artisan" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="/images/artisan-2.svg" alt="Artisan" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="/images/artisan-3.svg" alt="Artisan" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="/images/artisan-4.svg" alt="Artisan" className="w-10 h-10 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Over 20,000+</p>
                  <p className="text-sm text-gray-600">trusted professionals</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/hero-artisans.svg" 
                alt="Trusted Student Artisans" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How CraftConnect Works</h2>
            <p className="text-xl text-gray-600">Find solution to your dream work all at once</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Artisan</h3>
              <p className="text-gray-600">Find the perfect student artisan based on skills, ratings and portfolio.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Booking Request</h3>
              <p className="text-gray-600">Choose a time and send your request with project details.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get your Service</h3>
              <p className="text-gray-600">Meet your artisan and receive your personalized service.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave a Review</h3>
              <p className="text-gray-600">Share your experience and help others find great artisans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artisans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured Artisans</h2>
            <Link to="/discover" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
              See all <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Amina Johnson",
                skill: "Professional hair stylist",
                rating: 5.0,
                price: "₦5,000",
                image: "/images/artisan-1.svg",
                verified: true,
                location: "UNILAG"
              },
              {
                name: "Antika Johnson", 
                skill: "Professional hair stylist",
                rating: 5.0,
                price: "₦5,000",
                image: "/images/artisan-2.svg",
                verified: true,
                location: "UNILAG"
              },
              {
                name: "Tunde Olatemi",
                skill: "Creative Photographer",
                rating: 5.0,
                price: "₦8,000",
                image: "/images/artisan-3.svg",
                verified: true,
                location: "LASU"
              },
              {
                name: "David Adewumi",
                skill: "Experienced Fashion designer",
                rating: 5.0,
                price: "₦12,000",
                image: "/images/artisan-4.svg",
                verified: true,
                location: "UNILAG"
              }
            ].map((artisan, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="relative mb-4">
                  <img src={artisan.image} alt={artisan.name} className="w-full h-32 object-cover rounded-lg" />
                  {artisan.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{artisan.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{artisan.skill}</p>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">{artisan.rating} (127)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-900">{artisan.price}</span>
                  <span className="text-sm text-gray-500">{artisan.location}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    View Profile
                  </button>
                  <button className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular by Category</h2>
            <p className="text-xl text-gray-600">Find solution to your dream work all at once</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: "Tailoring", count: "2k services", icon: "/images/icon-tailoring.svg" },
              { name: "Photography", count: "1.5k services", icon: "/images/icon-photography.svg" },
              { name: "Design", count: "3k services", icon: "/images/icon-design.svg" },
              { name: "Cooking", count: "800 services", icon: "/images/icon-cooking.svg" },
              { name: "Tailoring", count: "2k services", icon: "/images/icon-tailoring.svg" },
              { name: "Photography", count: "1.5k services", icon: "/images/icon-photography.svg" },
              { name: "Design", count: "3k services", icon: "/images/icon-design.svg" }
            ].map((category, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="bg-gray-50 group-hover:bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                  <img src={category.icon} alt={category.name} className="w-12 h-12" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose CraftConnect Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CraftConnect?</h2>
            <p className="text-xl text-gray-600">Find solution to your dream work all at once</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Artisans</h3>
              <p className="text-gray-600">All artisans must verify with a school ID or educational and before being listed and reviewed for services.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Messaging</h3>
              <p className="text-gray-600">CraftConnect directly connects you to discuss about your project.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Booking</h3>
              <p className="text-gray-600">Our secure payment protects your transaction and payments.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Built for Campus Life</h3>
              <p className="text-gray-600">Designed specifically for the student lifestyle and campus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Students & Clients Are Saying</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
              <span className="text-lg text-gray-600 ml-2">4.7 average from 100+ verified artisans and clients</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "UI/UX Student",
                content: "I got my birthday outfit made in just 3 days and it came out perfect. So glad I found Bisi on CraftConnect!",
                rating: 5,
                category: "Fashion"
              },
              {
                name: "Tunde Orekoye",
                role: "Business Student",
                content: "Before I had to ask friends for who to choose, but I much the reviews and just book!",
                rating: 5,
                category: "Design"
              },
              {
                name: "Jelly Akeju",
                role: "Law Student", 
                content: "I have booked 5 artisans on CraftConnect, each one showed up, delivered and were professional!",
                rating: 5,
                category: "Various"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Here's everything you need to know about Craftconnect</p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "How do I know these artisans are real and verified?",
                answer: "All artisans must verify with a school ID or educational and before being listed and reviewed for services."
              },
              {
                question: "Can I trust the quality of the work without meeting the artisan first?",
                answer: "Yes! All artisans have detailed portfolios, verified reviews, and ratings from previous clients. You can also message them directly before booking."
              },
              {
                question: "Can I cancel or reschedule a booking?",
                answer: "Yes, you can cancel or reschedule bookings according to our flexible cancellation policy. Check the specific terms when booking."
              },
              {
                question: "Is this platform only for students to hire students?",
                answer: "While designed for the student community, anyone can hire student artisans through our platform."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Are you a Student with a Skill? Get Discovered
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of Student Artisans already earning with their Skill on Craftconnect
          </p>
          <Link 
            to="/register" 
            className="bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            Create Artisan Profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-purple-400">Craft</span>
                  <span className="text-green-400">Connect</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting skilled student artisans with their dream clients.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/how-it-works" className="hover:text-white">How it Works</Link></li>
                <li><Link to="/safety" className="hover:text-white">Safety Center</Link></li>
                <li><Link to="/customer-service" className="hover:text-white">Customer Services</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Artisans</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/join-artisan" className="hover:text-white">Join as Artisan</Link></li>
                <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link to="/success-stories" className="hover:text-white">Success Stories</Link></li>
                <li><Link to="/community" className="hover:text-white">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Support@craftconnect.com</li>
                <li>+234 800 1234 567</li>
                <li>University of Lagos, Akoka,</li>
                <li>Lagos State, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Craftconnect. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;