
'use server';

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function registerLead(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase();
  const niche = String(formData.get("niche") ?? "");
  const language = String(formData.get("language") ?? "");
  const agentOrigin = String(formData.get("agentOrigin") ?? "");

  // Simple validation: If email is missing, do not proceed.
  if (!email) {
    console.log("Submission skipped: email is empty.");
    return;
  }
  
  try {
    const leadsRef = collection(db, "leads");
    
    // For this simplified version, we are not checking for duplicates.
    // We will just add the new lead.
    
    await addDoc(leadsRef, {
      name,
      email,
      niche,
      language,
      agent: agentOrigin,
      timestamp: serverTimestamp(),
      status: "new",
    });

    console.log("Successfully added lead for:", email);

  } catch (error) {
    console.error("Error in registerLead:", error);
    // The action fails silently on the client, but logs the error on the server.
    return;
  }
}
