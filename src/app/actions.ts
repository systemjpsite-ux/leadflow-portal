
'use server';

import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  niche: z.string().min(1, { message: "Please select a niche." }),
  language: z.string().min(1, { message: "Please enter a language." }).max(50),
  agentOrigin: z.string().min(1, { message: "Please select an agent origin." }),
});

export async function registerLead(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  console.log("Server Action: registerLead received data.", rawData);

  const validatedFields = leadSchema.safeParse(rawData);

  // If validation fails, do nothing.
  // In a real app, you might redirect with an error, but here we fail silently on the server.
  if (!validatedFields.success) {
    console.error("Server Action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return;
  }
  
  const { name, email, niche, language, agentOrigin } = validatedFields.data;

  try {
    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    // If email already exists, do nothing and return.
    if (!querySnapshot.empty) {
      console.log("Server Action: Duplicate email found. Aborting.", email);
      return;
    }

    // Add the new lead to Firestore
    await addDoc(leadsRef, {
      name,
      email: email.toLowerCase(),
      niche,
      language,
      agent: agentOrigin,
      timestamp: serverTimestamp(),
      status: "new",
    });

    console.log("Server Action: Successfully wrote lead to Firestore.");

  } catch (error) {
    console.error("Server Action: An unexpected error occurred in Firestore.", error);
    // Do not throw the error to the client to prevent crashing.
  }
}
