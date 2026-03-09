'use client';

import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl" />
        
        {/* Floating Shapes */}
        <svg className="absolute top-20 left-[10%] w-16 h-16 text-emerald-400/20 animate-bounce" style={{ animationDuration: '3s' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <svg className="absolute bottom-32 right-[15%] w-12 h-12 text-teal-400/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-emerald-100 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Sustainable Shopping Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Turn Old Things Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Something New
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12">
            The innovative marketplace to buy, sell, and creatively upcycle pre-loved products. 
            Give your old items a second life with custom designs from talented artists.
          </p>
          
          {/* CTA Buttons - Using native button elements */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={() => router.push('/marketplace')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
            >
              Explore Marketplace
            </button>
            <button
              type="button"
              onClick={() => router.push('/design-requests/new')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Start Upcycling
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-emerald-300">10K+</div>
              <div className="text-sm text-emerald-100/60">Items Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-emerald-300">500+</div>
              <div className="text-sm text-emerald-100/60">Designers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-emerald-300">50K+</div>
              <div className="text-sm text-emerald-100/60">Happy Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
