import { UserData, GoogleUser} from "./apiInterfaces";
export interface UserState {
  user: UserData | GoogleUser | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  otpStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  otpError: string | null;
  email: string | null;
}

