
import Image from 'next/image';
import type { Program } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, HeartPulse, Brain, Zap } from 'lucide-react'; // Zap for HIIT or Energy

const programs: Program[] = [
  {
    id: '1',
    title: 'Full Body Blast',
    description: 'A comprehensive workout targeting all major muscle groups for balanced strength and conditioning.',
    image: 'https://fitnexcommandos.s3.eu-north-1.amazonaws.com/fitnexcommandos/Full-body-blast.png', // Updated to HTTPS S3 URL
    icon: HeartPulse,
    dataAiHint: 'running cardio',
  },
  {
    id: '2',
    title: 'Strength & Sculpt',
    description: 'Focus on building lean muscle and toning your physique with targeted resistance training.',
    image: 'https://fitnexcommandos.s3.eu-north-1.amazonaws.com/fitnexcommandos/stregth-and-sculpt.png',
    icon: Dumbbell,
    dataAiHint: 'weightlifting strength',
  },
  {
    id: '3',
    title: 'Yoga & Mindfulness',
    description: 'Enhance flexibility, balance, and mental clarity through guided yoga and meditation practices.',
    image: 'https://fitnexcommandos.s3.eu-north-1.amazonaws.com/fitnexcommandos/Yoga-and-mindfulness.png',
    icon: Brain,
    dataAiHint: 'yoga meditation',
  },
  {
    id: '4',
    title: 'HIIT & Power',
    description: 'High-intensity interval training to maximize fat burn and boost metabolic rate effectively.',
    image: 'https://fitnexcommandos.s3.eu-north-1.amazonaws.com/fitnexcommandos/HIIT-and-power.png', // Uses local image from public folder
    icon: Zap,
    dataAiHint: 'HIIT fitness',
  },
];

export function ProgramShowcase() {
  return (
    <section id="programs" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Fitness Programs</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Choose from a variety of programs designed to meet your specific fitness goals and preferences.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
              <CardHeader className="p-0 relative">
                <Image
                  src={program.image}
                  alt={program.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                  data-ai-hint={program.dataAiHint}
                />
                <div className="absolute top-4 right-4 bg-accent p-2 rounded-full text-accent-foreground">
                  <program.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="text-xl font-semibold mb-2 text-primary">{program.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  {program.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
