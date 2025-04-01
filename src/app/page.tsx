import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  
  const featuresRef = useScrollAnimation(0.2);
  const ctaRef = useScrollAnimation(0.2);

  const features = [
    {
      title: 'Transaction Management',
      description: 'Track income and expenses with detailed categorization and real-time updates.',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      tooltip: 'Track every penny with our intuitive transaction management system. Categorize expenses, set budgets, and get real-time updates on your financial status.'
    },
    {
      title: 'Financial Analytics',
      description: 'Get insights into your spending patterns with beautiful charts and reports.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      tooltip: 'Visualize your financial data with interactive charts and detailed reports. Make data-driven decisions with our comprehensive analytics tools.'
    },
    {
      title: 'Secure & Private',
      description: 'Your financial data is protected with enterprise-grade security measures.',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      tooltip: 'Rest easy knowing your financial data is protected with bank-level security. We use encryption and follow industry best practices to keep your information safe.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-gradient" />
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Manage Your Finances with{' '}
              <span className="text-blue-600 relative inline-block">
                Ease
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in-up">
              Cashflow helps you track expenses, analyze spending patterns, and make informed financial decisions.
            </p>
            <div className="flex gap-4 justify-center animate-fade-in-up">
              <Link
                href="/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 opacity-0 translate-y-4 animate-in:opacity-100 animate-in:translate-y-0 transition-all duration-700">
            Powerful Features for Your Financial Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative opacity-0 translate-y-4 animate-in:opacity-100 animate-in:translate-y-0 transition-all duration-700"
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setActiveTooltip(index);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setActiveTooltip(null);
                }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <svg className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-blue-600'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                {/* Tooltip */}
                {activeTooltip === index && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg w-64 z-50 opacity-0 animate-in:opacity-100 transition-opacity duration-200">
                    <p className="text-sm">{feature.tooltip}</p>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 relative overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 opacity-0 translate-y-4 animate-in:opacity-100 animate-in:translate-y-0 transition-all duration-700">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto opacity-0 translate-y-4 animate-in:opacity-100 animate-in:translate-y-0 transition-all duration-700 delay-200">
            Join thousands of users who are already managing their finances smarter with Cashflow.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-lg opacity-0 translate-y-4 animate-in:opacity-100 animate-in:translate-y-0 transition-all duration-700 delay-300"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
