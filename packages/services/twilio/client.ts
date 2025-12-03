// SERVICE: Twilio SMS Client
// External integration - Twilio API

import { SendSmsInput, SendSmsResult, InboundSms } from './types';

/**
 * Send SMS via Twilio
 * Pure external adapter
 */
export async function sendSms(input: SendSmsInput): Promise<SendSmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials missing. Mocking send.');
    return { providerMessageId: `mock_${Date.now()}`, delivered: true };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    To: input.to,
    From: fromNumber,
    Body: input.body,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio API Error:', error);
      return { providerMessageId: '', delivered: false };
    }

    const data = await response.json();
    return {
      providerMessageId: data.sid,
      delivered: true,
    };
  } catch (error) {
    console.error('Twilio Network Error:', error);
    return { providerMessageId: '', delivered: false };
  }
}

/**
 * Parse inbound webhook body from Twilio
 */
export function parseInboundSms(payload: any): InboundSms {
  return {
    from: payload.From || '',
    to: payload.To || '',
    body: payload.Body || '',
    raw: payload,
  };
}
