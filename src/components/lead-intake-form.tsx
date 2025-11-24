
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { registerLead, type LeadState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown, DollarSign, HeartHandshake, HeartPulse, Languages, Loader2, Mail, User, UserCheck, Terminal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: LeadState = {
  success: false,
  fieldErrors: {},
  formError: "",
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

export function LeadIntakeForm() {
  const [state, formAction, isPending] = useActionState(registerLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // Controlled component states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [language, setLanguage] = useState("");
  const [agentOrigin, setAgentOrigin] = useState("");
  const [otherLanguage, setOtherLanguage] = useState("");

  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    console.log("Action state updated:", state);
    if (state.success) {
      toast({
        title: "Success!",
        description: "Lead registered successfully!",
      });
      // Reset form and all controlled states
      formRef.current?.reset();
      setName("");
      setEmail("");
      setNiche("");
      setLanguage("");
      setAgentOrigin("");
      setOtherLanguage("");
    }
  }, [state, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("Submitting form...");
    formAction(formData);
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">LeadFlow Portal</CardTitle>
        <CardDescription className="pt-2">Register a new lead by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.formError && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {state.formError}
            </AlertDescription>
          </Alert>
        )}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="name" name="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" />
            </div>
            {state.fieldErrors?.name && <p className="text-sm font-medium text-destructive">{state.fieldErrors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
            </div>
            {state.fieldErrors?.email && <p className="text-sm font-medium text-destructive">{state.fieldErrors.email[0]}</p>}
          </div>
          
          <div className="space-y-3">
            <Label>Niche</Label>
            <RadioGroup name="niche" value={niche} onValueChange={setNiche} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="health" id="health" />
                <Label htmlFor="health" className="flex items-center gap-2 font-normal cursor-pointer"><HeartPulse className="h-5 w-5 text-red-500" /> Health</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="wealth" id="wealth" />
                <Label htmlFor="wealth" className="flex items-center gap-2 font-normal cursor-pointer"><DollarSign className="h-5 w-5 text-green-500" /> Wealth</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-input p-4 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="love" id="love" />
                <Label htmlFor="love" className="flex items-center gap-2 font-normal cursor-pointer"><HeartHandshake className="h-5 w-5 text-pink-500" /> Relationships</Label>
              </div>
            </RadioGroup>
            {state.fieldErrors?.niche && <p className="text-sm font-medium text-destructive">{state.fieldErrors.niche[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <input type="hidden" name="language" value={language} />
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={popoverOpen} className="w-full justify-between pl-10">
                    <Languages className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                    {language ? languages.find((l) => l.code === language)?.label : "Select a language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((lang) => (
                        <CommandItem key={lang.code} value={lang.code} onSelect={(currentValue) => {
                            setLanguage(currentValue === language ? "" : currentValue);
                            setPopoverOpen(false);
                          }}>
                          <Check className={cn("mr-2 h-4 w-4", language === lang.code ? "opacity-100" : "opacity-0")}/>
                          {lang.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {state.fieldErrors?.language && <p className="text-sm font-medium text-destructive">{state.fieldErrors.language[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentOrigin">Agent Origin</Label>
              <Select name="agentOrigin" onValueChange={setAgentOrigin} value={agentOrigin}>
                <SelectTrigger className="pl-10">
                  <UserCheck className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health-sales-agent">Health Sales Agent</SelectItem>
                  <SelectItem value="wealth-sales-agent">Wealth Sales Agent</SelectItem>
                  <SelectItem value="love-sales-agent">Love Sales Agent</SelectItem>
                </SelectContent>
              </Select>
              {state.fieldErrors?.agentOrigin && <p className="text-sm font-medium text-destructive">{state.fieldErrors.agentOrigin[0]}</p>}
            </div>
          </div>
          
          {language === 'other' && (
            <div className="space-y-2 animate-in fade-in-0">
              <Label htmlFor="otherLanguage">Other Language</Label>
              <Input id="otherLanguage" name="otherLanguage" value={otherLanguage} onChange={(e) => setOtherLanguage(e.target.value)} placeholder="Type the language name" required />
              {state.fieldErrors?.otherLanguage && <p className="text-sm font-medium text-destructive">{state.fieldErrors.otherLanguage[0]}</p>}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
