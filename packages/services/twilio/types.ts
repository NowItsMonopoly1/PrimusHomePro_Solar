// SERVICES: Twilio - Types
// Pure type definitions for external API interactions

export interface SendSmsInput {
  to: string;
  body: string;
}

export interface SendSmsResult {
  providerMessageId: string;
  delivered: boolean;
}

export interface InboundSms {
  from: string;
  to: string;
  body: string;
  raw: any;
}
