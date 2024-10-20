export interface AdminData {
    name: string;
    email: string;
    password: string;
  }
  

export interface AdminLoginPayload {
    email: string;
    password: string;
  }
  
  export interface AdminLoginResponse {
    accessToken: string;
    refreshToken: string;
    token: string;
    admin: AdminData; 
  }
