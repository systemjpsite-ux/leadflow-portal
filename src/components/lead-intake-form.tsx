
'use client';

import { registerLead } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, HeartHandshake, HeartPulse, Languages, Mail, User, UserCheck } from "lucide-react";
import { useRef } from "react";

export function LeadIntakeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    await registerLead(formData);
    toast({
      title: "Submission Received!",
      description: "Thank you for your submission. We will be in touch shortly.",
    });
    formRef.current?.reset();
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
                required
                className="pl-10"
                autoComplete="off"
              />
            </div>
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
                autoComplete="off"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Niche</Label>
            <RadioGroup
              name="niche"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              required
              defaultValue="Health"
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
                />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="agentOrigin">Agent Origin</Label>
                 <Select name="agentOrigin" required>
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
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
