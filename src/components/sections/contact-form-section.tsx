"use client";

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContactForm, type ContactFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }),
});

type ContactFormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </>
      )}
    </Button>
  );
}

export function ContactFormSection() {
  const { toast } = useToast();
  
  const initialState: ContactFormState = { message: "", status: null };
  const [state, formAction] = useFormState(submitContactForm, initialState);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
  
  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Message Sent!",
        description: state.message,
      });
      form.reset(); 
    } else if (state.status === "error") {
      toast({
        title: "Error",
        description: state.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Populate form errors if available
      if (state.errors) {
        (Object.keys(state.errors) as Array<keyof ContactFormValues>).forEach((key) => {
          const fieldErrors = state.errors![key];
          if (fieldErrors && fieldErrors.length > 0) {
             form.setError(key, { type: 'server', message: fieldErrors[0] });
          }
        });
      }
    }
  }, [state, toast, form]);


  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Have questions or ready to start your fitness journey? Contact us today!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-lg shadow-xl overflow-hidden order-last md:order-first">
            <Image
              src="https://placehold.co/600x450.png"
              alt="Contact Fitnex Commandos"
              layout="fill"
              objectFit="cover"
              data-ai-hint="gym interior"
            />
          </div>
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>We&apos;ll respond to your inquiry as soon as possible.</CardDescription>
            </CardHeader>
            <Form {...form}>
              {/* We use formAction directly from useFormState for progressive enhancement */}
              <form action={formAction} className="space-y-6">
                <CardContent>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.name?.message || state.errors?.name?.[0]}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                         <FormMessage>{form.formState.errors.email?.message || state.errors?.email?.[0]}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can we help you?" {...field} rows={5} />
                        </FormControl>
                         <FormMessage>{form.formState.errors.message?.message || state.errors?.message?.[0]}</FormMessage>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <SubmitButton />
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </section>
  );
}
