
"use client";

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateWorkoutPlan, type GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, User, Bot, Send, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  sender: 'user' | 'ai' | 'systemError';
  text: string;
  isLoading?: boolean;
  meta?: {
    fitnessGoals?: string;
    currentFitnessLevel?: string;
    availableTime?: string;
  };
};

function WorkoutChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState(false);
  const [initialParams, setInitialParams] = useState<GenerateWorkoutPlanInput | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fitnessGoals = searchParams.get('fitnessGoals');
    const currentFitnessLevel = searchParams.get('currentFitnessLevel');
    const availableTime = searchParams.get('availableTime');

    if (fitnessGoals && currentFitnessLevel && availableTime) {
      const params = { fitnessGoals, currentFitnessLevel, availableTime };
      setInitialParams(params);
      
      const userMessageId = `user-${Date.now()}`;
      const aiLoadingMessageId = `ai-loading-${Date.now() + 1}`;

      setMessages([
        {
          id: userMessageId,
          sender: 'user',
          text: `My details:\nGoals: ${fitnessGoals}\nLevel: ${currentFitnessLevel}\nTime: ${availableTime}`,
          meta: params,
        },
        {
          id: aiLoadingMessageId,
          sender: 'ai',
          text: 'Generating your initial workout plan...',
          isLoading: true,
        },
      ]);

      generateWorkoutPlan(params)
        .then(result => {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === aiLoadingMessageId
                ? { ...msg, text: result.workoutPlan, isLoading: false }
                : msg
            )
          );
        })
        .catch(err => {
          console.error("Error generating initial workout plan:", err);
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === aiLoadingMessageId
                ? {
                    id: `error-${Date.now()}`,
                    sender: 'systemError',
                    text: "Failed to generate workout plan. The AI might be busy or an unexpected error occurred. Please try again later or go back and adjust your inputs.",
                    isLoading: false,
                  }
                : msg
            )
          );
        });
    } else {
      setMessages([
        {
          id: `error-missing-params-${Date.now()}`,
          sender: 'systemError',
          text: "Missing workout parameters. Please go back and fill out the form to generate a plan.",
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only run once on initial load based on searchParams

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoadingFollowUp || !initialParams) return;

    const userMessageText = newMessage.trim();
    setNewMessage('');
    setIsLoadingFollowUp(true);

    const userMessageId = `user-${Date.now()}`;
    const aiFollowUpLoadingMessageId = `ai-loading-${Date.now() + 1}`;

    setMessages(prevMessages => [
      ...prevMessages,
      { id: userMessageId, sender: 'user', text: userMessageText },
      { id: aiFollowUpLoadingMessageId, sender: 'ai', text: 'Thinking...', isLoading: true },
    ]);

    try {
      // For follow-up, we use the new message as "fitnessGoals" and reuse other initial params.
      // This is a simplification; a true chat AI would take conversation history.
      const followUpInput: GenerateWorkoutPlanInput = {
        fitnessGoals: userMessageText, // User's new query
        currentFitnessLevel: initialParams.currentFitnessLevel,
        availableTime: initialParams.availableTime,
      };
      const result = await generateWorkoutPlan(followUpInput);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiFollowUpLoadingMessageId
            ? { ...msg, text: result.workoutPlan, isLoading: false }
            : msg
        )
      );
    } catch (err) {
      console.error("Error generating follow-up plan:", err);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiFollowUpLoadingMessageId
            ? {
                id: `error-follow-up-${Date.now()}`,
                sender: 'systemError',
                text: "Sorry, I couldn't process that. Please try rephrasing or ask something else.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoadingFollowUp(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center flex-1 min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-3xl shadow-xl rounded-lg flex flex-col flex-1">
        <CardHeader className="text-center border-b pb-4">
          <Sparkles className="h-10 w-10 text-accent mx-auto mb-3" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Your AI Workout Chat</CardTitle>
          <CardDescription className="text-muted-foreground">
            Chat with our AI Trainer about your workout plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6 flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start space-x-3",
                msg.sender === 'user' ? "justify-end" : ""
              )}
            >
              {msg.sender !== 'user' && (
                 <Avatar className="h-10 w-10 border-2 border-accent shrink-0">
                   {msg.sender === 'ai' && !msg.isLoading && <AvatarImage src="https://placehold.co/100x100.png" alt="AI Trainer" data-ai-hint="robot assistant" />}
                   <AvatarFallback>
                     {msg.sender === 'ai' && <Bot size={20} />}
                     {msg.sender === 'systemError' && <AlertCircle size={20} className="text-destructive" />}
                   </AvatarFallback>
                 </Avatar>
              )}
              <div
                className={cn(
                  "p-3 rounded-lg shadow-sm max-w-[calc(100%-3.5rem)] break-words",
                  msg.sender === 'user' ? "bg-primary text-primary-foreground" :
                  msg.sender === 'ai' ? "bg-secondary text-secondary-foreground" :
                  "bg-destructive/10 text-destructive-foreground" 
                )}
              >
                {msg.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-muted-foreground/30" />
                    <Skeleton className="h-4 w-full bg-muted-foreground/30" />
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-sans bg-transparent p-0 overflow-x-auto">
                    {msg.text}
                  </pre>
                )}
              </div>
              {msg.sender === 'user' && (
                <Avatar className="h-10 w-10 border-2 border-primary shrink-0">
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full items-start space-x-2">
            <Textarea
              placeholder="Ask a follow-up question or request a modification..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={2}
              className="flex-1 resize-none"
              disabled={isLoadingFollowUp || !initialParams}
            />
            <Button type="submit" size="icon" disabled={isLoadingFollowUp || !newMessage.trim() || !initialParams}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
         <div className="text-center bg-background py-4 border-t">
            <Button variant="outline" asChild>
                <Link href="/#workout-ai">Create a New Plan</Link>
            </Button>
        </div>
      </Card>
    </div>
  );
}

function WorkoutChatLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center flex-1 min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-3xl shadow-xl rounded-lg flex flex-col flex-1">
        <CardHeader className="text-center border-b pb-4">
           <Skeleton className="h-10 w-10 rounded-full mx-auto mb-3 bg-muted" />
           <Skeleton className="h-7 w-1/2 mx-auto mb-2 bg-muted" />
           <Skeleton className="h-4 w-3/4 mx-auto bg-muted" />
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6 flex-1 overflow-y-auto">
          {/* User message skeleton */}
          <div className="flex items-start space-x-3 justify-end">
             <div className="bg-primary/50 p-3 rounded-lg shadow-sm w-3/5">
              <Skeleton className="h-3 w-3/4 mb-1 bg-primary-foreground/30" />
              <Skeleton className="h-3 w-1/2 mb-1 bg-primary-foreground/30" />
              <Skeleton className="h-3 w-2/3 bg-primary-foreground/30" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-muted" />
          </div>
          {/* AI message skeleton */}
          <div className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-muted" />
            <div className="bg-secondary/50 p-3 rounded-lg shadow-sm w-full flex-grow max-w-[calc(100%-3.5rem)]">
              <Skeleton className="h-4 w-1/3 mb-2 bg-muted-foreground/30" />
              <Skeleton className="h-4 w-3/4 mb-2 bg-muted-foreground/30" />
              <Skeleton className="h-4 w-full mb-2 bg-muted-foreground/30" />
              <Skeleton className="h-4 w-5/6 bg-muted-foreground/30" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
           <Skeleton className="h-10 w-full bg-muted" /> {/* Input area skeleton */}
        </CardFooter>
         <div className="text-center bg-background py-4 border-t">
            <Skeleton className="h-10 w-40 mx-auto bg-muted" />
        </div>
      </Card>
    </div>
  );
}

export default function WorkoutChatPage() {
  return (
    <Suspense fallback={<WorkoutChatLoadingSkeleton />}>
      <WorkoutChatContent />
    </Suspense>
  );
}

    