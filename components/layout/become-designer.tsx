import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function BecomeDesigner() {
  return (
    <section className="py-20 bg-emerald-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Are You a Creative Designer?
            </h2>
            <p className="text-lg text-emerald-100 mb-8">
              Join our community of talented artists and makers. Accept upcycling projects, 
              showcase your creativity, and earn money while helping others give their items new life.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Accept custom upcycling projects</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Build your portfolio</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Connect with eco-conscious customers</span>
              </li>
            </ul>
            <Link href="/designers/signup">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50">
                Apply as Designer
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">500+</div>
                <div className="text-xl text-emerald-200">Active Designers</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-xl p-4 shadow-lg">
              <div className="text-3xl font-bold text-emerald-600">$2.5M+</div>
              <div className="text-sm text-gray-600">Earned by designers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
