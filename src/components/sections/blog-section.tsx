import Image from 'next/image';
import type { BlogPost } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Newspaper, Utensils, Bike } from 'lucide-react';

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Nutrition Myths Debunked',
    excerpt: 'Learn the truth about common nutrition misconceptions and how to eat smarter for your fitness goals.',
    image: 'https://placehold.co/400x250.png',
    slug: 'nutrition-myths',
    icon: Utensils,
    dataAiHint: 'healthy food',
  },
  {
    id: '2',
    title: 'Effective Home Workouts for Busy People',
    excerpt: 'No time for the gym? Discover quick and effective workout routines you can do from the comfort of your home.',
    image: 'https://placehold.co/400x250.png',
    slug: 'home-workouts',
    icon: Bike,
    dataAiHint: 'home exercise',
  },
  {
    id: '3',
    title: 'The Importance of Rest and Recovery',
    excerpt: "Understand why rest days are crucial for muscle growth, performance, and overall well-being.",
    image: 'https://placehold.co/400x250.png',
    slug: 'rest-recovery',
    icon: Newspaper, // Placeholder, could be Bed or Moon
    dataAiHint: 'relaxation sleep',
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Fitness & Nutrition Hub</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore our latest articles, tips, and guides to help you on your fitness journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
              <CardHeader className="p-0 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48"
                  data-ai-hint={post.dataAiHint}
                />
                <div className="absolute top-4 left-4 bg-primary p-2 rounded-full text-primary-foreground">
                  <post.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
                  <Link href={`/blog/${post.slug}`}>Read More &rarr;</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
