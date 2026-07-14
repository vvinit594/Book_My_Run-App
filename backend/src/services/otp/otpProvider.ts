/**
 * OTP provider abstraction — swap DummyOtpProvider for Twilio/MSG91 later
 * without changing the auth flow.
 */

export interface SendOtpInput {
  channel: "sms" | "email";
  destination: string;
  purpose: string;
}

export interface SendOtpResult {
  /** The OTP code that was sent (or generated for storage). */
  otpCode: string;
  providerMessageId?: string;
}

export interface OtpProvider {
  sendOtp(input: SendOtpInput): Promise<SendOtpResult>;
}

/** Development provider — always uses 123456. Replace in production. */
export class DummyOtpProvider implements OtpProvider {
  async sendOtp(_input: SendOtpInput): Promise<SendOtpResult> {
    return {
      otpCode: "123456",
      providerMessageId: `dummy-${Date.now()}`,
    };
  }
}

let provider: OtpProvider = new DummyOtpProvider();

export function getOtpProvider(): OtpProvider {
  return provider;
}

/** Used in tests or when wiring a real SMS provider. */
export function setOtpProvider(next: OtpProvider): void {
  provider = next;
}
