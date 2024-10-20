import { AdminData } from '../adminInterfaces/adminInterface';

export interface AdminState {
  admin: AdminData | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  otpStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  otpError: string | null;
}