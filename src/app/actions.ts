
'use server';

import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function registerLead(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase();
  const niche = String(formData.get("niche") ?? "");
  const language = String(formData.get("language") ?? "");
  const agentOrigin = String(formData.get("agentOrigin") ?? "");

  if (!email) {
    console.log("Submission skipped: email is empty.");
    return;
  }
  
  try {
    const leadsRef = collection(db, "leads");
    
    // Check for duplicates before adding
    const q = query(leadsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        console.log(`Submission skipped: email ${email} already exists.`);
        return;
    }

    await addDoc(leadsRef, {
      name,
      email,
      niche,
      language,
      agentOrigin,
      createdAt: serverTimestamp(),
      status: "new",
    });

    console.log("Successfully added lead for:", email);

  } catch (error) {
    console.error("Error in registerLead:", error);
    // The action fails silently on the client, but logs the error on the server.
    // This return ensures no uncaught exceptions are thrown.
    return;
  }
}
