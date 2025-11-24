
"use client";

import { useActionState, useEffect, useRef } from "react";
import { registerLead, type LeadState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, HeartHandshake, HeartPulse, Loader2, Mail, User, UserCheck, Terminal, Languages } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: LeadState = {
  success: false,
  fieldErrors: {},
  formError: "",
};

export function LeadIntakeForm() {
  const [state, formAction, isPending] = useActionState(registerLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log("Client: action state updated", state);
    if (state.success) {
      toast({
        title: "Success!",
        description: "Lead registered successfully!",
      });
      formRef.current?.reset();
    }
  }, [state, toast]);
  
  return (
    <Card className="w-full max-w-2xl shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">LeadFlow Portal</CardTitle>
        <CardDescription className="pt-2">Register a new lead by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        {state?.formError && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.formError}</AlertDescription>
          </Alert>
        )}
        <form ref={formRef} action={formAction} className="space-y-6" noValidate>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="name" name="name" placeholder="John Doe" required className="pl-10" />
            </div>
            {state?.fieldErrors?.name && <p className="text-sm font-medium text-destructive">{state.fieldErrors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required className="pl-10" />
            </div>
            {state?.fieldErrors?.email && <p className="text-sm font-medium text-destructive">{state.fieldErrors.email[0]}</p>}
          </div>
          
          <div className="space-y-3">
            <Label>Niche</Label>
            <RadioGroup name="niche" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Health" id="health" />
                <Label htmlFor="health" className="flex items-center gap-2 font-normal cursor-pointer"><HeartPulse className="h-5 w-5" /> Health</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Wealth" id="wealth" />
                <Label htmlFor="wealth" className="flex items-center gap-2 font-normal cursor-pointer"><DollarSign className="h-5 w-5" /> Wealth</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Relationships" id="love" />
                <Label htmlFor="love" className="flex items-center gap-2 font-normal cursor-pointer"><HeartHandshake className="h-5 w-5" /> Relationships</Label>
              </div>
            </RadioGroup>
            {state?.fieldErrors?.niche && <p className="text-sm font-medium text-destructive">{state.fieldErrors.niche[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <div className="relative flex items-center">
                <Languages className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="language" name="language" placeholder="e.g., English, Japanese" required className="pl-10" />
              </div>
              {state?.fieldErrors?.language && <p className="text-sm font-medium text-destructive">{state.fieldErrors.language[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentOrigin">Agent Origin</Label>
              <Select name="agentOrigin">
                <SelectTrigger className="pl-10">
                  <UserCheck className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health Sales Agent">Health Sales Agent</SelectItem>
                  <SelectItem value="Wealth Sales Agent">Wealth Sales Agent</SelectItem>
                  <SelectItem value="Love Sales Agent">Love Sales Agent</SelectItem>
                </SelectContent>
              </Select>
              {state?.fieldErrors?.agentOrigin && <p className="text-sm font-medium text-destructive">{state.fieldErrors.agentOrigin[0]}</p>}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
