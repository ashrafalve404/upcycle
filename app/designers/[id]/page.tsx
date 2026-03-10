'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

interface Designer {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  projects: number;
  image: string;
  bio: string;
  location: string;
  skills: string[];
  hourlyRate: number;
  completedProjects: number;
  email: string;
}

const designersData: Designer[] = [
  { 
    id: 1, 
    name: 'Mike Chen', 
    specialty: 'Furniture Restoration', 
    rating: 4.9, 
    projects: 24, 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: 'Passionate upcycling designer with 5+ years of experience transforming vintage items into modern masterpieces. Specializing in furniture restoration and giving new life to old pieces.',
    location: 'Brooklyn, NY',
    skills: ['Furniture Restoration', 'Woodworking', 'Painting', 'Upholstery'],
    hourlyRate: 50,
    completedProjects: 24,
    email: 'mike@example.com'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    specialty: 'Leather Work', 
    rating: 4.8, 
    projects: 18, 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    bio: 'Expert leather craftsman creating unique bags, accessories, and furniture from reclaimed leather materials.',
    location: 'Austin, TX',
    skills: ['Leather Work', 'Bag Making', 'Accessories Design', 'Repair'],
    hourlyRate: 45,
    completedProjects: 18,
    email: 'sarah@example.com'
  },
  { 
    id: 3, 
    name: 'Emma Wilson', 
    specialty: 'Textile Design', 
    rating: 4.7, 
    projects: 12, 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    bio: 'Creative textile artist transforming old fabrics into beautiful home decor and fashion items.',
    location: 'Portland, OR',
    skills: ['Textile Design', 'Quilting', 'Embroidery', 'Upcycling'],
    hourlyRate: 40,
    completedProjects: 12,
    email: 'emma@example.com'
  },
  { 
    id: 4, 
    name: 'Alex Rivera', 
    specialty: 'Woodworking', 
    rating: 4.6, 
    projects: 8, 
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Skilled woodworker specializing in creating custom furniture and decorative items from reclaimed wood.',
    location: 'Denver, CO',
    skills: ['Woodworking', 'Furniture Making', 'Carving', 'Finishing'],
    hourlyRate: 55,
    completedProjects: 8,
    email: 'alex@example.com'
  },
];

export default function DesignerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, isAuthenticated } = useAuthStore();
  const designerId = parseInt(resolvedParams.id);
  const designer = designersData.find(d => d.id === designerId);

  if (!designer) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Designer Not Found</h1>
            <p className="text-gray-600 mt-2">The designer you are looking for does not exist.</p>
            <Link href="/designers">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                Browse Designers
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-500 h-32"></div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-20">
                      <Image 
                        src={designer.image} 
                        alt={designer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Designer Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{designer.name}</h1>
                        <p className="text-lg text-emerald-600 font-medium">{designer.specialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{designer.rating}</span>
                          <span className="text-gray-500">({designer.projects} projects)</span>
                        </div>
                        <p className="text-gray-500 mt-1">📍 {designer.location}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-3xl font-bold text-emerald-600">${designer.hourlyRate}</p>
                        <p className="text-gray-500">per hour</p>
                      </div>
                    </div>
                    
                    <p className="mt-6 text-gray-700 leading-relaxed">{designer.bio}</p>
                    
                    {/* Skills */}
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {designer.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{designer.completedProjects}</p>
                        <p className="text-sm text-gray-500">Projects</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{designer.rating}</p>
                        <p className="text-sm text-gray-500">Rating</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">5+</p>
                        <p className="text-sm text-gray-500">Years Exp.</p>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="mt-8 flex gap-4">
                      {isAuthenticated ? (
                        <Link href="/messages" className="flex-1">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Contact Designer
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/login" className="flex-1">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Login to Contact
                          </Button>
                        </Link>
                      )}
                      <Button variant="outline" className="flex-1">
                        Request Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Back Link */}
            <div className="mt-8 text-center">
              <Link href="/designers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                ← Back to All Designers
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
