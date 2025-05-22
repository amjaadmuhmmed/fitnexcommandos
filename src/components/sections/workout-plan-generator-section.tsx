"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// GenerateWorkoutPlanInput type is still useful for form values.
import type { GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
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

type WorkoutFormValues = z.infer<typeof formSchema>; // This is equivalent to GenerateWorkoutPlanInput

export function WorkoutPlanGeneratorSection() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); 

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

    try {
      const queryParams = new URLSearchParams({
        fitnessGoals: data.fitnessGoals,
        currentFitnessLevel: data.currentFitnessLevel,
        availableTime: data.availableTime,
      }).toString();
      
      router.push(`/workout-chat?${queryParams}`);
      // A toast here could say "Redirecting to chat..." but it might be too quick.
      // Success/error of plan generation will be handled on the chat page.
    } catch (error) {
      console.error("Error redirecting to chat page:", error);
      toast({
        title: "Error",
        description: "Failed to navigate to the workout planner. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false); 
    }
    // No need to setIsLoading(false) here as the component will unmount on successful navigation.
  };

  return (
    <section id="workout-ai" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">AI Powered Workout Planner</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Fill in your details, and our AI will generate a personalized workout plan for you on our chat page.
          </p>
        </div>

        <div className="max-w-lg mx-auto"> {/* Centering the form card */}
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
                        Processing...
                      </>
                    ) : (
                       <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Plan & Chat
                       </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </section>
  );
}
