import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Visa checklist types ───

export type StepStatus = "pending" | "in_progress" | "completed";

export interface ChecklistStep {
  id: string;
  label: string;
  description: string;
  category: "documents" | "forms" | "appointments" | "verification";
  status: StepStatus;
  documents: UploadedDoc[];
  notes: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  /** base64 data URL for demo/local persistence */
  dataUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  visaType: string;
  destination: string;
}

// ─── Default Australian Visitor Visa 600 checklist ───

const DEFAULT_STEPS: ChecklistStep[] = [
  {
    id: "passport",
    label: "Valid passport",
    description:
      "Upload a clear scan of your passport bio page. Must be valid for at least 6 months beyond your stay.",
    category: "documents",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "photo",
    label: "Passport-size photos",
    description:
      "Upload 2 recent passport photos (45x35mm, white background, taken within last 6 months).",
    category: "documents",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "application-form",
    label: "Visa application form (Form 1419)",
    description:
      "Complete and sign the Application for a Visitor visa – Tourist stream (Form 1419).",
    category: "forms",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "financial-docs",
    label: "Proof of financial capacity",
    description:
      "Bank statements from the last 3 months showing sufficient funds for your trip.",
    category: "documents",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "employment-letter",
    label: "Employment or enrollment letter",
    description:
      "Letter from your employer confirming your position, salary, and approved leave dates. Students: provide enrollment letter.",
    category: "documents",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "travel-itinerary",
    label: "Travel itinerary",
    description:
      "Flight bookings (or tentative itinerary) and accommodation details for your stay in Australia.",
    category: "documents",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "health-insurance",
    label: "Health insurance",
    description:
      "Proof of adequate health insurance covering your stay. OVHC or travel insurance policy.",
    category: "documents",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "character-docs",
    label: "Character documents",
    description:
      "Police clearance certificate from your country of residence (issued within the last 12 months).",
    category: "verification",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "health-exam",
    label: "Health examination",
    description:
      "Complete a health examination with a Bupa Medical Visa Services panel physician if required.",
    category: "appointments",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "biometrics",
    label: "Biometrics appointment",
    description:
      "Book and attend a biometrics collection appointment at your nearest Australian Visa Application Centre.",
    category: "appointments",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "payment",
    label: "Application fee payment",
    description:
      "Pay the visa application charge (AUD $190 for Visitor visa subclass 600).",
    category: "forms",
    status: "pending",
    documents: [],
    notes: "",
  },
  {
    id: "submission",
    label: "Submit application",
    description:
      "Review all documents and submit your application through ImmiAccount or your nearest visa office.",
    category: "forms",
    status: "pending",
    documents: [],
    notes: "",
  },
];

const DEFAULT_PROFILE: UserProfile = {
  fullName: "",
  email: "",
  nationality: "",
  passportNumber: "",
  dateOfBirth: "",
  visaType: "Australia Visitor Visa (Subclass 600)",
  destination: "Australia",
};

// ─── Store ───

interface AppState {
  steps: ChecklistStep[];
  profile: UserProfile;
  chatHistory: ChatMessage[];

  // Step actions
  updateStepStatus: (id: string, status: StepStatus) => void;
  addDocument: (stepId: string, doc: UploadedDoc) => void;
  removeDocument: (stepId: string, docId: string) => void;
  updateStepNotes: (id: string, notes: string) => void;

  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Chat actions
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Reset
  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      steps: DEFAULT_STEPS,
      profile: DEFAULT_PROFILE,
      chatHistory: [],

      updateStepStatus: (id, status) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),

      addDocument: (stepId, doc) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId
              ? { ...s, documents: [...s.documents, doc] }
              : s
          ),
        })),

      removeDocument: (stepId, docId) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId
              ? {
                  ...s,
                  documents: s.documents.filter((d) => d.id !== docId),
                }
              : s
          ),
        })),

      updateStepNotes: (id, notes) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === id ? { ...s, notes } : s
          ),
        })),

      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      addMessage: (msg) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, msg],
        })),

      clearChat: () => set({ chatHistory: [] }),

      resetAll: () =>
        set({
          steps: DEFAULT_STEPS,
          profile: DEFAULT_PROFILE,
          chatHistory: [],
        }),
    }),
    { name: "visa-copilot-store" }
  )
);
