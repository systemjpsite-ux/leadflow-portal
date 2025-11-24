# **App Name**: LeadFlow Portal

## Core Features:

- Lead Information Capture: Collect full name, email address, niche, language, and agent origin through a streamlined form.
- Niche Selection: Provide a 'Niche' selector with options: Health, Wealth, Relationships.
- Language Selection: Offer a 'Language' selector dropdown with options: English, Portuguese, Spanish, Japanese, Chinese, Hindi.
- Agent Origin: Enable users to indicate the agent's origin using the options: Health Sales Agent, Wealth Sales Agent, or Love Sales Agent
- Data Submission to Firestore: Save lead data to Firestore under the 'leads' collection, including name, email, niche, language, agent, timestamp, and a default 'new' status.
- Email Validation and Duplication Prevention: Verify email format and prevent duplicate submissions based on email addresses using validation tools.
- Submission Confirmation and Error Handling: Display a success message upon successful registration and provide user-friendly error messages for submission issues.

## Style Guidelines:

- Primary color: Soft blue (#A0C4FF) for a calm and professional feel.
- Background color: Very light gray (#F5F7FA) for a clean, minimalist look.
- Accent color: Subtle green (#BDB2FF) for success states and button highlights.
- Body and headline font: 'Inter' for a modern, neutral, and readable experience.
- Centralized layout with adequate spacing for clarity and ease of use.
- Simple, professional icons to represent different form fields or sections.
- Subtle animation or transition effects for form submission and success feedback.