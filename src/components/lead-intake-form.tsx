'use client';

import { registerLead, type RegisterLeadState } from '@/app/actions';
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
  DollarSign,
  HeartHandshake,
  HeartPulse,
  Languages,
  Mail,
  User,
  Globe,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  );
}

const NicheOptions = [
  { value: 'Health', label: 'Health', icon: HeartPulse },
  { value: 'Wealth', label: 'Wealth', icon: DollarSign },
  { value: 'Relationships', label: 'Relationships', icon: HeartHandshake },
];

export function LeadIntakeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const [submissionState, setSubmissionState] = useState<RegisterLeadState | null>(null);
  const [niche, setNiche] = useState<string | undefined>();
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async (formData: FormData) => {
    const result = await registerLead(submissionState!, formData);
    
    setSubmissionState(result);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
        variant: 'default',
        className: 'bg-green-100 border-green-200 text-green-800'
      });
      // Reset form and state
      formRef.current?.reset();
      setNiche(undefined);
      setLanguage('');
      setCountry('');
      // Clear validation errors after a successful submission and reset
      setTimeout(() => setSubmissionState(null), 100); 
    } else {
       toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };


  return (
    <Card className="w-full max-w-2xl shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">LeadFlow Portal</CardTitle>
        <CardDescription className="pt-2">
          Register a new lead by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild variant="link">
            <Link href="/leads">View Leads Dashboard</Link>
          </Button>
        </div>
        
        {submissionState && !submissionState.success && submissionState.message && !submissionState.fieldErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submissionState.message}</AlertDescription>
          </Alert>
        )}

        <form
          ref={formRef}
          action={handleSubmit}
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
                required
              />
            </div>
            {submissionState?.fieldErrors?.name && (
              <p className="text-red-500 text-sm mt-1">
                {submissionState.fieldErrors.name}
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
                required
              />
            </div>
            {submissionState?.fieldErrors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {submissionState.fieldErrors.email}
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
              required
            >
              {NicheOptions.map(({ value, label: nicheLabel, icon: Icon }) => (
                <Label
                  key={value}
                  htmlFor={value}
                  className={cn(
                    'flex flex-col items-center justify-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ease-in-out',
                    'hover:bg-gray-100 dark:hover:bg-accent/50',
                    niche === value
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'border-input bg-transparent text-foreground'
                  )}
                >
                  <RadioGroupItem
                    value={value}
                    id={value}
                    className="sr-only"
                  />
                  <Icon
                    className={cn(
                      'h-8 w-8',
                      niche === value ? 'text-green-600' : ''
                    )}
                  />
                  <span className="font-semibold">{nicheLabel}</span>
                </Label>
              ))}
            </RadioGroup>
            {submissionState?.fieldErrors?.niche && (
              <p className="text-red-500 text-sm mt-1">
                {submissionState.fieldErrors.niche}
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
                  placeholder="e.g., English, Portuguese"
                  className="pl-10"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                />
              </div>
              {submissionState?.fieldErrors?.language && (
                <p className="text-red-500 text-sm mt-1">
                  {submissionState.fieldErrors.language}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="country"
                  name="country"
                  placeholder="e.g., Brazil, Japan"
                  className="pl-10"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              {submissionState?.fieldErrors?.country && (
                <p className="text-red-500 text-sm mt-1">
                  {submissionState.fieldErrors.country}
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
