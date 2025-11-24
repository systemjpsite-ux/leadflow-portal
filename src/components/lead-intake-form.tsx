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
import { useEffect, useRef, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';

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
  const [niche, setNiche] = useState<string | undefined>();
  const [agentOrigin, setAgentOrigin] = useState<string | undefined>();

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setNiche(undefined);
      setAgentOrigin(undefined);
    }
  }, [state]);

  const agentOriginOptions = [
    { value: 'health', label: 'Vendedor de Saúde' },
    { value: 'wealth', label: 'Vendedor de Dinheiro' },
    { value: 'relationships', label: 'Vendedor de Relacionamento' },
  ];

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
          <Alert
            variant="default"
            className="mb-4 bg-green-100 border-green-200 text-green-800"
          >
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.formError}</AlertDescription>
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
            {state.fieldErrors?.name && (
              <p className="text-red-500 text-sm mt-1">
                {state.fieldErrors.name}
              </p>
            )}
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
            {state.fieldErrors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {state.fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Niche</Label>
            <RadioGroup
              name="niche"
              onValueChange={setNiche}
              value={niche}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { value: 'Health', label: 'Health', icon: HeartPulse },
                { value: 'Wealth', label: 'Wealth', icon: DollarSign },
                {
                  value: 'Relationships',
                  label: 'Relationships',
                  icon: HeartHandshake,
                },
              ].map(({ value, label: nicheLabel, icon: Icon }) => (
                <Label
                  key={value}
                  htmlFor={value}
                  className={cn(
                    'flex flex-col items-center justify-center space-y-2 rounded-md border p-4 transition-colors hover:bg-accent/50 cursor-pointer',
                    niche === value
                      ? 'border-primary ring-2 ring-primary bg-accent/50'
                      : 'border-input'
                  )}
                >
                  <RadioGroupItem value={value} id={value} className="sr-only" />
                  <Icon className="h-8 w-8" />
                  <span className="font-normal">{nicheLabel}</span>
                </Label>
              ))}
            </RadioGroup>
            {state.fieldErrors?.niche && (
              <p className="text-red-500 text-sm mt-1">
                {state.fieldErrors.niche}
              </p>
            )}
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
              {state.fieldErrors?.language && (
                <p className="text-red-500 text-sm mt-1">
                  {state.fieldErrors.language}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentOrigin">Agent Origin</Label>
              <Select name="agentOrigin" onValueChange={setAgentOrigin} value={agentOrigin}>
                <SelectTrigger className="pl-10">
                  <UserCheck className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Selecione a origem do agente..." />
                </SelectTrigger>
                <SelectContent>
                  {agentOriginOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.fieldErrors?.agentOrigin && (
                <p className="text-red-500 text-sm mt-1">
                  {state.fieldErrors.agentOrigin}
                </p>
              )}
            </div>
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
