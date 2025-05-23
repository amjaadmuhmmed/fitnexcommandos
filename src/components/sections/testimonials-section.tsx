"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Testimonial } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    quote: "This program completely transformed my approach to fitness. I've never felt stronger or healthier!",
    name: 'Sarah L.',
    role: 'Marketing Manager',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
  },
  {
    id: '2',
    quote: 'The trainers are incredibly knowledgeable and supportive. Fitnex Commandos helped me achieve goals I never thought possible.',
    name: 'Mike P.',
    role: 'Software Engineer',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
  },
  {
    id: '3',
    quote: "I love the variety of programs offered. There's always something new to challenge me and keep me motivated.",
    name: 'Jessica B.',
    role: 'Graphic Designer',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'person smiling',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
  };
  
  // Auto-slide effect
  useEffect(() => {
    if (!isClient) return; // Only run auto-slide on client
    const timer = setTimeout(() => {
      nextTestimonial();
    }, 5000); // Change testimonial every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, isClient]);


  if (!isClient) {
    // Render a placeholder or the first testimonial statically for SSR/prerender
    const testimonial = testimonialsData[0];
    return (
      <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Client Success Stories</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Hear from our satisfied clients who have transformed their lives with Fitnex Commandos.
            </p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <Card className="shadow-xl rounded-lg overflow-hidden">
              <CardContent className="p-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-accent">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-foreground italic mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <h3 className="text-xl font-semibold text-primary">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }
  
  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Client Success Stories</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Hear from our satisfied clients who have transformed their lives with Fitnex Commandos.
          </p>
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="overflow-hidden relative h-[420px] sm:h-[380px]"> {/* Fixed height for consistent layout */}
            {testimonialsData.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500 ease-in-out",
                  index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <Card className="shadow-xl rounded-lg h-full flex flex-col justify-center">
                  <CardContent className="p-8 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-accent">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div className="flex justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    <p className="text-md md:text-lg text-foreground italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                    <h3 className="text-xl font-semibold text-primary">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevTestimonial} 
            className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-16 transform bg-background/80 hover:bg-background shadow-md rounded-full"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextTestimonial} 
            className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-16 transform bg-background/80 hover:bg-background shadow-md rounded-full"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  currentIndex === index ? "bg-primary" : "bg-muted hover:bg-primary/50"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
