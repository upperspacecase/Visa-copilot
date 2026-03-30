import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Visa Copilot, an expert AI assistant that helps people apply for visas. You are currently helping with an Australian Visitor Visa (Subclass 600) application.

You have knowledge of:
- Australian visa requirements and processes
- Document requirements (passport, photos, financial docs, etc.)
- Form 1419 details
- Health and character requirements
- Biometrics requirements
- Processing times and fees
- Interview preparation tips

Guidelines:
- Be helpful, concise, and specific to Australian visa requirements
- Reference the user's current checklist progress when relevant
- Give actionable advice and next steps
- If you don't know something, say so and suggest they check the official Department of Home Affairs website
- Keep responses focused and practical
- Format responses with clear paragraphs, use bullet points for lists`;

export async function POST(req: NextRequest) {
  const { message, history, context } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Provide helpful offline responses based on common questions
    const reply = getOfflineResponse(message, context);
    return NextResponse.json({ reply });
  }

  try {
    const messages = [
      ...(history || []).map(
        (m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })
      ),
      { role: "user", content: message },
    ];

    const contextNote = context
      ? `\n\nUser's current application status:\n- Visa: ${context.profile?.visaType || "Australia Visitor Visa 600"}\n- Nationality: ${context.profile?.nationality || "Not specified"}\n- Checklist progress: ${context.steps?.filter((s: { status: string }) => s.status === "completed").length || 0}/${context.steps?.length || 12} steps completed\n- Steps in progress: ${context.steps?.filter((s: { status: string }) => s.status === "in_progress").map((s: { label: string }) => s.label).join(", ") || "None"}\n- Steps completed: ${context.steps?.filter((s: { status: string }) => s.status === "completed").map((s: { label: string }) => s.label).join(", ") || "None"}`
      : "";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT + contextNote,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({
        reply: "Sorry, there was an issue connecting to the AI service. Please try again.",
      });
    }

    const data = await res.json();
    const reply =
      data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json({
      reply: "Something went wrong. Please try again in a moment.",
    });
  }
}

// Offline responses for common questions
function getOfflineResponse(
  message: string,
  context: { steps?: { label: string; status: string }[] }
): string {
  const lower = message.toLowerCase();

  if (lower.includes("document") || lower.includes("need") || lower.includes("require")) {
    return `For an Australian Visitor Visa (Subclass 600), you'll typically need:

- **Valid passport** - Must be valid for at least 6 months beyond your intended stay
- **Passport-size photos** - 45x35mm, white background, taken within the last 6 months
- **Completed Form 1419** - Application for a Visitor visa (Tourist stream)
- **Proof of financial capacity** - Bank statements from the last 3 months
- **Employment/enrollment letter** - Confirming your position and approved leave
- **Travel itinerary** - Flight bookings and accommodation details
- **Health insurance** - Adequate cover for your stay (OVHC or travel insurance)
- **Police clearance certificate** - From your country of residence
- **Health examination results** - If required based on your circumstances

Check your Dashboard checklist to track which documents you've already prepared!`;
  }

  if (lower.includes("photo")) {
    return `Australian visa photo requirements:

- **Size**: 45mm x 35mm
- **Background**: Plain white or light grey
- **Recency**: Taken within the last 6 months
- **Quality**: Sharp focus, no shadows on face
- **Expression**: Neutral expression, mouth closed
- **Head position**: Straight, facing camera directly
- **Glasses**: Remove if possible; if worn, no glare on lenses
- **Head covering**: Only permitted for religious/medical reasons

Most photo shops know these requirements. You can also use apps that format photos to visa specifications.`;
  }

  if (lower.includes("how long") || lower.includes("processing") || lower.includes("wait")) {
    return `Processing times for Australian Visitor Visa (Subclass 600):

- **Standard processing**: 20-30 business days from submission
- **Peak periods** (Oct-Feb): Can take up to 60 business days
- **Urgent requests**: Not officially available, but you can contact the embassy

Tips to speed things up:
- Submit a **complete application** with all documents
- Ensure all documents are **clearly scanned** and legible
- Provide **certified translations** for non-English documents
- **Don't contact** the embassy for status updates within the standard processing window

I recommend applying at least **8-10 weeks** before your planned travel date.`;
  }

  if (lower.includes("biometric")) {
    return `For your biometrics appointment:

**What to bring:**
- Your valid passport (original)
- Appointment confirmation letter/email
- Visa application receipt/reference number

**What happens:**
- Digital photograph will be taken
- Fingerprints of all 10 fingers will be scanned
- The process takes about 15-20 minutes

**Where to go:**
- Australian Visa Application Centre (AVAC) nearest to you
- Book online at the VFS Global or TLScontact website (depends on your country)

**Important:**
- Arrive 10-15 minutes early
- Ensure fingers are clean and free of cuts/damage
- Remove any finger accessories (rings, bandages)`;
  }

  if (lower.includes("cost") || lower.includes("fee") || lower.includes("price")) {
    return `Australian Visitor Visa (Subclass 600) fees:

- **Base application charge**: AUD $190 (~USD $125)
- **Biometrics fee**: Varies by country (typically AUD $35-50)
- **Service centre fee**: If applying through a VAC, additional service fee applies
- **Health examination**: AUD $300-500 depending on panel physician

**Payment methods:** Credit card, debit card, or bank transfer through ImmiAccount.

Note: Fees are non-refundable, even if your application is refused.`;
  }

  // Default response with checklist awareness
  const completed = context?.steps?.filter((s) => s.status === "completed").length || 0;
  const total = context?.steps?.length || 12;

  return `I'm running in offline mode right now (no API key configured), but I can still help!

You've completed **${completed}/${total}** steps on your checklist. Here are some things I can help with when online:

- Detailed document requirements for each step
- Photo specification guidance
- Form 1419 filling tips
- Processing times and fee information
- Interview and biometrics preparation
- Country-specific advice

**To enable AI responses:** Add \`ANTHROPIC_API_KEY=your-key-here\` to a \`.env.local\` file in the project root, then restart the dev server.

In the meantime, head to your **Dashboard** to continue working through your checklist!`;
}
