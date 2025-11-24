
'use server';

import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

export async function registerLead(formData: FormData): Promise<void> {
  const { firestore } = initializeFirebase();

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
    
    const leadsRef = collection(firestore, "leads");
    
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
    console.error("Error in registerLead server action:", error);
    return;
  }
}
