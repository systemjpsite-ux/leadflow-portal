
"use client";

import { useRef, useState } from "react";
import { registerLead, type RegisterLeadResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, HeartHandshake, HeartPulse, Mail, User, UserCheck, Languages, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LeadIntakeForm() {
  const [state, setState] = useState<RegisterLeadResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // States for controlled components
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [language, setLanguage] = useState("");
  const [agentOrigin, setAgentOrigin] = useState("");

  const clientAction = async (formData: FormData) => {
    setIsPending(true);
    setState(null); // Clear previous state

    const result = await registerLead(formData);
    setState(result);

    if (result.success) {
      // Clear form fields on success
      setName("");
      setEmail("");
      setNiche("");
      setLanguage("");
      setAgentOrigin("");
      formRef.current?.reset(); // Also reset the native form for radio/select visuals
    }
    
    setIsPending(false);
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">LeadFlow Portal</CardTitle>
        <CardDescription className="pt-2">Register a new lead by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={clientAction}
          className="space-y-6"
          noValidate
          autoComplete="off"
        >
          {state && !state.success && state.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {state && state.success && state.message && (
            <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600">
               <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
               <AlertDescription className="text-green-800 dark:text-green-200">{state.message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g., Jane Doe" 
                required 
                className="pl-10" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>
            {state?.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}
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
                required 
                className="pl-10" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
             {state?.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}
          </div>
          
          <div className="space-y-3">
            <Label>Niche</Label>
            <RadioGroup 
              name="niche" 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4" 
              required
              value={niche}
              onValueChange={setNiche}
            >
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
            {state?.fieldErrors?.niche && <p className="text-sm text-destructive">{state.fieldErrors.niche}</p>}
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
                  required 
                  className="pl-10" 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              {state?.fieldErrors?.language && <p className="text-sm text-destructive">{state.fieldErrors.language}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentOrigin">Agent Origin</Label>
              <Select 
                name="agentOrigin" 
                required
                value={agentOrigin}
                onValueChange={setAgentOrigin}
              >
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
              {state?.fieldErrors?.agentOrigin && <p className="text-sm text-destructive">{state.fieldErrors.agentOrigin}</p>}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
