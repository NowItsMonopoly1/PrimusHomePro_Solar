// SERVICE: Twilio SMS Client
// External integration - Twilio API

export interface SendSmsInput {
  to: string;
  body: string;
  from?: string; // Optional override
}

export interface SendSmsResult {
  providerMessageId: string;
  status: 'sent' | 'failed';
}

/**
 * Send SMS via Twilio
 * 
 * EXTERNAL INTEGRATION - This calls Twilio API
 * Domain logic should NOT be in this file
 */
export async function sendSms(input: SendSmsInput): Promise<SendSmsResult> {
  // TODO: Implement Twilio API call
  // Account SID: process.env.TWILIO_ACCOUNT_SID
  // Auth Token: process.env.TWILIO_AUTH_TOKEN
  // From Number: process.env.TWILIO_PHONE_NUMBER
  
  // STUB implementation
  return {
    providerMessageId: `SM${Date.now()}`,
    status: 'sent',
  };
}
