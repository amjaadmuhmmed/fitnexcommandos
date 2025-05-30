
// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview Workout plan generator and conversational AI trainer.
 *
 * - generateWorkoutPlan - A function that handles workout plan generation and follow-up conversation.
 * - GenerateWorkoutPlanInput - The input type for the workout plan generation/conversation.
 * - GenerateWorkoutPlanOutput - The return type for the workout plan generation/conversation.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const ConversationMessageSchema = z.object({
  sender: z.enum(['user', 'ai', 'systemError']).describe("The sender of the message, either 'user', 'ai', or 'systemError'."),
  text: z.string().describe("The text content of the message.")
});

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The initial fitness goals of the user, e.g. lose weight, build muscle, improve endurance.'),
  currentFitnessLevel: z
    .string()
    .describe('The current fitness level of the user, e.g. beginner, intermediate, advanced.'),
  availableTime: z
    .string()
    .describe('The amount of time the user has available for workouts per week, e.g. 30 minutes 3 times a week.'),
  conversationHistory: z.array(ConversationMessageSchema).optional().describe("The history of the conversation so far. The last message is the user's most recent query if present."),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The personalized workout plan or conversational response from the AI trainer.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a helpful and knowledgeable AI Personal Trainer.

User's Initial Details:
- Fitness Goals: {{{fitnessGoals}}}
- Current Fitness Level: {{{currentFitnessLevel}}}
- Available Time: {{{availableTime}}}

{{#if conversationHistory.length}}
You are in an ongoing conversation. Here is the history (most recent message is last, ignore systemError messages):
{{#each conversationHistory}}
{{#unless (eq this.sender "systemError")}}
{{this.sender}}: {{{this.text}}}
{{/unless}}
{{/each}}

Please provide a helpful and relevant response to the user's LATEST message in the history above.
Consider the entire conversation and the user's initial details.
- If the user asks to modify the plan, provide the modified plan or explain the changes.
- If the user asks a question, answer it clearly.
- Be conversational and directly address the user's latest query.
- Avoid generating a completely new plan from scratch unless the user explicitly asks for a brand new plan based on new goals.
{{else}}
This is the first interaction.
Generate a personalized and comprehensive workout plan based on the user's Initial Details.
Structure the plan clearly (e.g., by day, by exercise type, with specific exercises, sets, and reps if possible).
{{/if}}

Your AI Response:`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    // Filter out systemError messages from history before sending to prompt for cleaner context
    const cleanConversationHistory = input.conversationHistory?.filter(
      (msg) => msg.sender !== 'systemError'
    );

    const {output} = await prompt({
        ...input,
        conversationHistory: cleanConversationHistory,
    });
    return output!;
  }
);

