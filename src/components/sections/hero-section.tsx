import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="hero" className="relative py-20 md:py-32 bg-gradient-to-br from-background to-secondary/50 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary rounded-full filter blur-3xl animate-pulse"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Transform Your <span className="text-accent">Body</span>,
              <br />
              Elevate Your <span className="text-primary">Life</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
              Welcome to Fitnex Commandos, your ultimate partner in achieving your fitness dreams. Discover personalized programs, expert guidance, and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                <Link href="#programs">Explore Programs</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 shadow-lg transition-transform hover:scale-105">
                <Link href="#workout-ai">Get AI Plan</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video rounded-lg shadow-2xl overflow-hidden group">
             <Image
              src="https://hostedimages-cdn.aweber-static.com/OTE=/original/01e5b4748bad4b879f3d2733428094e4.jpeg"
              alt="Fitness motivation"
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              data-ai-hint="fitness workout"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
