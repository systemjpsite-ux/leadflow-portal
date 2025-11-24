
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { registerLead, type LeadState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown, DollarSign, HeartHandshake, HeartPulse, Languages, Loader2, Mail, User, UserCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Define the initial state for the form action. It must match the LeadState interface.
const initialState: LeadState = {
  success: false,
  errors: {},
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
  // Use the useActionState hook with the correct initial state
  const [state, formAction] = useActionState(registerLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // Create controlled components for all fields that need it
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [otherLanguage, setOtherLanguage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    // This effect runs whenever the 'state' from the server action changes
    if (state.success) {
      toast({
        title: "Success!",
        description: "Lead registered successfully!",
      });
      // Reset form and all controlled component states
      formRef.current?.reset();
      setName("");
      setEmail("");
      setNiche("");
      setSelectedLanguage("");
      setOtherLanguage("");
      setSelectedAgent("");
    } else if (state.errors && Object.keys(state.errors).length > 0) {
      // If there are errors, display a generic error toast.
      // Field-specific errors are displayed below each input field.
      const firstError = state.errors._form?.[0] || Object.values(state.errors).flat()[0];
      if (firstError) {
         toast({
            variant: "destructive",
            title: "Submission Error",
            description: firstError,
        });
      }
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
          
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="name" name="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" aria-describedby="name-error" />
            </div>
            {state.errors?.name && <p id="name-error" className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" aria-describedby="email-error"/>
            </div>
            {state.errors?.email && <p id="email-error" className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
          </div>
          
          {/* Niche */}
          <div className="space-y-3" role="radiogroup" aria-labelledby="niche-label">
            <Label id="niche-label">Niche</Label>
            <RadioGroup name="niche" value={niche} onValueChange={setNiche} className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-describedby="niche-error">
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
            {state.errors?.niche && <p id="niche-error" className="text-sm font-medium text-destructive">{state.errors.niche[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input type="hidden" name="language" value={selectedLanguage} />
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={popoverOpen} className="w-full justify-between pl-10" aria-describedby="language-error">
                    <Languages className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                    {selectedLanguage ? languages.find((l) => l.code === selectedLanguage)?.label : "Select a language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem key={language.code} value={language.code} onSelect={(currentValue) => {
                            setSelectedLanguage(currentValue === selectedLanguage ? "" : currentValue);
                            setPopoverOpen(false);
                          }}>
                          <Check className={cn("mr-2 h-4 w-4", selectedLanguage === language.code ? "opacity-100" : "opacity-0")}/>
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {state.errors?.language && <p id="language-error" className="text-sm font-medium text-destructive">{state.errors.language[0]}</p>}
            </div>

            {/* Agent Origin */}
            <div className="space-y-2">
              <Label htmlFor="agent">Agent Origin</Label>
              <Input type="hidden" name="agent" value={selectedAgent} />
              <Select onValueChange={setSelectedAgent} value={selectedAgent}>
                <SelectTrigger className="pl-10" aria-describedby="agent-error">
                  <UserCheck className="absolute left-3 z-10 h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health-sales-agent">Health Sales Agent</SelectItem>
                  <SelectItem value="wealth-sales-agent">Wealth Sales Agent</SelectItem>
                  <SelectItem value="love-sales-agent">Love Sales Agent</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.agent && <p id="agent-error" className="text-sm font-medium text-destructive">{state.errors.agent[0]}</p>}
            </div>
          </div>
          
          {/* Other Language Input */}
          {selectedLanguage === 'other' && (
            <div className="space-y-2 animate-in fade-in-0">
              <Label htmlFor="otherLanguage">Other Language</Label>
              <Input id="otherLanguage" name="otherLanguage" value={otherLanguage} onChange={(e) => setOtherLanguage(e.target.value)} placeholder="Type the language name" required aria-describedby="other-language-error" />
              {state.errors?.otherLanguage && <p id="other-language-error" className="text-sm font-medium text-destructive">{state.errors.otherLanguage[0]}</p>}
            </div>
          )}

          {/* Generic Form Error */}
          {state.errors?._form && <p className="text-sm font-medium text-destructive">{state.errors._form[0]}</p>}
          
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
