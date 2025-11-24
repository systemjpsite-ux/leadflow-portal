
'use server';

import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function registerLead(formData: FormData): Promise<void> {
  try {
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "").toLowerCase();
    const niche = String(formData.get("niche") ?? "");
    const language = String(formData.get("language") ?? "");
    const agentOrigin = String(formData.get("agentOrigin") ?? "");

    if (!email) {
      console.log("Submission skipped: email is empty.");
      return;
    }
    
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
    // This is the most critical part.
    // We catch ANY error that happens inside the action, log it for debugging,
    // and then return gracefully. This prevents the server from crashing
    // and sending an "unexpected response".
    console.error("Error in registerLead server action:", error);
    // The action fails silently on the client, but the error is logged on the server.
    return;
  }
}
