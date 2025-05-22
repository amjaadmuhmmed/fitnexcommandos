"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateWorkoutPlan, type GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  fitnessGoals: z.string().min(10, { message: "Please describe your fitness goals in at least 10 characters." }),
  currentFitnessLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your current fitness level."
  }),
  availableTime: z.string().min(5, { message: "Please specify your available time, e.g., '30 mins, 3x a week'." }),
});

type WorkoutFormValues = z.infer<typeof formSchema>;

export function WorkoutPlanGeneratorSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessGoals: '',
      currentFitnessLevel: undefined,
      availableTime: '',
    },
  });

  const onSubmit: SubmitHandler<WorkoutFormValues> = async (data) => {
    setIsLoading(true);
    setWorkoutPlan(null);
    try {
      const result = await generateWorkoutPlan(data as GenerateWorkoutPlanInput); // Type assertion if schema is identical
      setWorkoutPlan(result.workoutPlan);
      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized workout plan is ready below.",
      });
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="workout-ai" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">AI Powered Workout Planner</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Get a personalized workout plan tailored to your goals, fitness level, and available time using our smart AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle>Create Your Plan</CardTitle>
              <CardDescription>Fill in your details to generate a custom workout plan.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fitnessGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fitness Goals</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Lose weight, build muscle, improve endurance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentFitnessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Fitness Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your fitness level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 30 minutes, 3 times a week" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                       <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Plan
                       </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          {isLoading && (
            <Card className="shadow-lg rounded-lg animate-pulse">
              <CardHeader>
                <CardTitle>Your Personalized Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          )}

          {workoutPlan && !isLoading && (
            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle>Your Personalized Plan</CardTitle>
                <CardDescription>Here is your AI-generated workout routine:</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-secondary/50 p-4 rounded-md font-sans">{workoutPlan}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
