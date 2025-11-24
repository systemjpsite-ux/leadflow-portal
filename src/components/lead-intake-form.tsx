"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { registerLead, type LeadState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, User, Mail, UserCheck, Loader2, HeartPulse, DollarSign, HeartHandshake } from "lucide-react";

const initialState: LeadState = {
  message: undefined,
  errors: undefined,
  success: false,
};

const languages = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'zh-CN', label: 'Chinese – Simplified' },
    { code: 'zh-TW', label: 'Chinese – Traditional' },
    { code: 'ar', label: 'Arabic' },
    { code: 'ru', label: 'Russian' },
    { code: 'hi', label: 'Hindi' },
    { code: 'id', label: 'Indonesian' },
    { code: 'tr', label: 'Turkish' },
    { code: 'other', label: 'Other' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
    </Button>
  );
}

export function LeadIntakeForm() {
  const [state, formAction] = useFormState(registerLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
      setSelectedLanguage('');
    } else if (state.message) {
      const errorDescription = state.errors?._form?.[0] 
        || state.errors?.email?.[0] 
        || state.errors?.otherLanguage?.[0]
        || "Please check the form for errors.";
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorDescription,
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-2xl shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">LeadFlow Portal</CardTitle>
        <CardDescription className="pt-2">Register a new lead by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="name" name="name" placeholder="John Doe" required className="pl-10" aria-describedby="name-error" />
            </div>
            {state.errors?.name && <p id="name-error" className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required className="pl-10" aria-describedby="email-error"/>
            </div>
            {state.errors?.email && <p id="email-error" className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
          </div>
          
          <div className="space-y-3" role="radiogroup" aria-labelledby="niche-label">
            <Label id="niche-label">Niche</Label>
            <RadioGroup name="niche" className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-describedby="niche-error">
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="health" id="health" />
                <Label htmlFor="health" className="flex items-center gap-2 font-normal cursor-pointer">
                  <HeartPulse className="h-5 w-5 text-red-500" /> Health
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="wealth" id="wealth" />
                <Label htmlFor="wealth" className="flex items-center gap-2 font-normal cursor-pointer">
                  <DollarSign className="h-5 w-5 text-green-500" /> Wealth
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="love" id="love" />
                <Label htmlFor="love" className="flex items-center gap-2 font-normal cursor-pointer">
                  <HeartHandshake className="h-5 w-5 text-pink-500" /> Relationships
                </Label>
              </div>
            </RadioGroup>
            {state.errors?.niche && <p id="niche-error" className="text-sm font-medium text-destructive">{state.errors.niche[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <div className="relative flex items-center">
                 <Languages className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                <Select name="language" onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="pl-10" aria-describedby="language-error">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {state.errors?.language && <p id="language-error" className="text-sm font-medium text-destructive">{state.errors.language[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Agent Origin</Label>
               <div className="relative flex items-center">
                 <UserCheck className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                <Select name="agent">
                  <SelectTrigger className="pl-10" aria-describedby="agent-error">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health-sales-agent">Health Sales Agent</SelectItem>
                    <SelectItem value="wealth-sales-agent">Wealth Sales Agent</SelectItem>
                    <SelectItem value="love-sales-agent">Love Sales Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {state.errors?.agent && <p id="agent-error" className="text-sm font-medium text-destructive">{state.errors.agent[0]}</p>}
            </div>
          </div>
          
          {selectedLanguage === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="otherLanguage">Other Language</Label>
              <Input id="otherLanguage" name="otherLanguage" placeholder="Type the language name" required aria-describedby="other-language-error" />
              {state.errors?.otherLanguage && <p id="other-language-error" className="text-sm font-medium text-destructive">{state.errors.otherLanguage[0]}</p>}
            </div>
          )}

          {state.errors?._form && <p className="text-sm font-medium text-destructive">{state.errors._form[0]}</p>}
          
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
