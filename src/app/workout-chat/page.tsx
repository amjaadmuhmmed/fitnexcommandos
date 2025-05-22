
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateWorkoutPlan, type GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, User, Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function WorkoutChatContent() {
  const searchParams = useSearchParams();
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [initialMessage, setInitialMessage] = useState<{ fitnessGoals: string; currentFitnessLevel: string; availableTime: string } | null>(null);

  useEffect(() => {
    const fitnessGoals = searchParams.get('fitnessGoals');
    const currentFitnessLevel = searchParams.get('currentFitnessLevel');
    const availableTime = searchParams.get('availableTime');

    if (fitnessGoals && currentFitnessLevel && availableTime) {
      setInitialMessage({ fitnessGoals, currentFitnessLevel, availableTime });
      const input: GenerateWorkoutPlanInput = {
        fitnessGoals,
        currentFitnessLevel,
        availableTime,
      };
      setIsLoading(true);
      generateWorkoutPlan(input)
        .then(result => {
          setWorkoutPlan(result.workoutPlan);
          setError(null);
        })
        .catch(err => {
          console.error("Error generating workout plan on chat page:", err);
          setError("Failed to generate workout plan. The AI might be busy or an unexpected error occurred. Please try again later or go back and adjust your inputs.");
          setWorkoutPlan(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("Missing workout parameters. Please go back and fill out the form to generate a plan.");
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-8rem)]"> {/* Adjust min-height as needed */}
      <Card className="w-full max-w-3xl shadow-xl rounded-lg">
        <CardHeader className="text-center border-b pb-4">
          <Sparkles className="h-10 w-10 text-accent mx-auto mb-3" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Your AI Workout Chat</CardTitle>
          <CardDescription className="text-muted-foreground">
            Here's your personalized workout plan from our AI Trainer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6 max-h-[calc(100vh-20rem)] overflow-y-auto">
          {initialMessage && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10 border-2 border-primary shrink-0">
                <AvatarFallback><User size={20} /></AvatarFallback>
              </Avatar>
              <div className="bg-secondary p-3 rounded-lg shadow-sm flex-grow max-w-[calc(100%-3.5rem)]">
                <p className="text-sm font-semibold text-secondary-foreground mb-1">Your Request:</p>
                <p className="text-sm text-muted-foreground break-words">
                  <strong>Goals:</strong> {initialMessage.fitnessGoals}<br />
                  <strong>Level:</strong> {initialMessage.currentFitnessLevel}<br />
                  <strong>Time:</strong> {initialMessage.availableTime}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10 border-2 border-accent shrink-0">
                 <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="bg-primary/10 p-3 rounded-lg shadow-sm w-full flex-grow max-w-[calc(100%-3.5rem)]">
                <p className="text-sm font-semibold text-primary mb-2">AI Trainer is preparing your plan...</p>
                <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
                <Skeleton className="h-4 w-full mb-2 bg-muted" />
                <Skeleton className="h-4 w-full mb-2 bg-muted" />
                <Skeleton className="h-4 w-5/6 bg-muted" />
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-start space-x-3">
               <Avatar className="h-10 w-10 border-2 border-destructive shrink-0">
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="bg-destructive/10 p-3 rounded-lg shadow-sm flex-grow max-w-[calc(100%-3.5rem)]">
                <p className="text-sm font-semibold text-destructive mb-1">Oops!</p>
                <p className="text-sm text-destructive-foreground break-words">{error}</p>
                 <Button variant="link" asChild className="mt-2 p-0 h-auto text-destructive hover:text-destructive/80">
                    <Link href="/#workout-ai">Try Again</Link>
                  </Button>
              </div>
            </div>
          )}

          {workoutPlan && !isLoading && !error && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10 border-2 border-accent shrink-0">
                <AvatarImage src="https://placehold.co/100x100.png" alt="AI Trainer" data-ai-hint="robot assistant" />
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="bg-primary/10 p-4 rounded-lg shadow-sm flex-grow max-w-[calc(100%-3.5rem)]">
                <p className="text-sm font-semibold text-primary mb-2">AI Trainer says:</p>
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans bg-transparent p-0 overflow-x-auto">
                  {workoutPlan}
                </pre>
              </div>
            </div>
          )}
           {!isLoading && (
             <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                    <Link href="/#workout-ai">Create a New Plan</Link>
                </Button>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

// Fallback component for Suspense
function WorkoutChatLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-3xl shadow-xl rounded-lg">
        <CardHeader className="text-center border-b pb-4">
           <Skeleton className="h-10 w-10 rounded-full mx-auto mb-3 bg-muted" />
           <Skeleton className="h-7 w-1/2 mx-auto mb-2 bg-muted" />
           <Skeleton className="h-4 w-3/4 mx-auto bg-muted" />
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
          {/* User message skeleton */}
          <div className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-muted" />
            <div className="bg-secondary p-3 rounded-lg shadow-sm w-full flex-grow max-w-[calc(100%-3.5rem)]">
              <Skeleton className="h-4 w-1/4 mb-2 bg-muted" />
              <Skeleton className="h-3 w-3/4 mb-1 bg-muted" />
              <Skeleton className="h-3 w-1/2 mb-1 bg-muted" />
              <Skeleton className="h-3 w-2/3 bg-muted" />
            </div>
          </div>
          {/* AI message skeleton */}
          <div className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-muted" />
            <div className="bg-primary/10 p-3 rounded-lg shadow-sm w-full flex-grow max-w-[calc(100%-3.5rem)]">
              <Skeleton className="h-4 w-1/3 mb-2 bg-muted" />
              <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
              <Skeleton className="h-4 w-full mb-2 bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
            </div>
          </div>
           <div className="mt-6 text-center">
             <Skeleton className="h-10 w-40 mx-auto bg-muted" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WorkoutChatPage() {
  // Suspense is required by Next.js for pages that use useSearchParams in a Client Component.
  return (
    <Suspense fallback={<WorkoutChatLoadingSkeleton />}>
      <WorkoutChatContent />
    </Suspense>
  );
}
