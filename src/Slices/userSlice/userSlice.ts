import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signup, verifyOtpApi, UpdatePasswordApi, login, 
  // googleSignupService,googleLoginService, 
  googleAuthApi,
  updateUserApi, confirmMailApi, verifyResetOtpApi, 
  updateTitleImageApi,
  updateProfileImageApi} from '../../services/userServices/api';
import { LoginPayload,UserApiData, UserData, VerifyOtpPayload, VerifyOtpResponse, LoginResponse, GoogleUser, AuthenticatedUser, UpdateUser, UpdateUserResponse, ConfirmMailRequest, ConfirmMailResponse, verifyResetOtpResponse, UpdatePasswordRequest, UpdatePasswordResponse} from '../../interfaces/userInterfaces/apiInterfaces';
import { UserState } from '../../interfaces/userInterfaces/storeInterfaces';
import Cookies from 'js-cookie';
import { RootState } from '../../store';

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
  otpStatus: 'idle',
  otpError: null,
  email: null
};

export const signupUser = createAsyncThunk<UserData, UserApiData>(
  'user/signupUser',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await signup(userDetails);
      return response;
    } catch (error: any) {
      
      return rejectWithValue(error);
    }
  }
);

export const verifyOtp = createAsyncThunk<VerifyOtpResponse, VerifyOtpPayload>(
  'user/verifyOtp',
  async (otpDetails, { rejectWithValue }) => {
    try {
      const response = await verifyOtpApi(otpDetails);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

    export const loginUser = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: { message: string } }>(
      'user/loginUser',
      async (loginDetails, { rejectWithValue }) => {
        try {
          const response = await login(loginDetails);
          Cookies.set('UserRefreshToken', response.refreshToken, {
            sameSite: 'strict',
            expires: 7,
          });
          Cookies.set('UserAccessToken', response.accessToken, {
            sameSite: 'strict',
            expires: 1 / 96, 
          });
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message ? { message: error.message } : { message: 'Failed to login' });
        }
      }
    );


    export const googleAuth = createAsyncThunk<AuthenticatedUser, GoogleUser>(
      'user/googleAuth',
      async (googleAuthDetails, { rejectWithValue }) => {
        try {
          const response = await googleAuthApi(googleAuthDetails);
          console.log("google auth slice",response)
          Cookies.set('UserRefreshToken', response.refreshToken, {
            sameSite: 'strict',
            expires: 7, // 7 days
          });
          Cookies.set('UserAccessToken', response.accessToken, {
            sameSite: 'strict',
            expires: 1 / 96, // 15 minutes
          });
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message ? { message: error.message } : { message: 'Failed to login' });
        }
      }
    );



