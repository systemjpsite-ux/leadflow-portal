'use client';

import { registerLead, type RegisterLeadResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  HeartHandshake,
  HeartPulse,
  Languages,
  Mail,
  User,
  UserCheck,
} from 'lucide-react';
import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  );
}

export function LeadIntakeForm() {
  const initialState: RegisterLeadResult = { success: false, fieldErrors: {} };
  const [state, formAction] = useActionState(registerLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="w-full max-w-2xl shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">LeadFlow Portal</CardTitle>
        <CardDescription className="pt-2">
          Register a new lead by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success && state.message && (
          <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.message && !state.success && (
           <Alert variant="destructive" className="mb-4">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{state.message}</AlertDescription>
           </Alert>
        )}
        <form
          ref={formRef}
          action={formAction}
          className="space-y-6"
          noValidate
          autoComplete="off"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="e.g., Jane Doe"
                className="pl-10"
                autoComplete="off"
              />
            </div>
            {state.fieldErrors?.name && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., jane.doe@example.com"
                className="pl-10"
                autoComplete="off"
              />
            </div>
            {state.fieldErrors?.email && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.email}</p>}
          </div>

          <div className="space-y-3">
            <Label>Niche</Label>
            <RadioGroup
              name="niche"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              defaultValue="Health"
            >
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Health" id="health" />
                <Label
                  htmlFor="health"
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <HeartPulse className="h-5 w-5" /> Health
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Wealth" id="wealth" />
                <Label
                  htmlFor="wealth"
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <DollarSign className="h-5 w-5" /> Wealth
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Relationships" id="love" />
                <Label
                  htmlFor="love"
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <HeartHandshake className="h-5 w-5" /> Relationships
                </Label>
              </div>
            </RadioGroup>
             {state.fieldErrors?.niche && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.niche}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <div className="relative flex items-center">
                <Languages className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="language"
                  name="language"
                  placeholder="e.g., English, Japanese"
                  className="pl-10"
                />
              </div>
               {state.fieldErrors?.language && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.language}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentOrigin">Agent Origin</Label>
              <Select name="agentOrigin">
                <SelectTrigger className="pl-10">
                  <UserCheck className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health Sales Agent">
                    Health Sales Agent
                  </SelectItem>
                  <SelectItem value="Wealth Sales Agent">
                    Wealth Sales Agent
                  </SelectItem>
                  <SelectItem value="Love Sales Agent">Love Sales Agent</SelectItem>
                </SelectContent>
              </Select>
               {state.fieldErrors?.agentOrigin && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.agentOrigin}</p>}
            </div>
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
