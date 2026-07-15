export type AccountRole = "family" | "admin";
export type PaymentStatus = "Not Paid" | "Pending Verification" | "Confirmed";
export type EnrollmentStatus = "Pending Payment" | "Payment Submitted" | "Active" | "Cancelled";

export type Account = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeAddress: string;
  passwordHash: string;
  role: AccountRole;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EmergencyContact = {
  id: string;
  accountId: string;
  fullName: string;
  phone: string;
  relationship: string;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  id: string;
  accountId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  previousExperience: string;
  hasMedicalConditions: boolean;
  medicalDetails: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  photoVideoPermission: boolean;
  electronicSignature: string;
  createdAt: string;
  updatedAt: string;
};

export type KarateClass = {
  id: string;
  name: string;
  minAge: number;
  maxAge: number | null;
  skillLevel: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
  capacity: number;
  tuitionCents: number;
  registrationStatus: "Open" | "Waitlist" | "Closed";
  enrollmentPeriod: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassSession = {
  id: string;
  classId: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
};

export type Enrollment = {
  id: string;
  registrationReference: string;
  accountId: string;
  studentId: string;
  classId: string;
  classSessionId: string;
  enrollmentStatus: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  waiverAcceptedAt: string;
  tuitionCents: number;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  enrollmentId: string;
  accountId: string;
  amountCents: number;
  transactionReference: string;
  receiptId: string | null;
  status: PaymentStatus;
  submittedAt: string;
  verifiedAt: string | null;
  verifiedByAccountId: string | null;
};

export type WaiverAcceptance = {
  id: string;
  accountId: string;
  studentId: string;
  consentType: "liability-waiver" | "photo-video-consent" | "privacy-policy" | "terms-of-service";
  accepted: boolean;
  version: string;
  acceptedAt: string;
  ipAddress: string;
};

export type EmailDeliveryLog = {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  relatedId: string;
  status: "Pending" | "Sent" | "Failed" | "Skipped";
  providerMessageId: string;
  error: string;
  createdAt: string;
  updatedAt: string;
};

export type TrialRequest = {
  id: string;
  accountId: string | null;
  parentParticipantName: string;
  studentName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  previousExperience: string;
  preferredClassDate: string;
  additionalNotes: string;
  status: "New" | "Contacted" | "Completed";
  createdAt: string;
  updatedAt: string;
};

export type PortalSession = {
  id: string;
  accountId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt: string;
  ipAddress: string;
  userAgent: string;
};

export type SecureToken = {
  id: string;
  accountId: string;
  type: "email-verification" | "password-reset";
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type Receipt = {
  id: string;
  accountId: string;
  fileName: string;
  contentType: string;
  size: number;
  dataBase64: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  accountId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  details: string;
  createdAt: string;
};

export type RateLimitEntry = { key: string; count: number; resetAt: string };

export type PortalDatabase = {
  version: number;
  accounts: Account[];
  students: Student[];
  emergency_contacts: EmergencyContact[];
  classes: KarateClass[];
  class_sessions: ClassSession[];
  enrollments: Enrollment[];
  payments: Payment[];
  waiver_acceptances: WaiverAcceptance[];
  email_delivery_logs: EmailDeliveryLog[];
  trial_requests: TrialRequest[];
  sessions: PortalSession[];
  secure_tokens: SecureToken[];
  receipts: Receipt[];
  audit_logs: AuditLog[];
  rate_limits: RateLimitEntry[];
};