export const  updateUser = createAsyncThunk<UpdateUserResponse, UpdateUser>(
  'user/updateUser',
  async (updateDetails, { rejectWithValue }) => {
    try {
      console.log("updateDetails001",updateDetails);
      
      const response = await updateUserApi(updateDetails.userId, updateDetails);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmMail = createAsyncThunk<ConfirmMailResponse, ConfirmMailRequest>(
  'user/confirmMail',
  async (emailRequest, { rejectWithValue }) => {
    try {
      const response = await confirmMailApi(emailRequest);
      return response;
    } catch (error: any) {
      console.log("Error", error);
      console.log("Error message", error.message);
      return rejectWithValue(error? { message: error } : { message: 'Failed to verify email' })
    }
  }
);

export const updatePassword = createAsyncThunk<UpdatePasswordResponse, UpdatePasswordRequest>(
  'user/updatePassword',
  async (newPasswordDetails, { rejectWithValue }) => {
    console.log(newPasswordDetails,"userSlice")
    try {
      const response = await UpdatePasswordApi(newPasswordDetails);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateProfieImage = createAsyncThunk<ImageUploadResponse, ImageUploadValues>(
//   'user/profileImage',
//   async(profileImageDetails, {rejectWithValue}) => {
//     console.log("profileImageDetails",profileImageDetails)
//     try {
//       const response = await updateProfieImageApi(profileImageDetails)
//       console.log(response)
//       return response
//     } catch (error:any) {
//       return rejectWithValue(error.message);
//     }
//   }
// )
// Fix the async thunk's return type
export const updateProfileImage = createAsyncThunk<
  string,
  { userId: string, profileImageUrl: string },
  { rejectValue: string }
>(
  'user/profileImage',
  async ({ userId, profileImageUrl }, { rejectWithValue }) => {
    try {
      const response = await updateProfileImageApi(userId, profileImageUrl);
      return response;
    } catch (error: any) {
      console.error("Error in updating profile image:", error.message);
      return rejectWithValue(error.message);
    }
  }
);




// export const updateTitleImage = createAsyncThunk<ImageUploadResponse, ImageUploadValues>(
//   'user/titleImage',
//   async(titleImageDetails, {rejectWithValue}) => {
//     try {
//       const response = await updateTitleImageApi(titleImageDetails)
//       console.log(response)
//       return response
//     } catch (error:any) {
//       return rejectWithValue(error.message);
//     }
//   }
// )
export const updateTitleImage = createAsyncThunk<
  string,
  { userId: string, titleImageUrl: string },
  { rejectValue: string }
>(
  'user/titleImage',
  async ({ userId, titleImageUrl }, { rejectWithValue }) => {
    try {
      const response = await updateTitleImageApi(userId, titleImageUrl);
      return response;
    } catch (error: any) {
      console.error("Error in updating title image:", error.message);
      return rejectWithValue(error.message);
    }
  }
);


export const clearUser = createAsyncThunk<void, void>(
  'user/clearUser',
  async (_, { dispatch }) => {
    dispatch(logout());
    Cookies.remove('UserAccessToken');
    Cookies.remove('UserRefreshToken');

  }
);


export const verifyResetOtp = createAsyncThunk<verifyResetOtpResponse, VerifyOtpPayload>(
  'user/verifyResetOtp',
  async (otpDetails, { rejectWithValue }) => {
    try {
      const response = await verifyResetOtpApi(otpDetails);
      return response;
    } catch (error: any) {
      console.log("Error in verify otp",error);
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {  // Removed unused dispatch parameter
    // Clear user data
    Cookies.remove('UserAccessToken');
    Cookies.remove('UserRefreshToken');
    
    // Optional: Disconnect sockets if applicable
    // socketService.disconnect();
    
    // Redirect to login
    window.location.href = '/login';
  }
);

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     logout(state) {
//       state.user = null;
//       state.status = 'idle';
//       state.error = null;
//       state.otpStatus = 'idle';
//       state.otpError = null;
//       state.email = null;
//     },
//   },
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Existing or new clear state method
    clearUserState(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.otpStatus = 'idle';
      state.otpError = null;
      state.email = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'idle';
        // state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as any || 'Signup failed';
      })
      // Handle OTP verification actions
      .addCase(verifyOtp.pending, (state) => {
        state.otpStatus = 'loading';
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpStatus = 'succeeded';
        state.otpError = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.otpError = action.payload as string || 'Failed to verify OTP';
      })
      // Handle Login actions
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as any || 'Login failed';
      })
      // Handle Google signup actions
      .addCase(googleAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action: PayloadAction<AuthenticatedUser>) => {
        console.log("googleAuth.fulfilled",action)
        state.status = 'idle';
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Google signup failed';
      })

      .addCase(updateUser.pending, (state)=>{
        state.status = 'loading'
        state.error = null
      })

      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UpdateUserResponse>) => {
        state.status = 'idle';
        state.user = action.payload.user; 
        state.error = null;
      })

      .addCase(updateUser.rejected, (state, action)=>{
        state.status = 'failed'
        state.error = action.payload as string || "User profile updation failed"
      })

  
      .addCase(updateProfileImage.pending, (state)=>{
        state.status = 'loading'
        state.error = null
      })

      // .addCase(updateProfieImage.fulfilled, (state, action: PayloadAction<ImageUploadResponse>) => {
      //   state.status = 'idle';
      //   if (state.user) {
      //     state.user.profileImage = action.payload.profileImageUrl;
      //   }
      //   state.error = null;
      // })
      .addCase(updateProfileImage.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'idle';
        if (state.user) {
          // Use the returned profile image URL directly
          state.user.profileImage = action.payload; // action.payload is now a string (profile image URL)
        }
        state.error = null;
      })
      .addCase(updateProfileImage.rejected, (state, action)=>{
        state.status = 'failed'
        state.error = action.payload as string || "User profile updation failed"
      })


      .addCase(updateTitleImage.pending, (state)=>{
        state.status = 'loading'
        state.error = null
      })

      // .addCase(updateTitleImage.fulfilled, (state, action: PayloadAction<ImageUploadResponse>) => {
      //   state.status = 'idle';
      //   if (state.user) {
      //     state.user.titleImage = action.payload.titleImageUrl;
      //   }
      //   state.error = null;
      // })

      .addCase(updateTitleImage.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'idle';
        if (state.user) {
          state.user.titleImage = action.payload;
        }
        state.error = null;
      })

      .addCase(updateTitleImage.rejected, (state, action)=>{
        state.status = 'failed'
        state.error = action.payload as string || "User profile updation failed"
      })
      //confirm email
      .addCase(confirmMail.fulfilled, (state, action: PayloadAction<ConfirmMailResponse>) => {
        state.status = 'idle';
        state.error = null;
        state.email = action.payload.email; 
      })
      .addCase(confirmMail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Email confirmation failed';
      })

      .addCase(verifyResetOtp.fulfilled, (state, action: PayloadAction<verifyResetOtpResponse>) => {
        state.otpStatus = 'succeeded';
        state.otpError = null;
        state.email = action.payload.email; 
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.otpError = action.payload as string || 'Failed to verify OTP';
      })

      //update password
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// export const { logout } = userSlice.actions;
export const { clearUserState } = userSlice.actions;


// export const selectUser = (state: { user: UserState }) => state.auth.user;
// export const selectStatus = (state: { user: UserState }) => state.user.status;
// export const selectError = (state: { user: UserState }) => state.user.error;
// export const selectOtpStatus = (state: { user: UserState }) => state.user.otpStatus;
// export const selectOtpError = (state: { user: UserState }) => state.user.otpError;
export const selectUser = (state: RootState) => state.auth.user;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectError = (state: RootState) => state.auth.error;
export const selectOtpStatus = (state: RootState) => state.auth.otpStatus;
export const selectOtpError = (state: RootState) => state.auth.otpError;

export default userSlice.reducer;
