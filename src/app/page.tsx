import { HeroSection } from '../components/sections/hero-section';
import { ProgramShowcase } from '../components/sections/program-showcase';
import { TestimonialsSection } from '../components/sections/testimonials-section';
import { WorkoutPlanGeneratorSection } from '../components/sections/workout-plan-generator-section';
import { BlogSection } from '../components/sections/blog-section';
import { ContactFormSection } from '../components/sections/contact-form-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProgramShowcase />
      <TestimonialsSection />
      <WorkoutPlanGeneratorSection />
      <BlogSection />
      <ContactFormSection />
    </>
  );
}
