import React, { useState, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { verifyOtp, verifyResetOtp } from '../../Slices/userSlice/userSlice'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface LocationState {
  email: string;
  isSignup?: boolean;
  isPasswordReset?: boolean;
}

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(false);
  console.log("otp page")
  const initialValues = {
    otp: ''
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const email = state?.email;
  const isSignup = state?.isSignup;
  const isPasswordReset = state?.isPasswordReset;

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required('OTP is required')
      .length(4, 'OTP must be exactly 4 digits')
      .matches(/^[0-9]{4}$/, 'OTP must be exactly 4 digits')
  });


    useEffect(() => {
    console.log('Location state:', location.state); 
    console.log('Email:', email);
    console.log('Is Signup:', isSignup);
    console.log('Is Password Reset:', isPasswordReset);

    // Rest of the useEffect code
  }, [email, isSignup, isPasswordReset]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number, setFieldValue: (field: string, value: any) => void) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setFieldValue('otp', newOtp.join(''));

      if (index < 3 && e.target.nextElementSibling instanceof HTMLInputElement) {
        e.target.nextElementSibling.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number, setFieldValue: (field: string, value: any) => void) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      setFieldValue('otp', newOtp.join(''));

      // Focus previous input box
      if (index > 0 && (e.target as HTMLInputElement).previousElementSibling instanceof HTMLInputElement) {
        ((e.target as HTMLInputElement).previousElementSibling as HTMLInputElement).focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (/^[0-9]{4}$/.test(text)) {
      setOtp(text.split(''));
      setFieldValue('otp', text);
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('#otp-form input[type="text"]') as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      input.addEventListener('focus', (e) => (e.target as HTMLInputElement).select());
    });
  
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          setIsVerifyDisabled(true); 
          toast.warning("Otp expired! Resend to get new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, []); 
  
  const handleSubmit = async (otp: string) => {
    try {      
      
      if (isSignup) {
        console.log('Signup', email, otp)
        await dispatch(verifyOtp({ email, otp })).unwrap();
        toast.success("Signup successfull. Login to continue!")
        navigate('/login');
      } else if (isPasswordReset) {
        console.log('Password', email, otp)
        const response = await dispatch(verifyResetOtp({ email, otp })).unwrap();
        toast.success("Otp verified successfully")
        navigate('/reset-password', { state: { email: response.email, isPasswordReset: true, isSignup: false } }); 
      }
    } catch (error: any) {
      console.log('error',error)
      toast.error(error.message || 'An error occured')
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_USER_SERVICE_API_URL}/resend-otp`, { email });
      setTimer(60);
      setIsResendDisabled(true);
      setIsVerifyDisabled(false); // Enable the verify button

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            setIsVerifyDisabled(true); // Disable the verify button
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to resend OTP', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('https://pro-theme.com/html/teamhost/assets/img/heading8.jpg')" }}>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex justify-center">
          <div className="w-5/6 text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
            <header className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
              <p className="text-[15px] text-slate-500">
                Enter the 4-digit verification code that was sent to your email.
              </p>
            </header>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values.otp)
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form id="otp-form">
                  <div className="flex items-center justify-center gap-7">
                    {otp.map((data, index) => (
                      <Field
                        key={index}
                        type="text"
                        name={`otp[${index}]`}
                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        maxLength={1}
                        value={data}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index, setFieldValue)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index, setFieldValue)}
                        onPaste={(e: ClipboardEvent<HTMLInputElement>) => handlePaste(e, setFieldValue)}
                      />
                    ))}
                  </div>
                  <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-2" />
                  <div className="max-w-[260px] mx-auto mt-4">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                      disabled={isSubmitting || isVerifyDisabled}
                    >
                      Verify Account
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="text-sm text-slate-500 mt-4">
              <p>
                Resend OTP in {timer}s
              </p>
              <button
                className={`font-medium ${isResendDisabled ? 'text-gray-400' : 'text-indigo-500 hover:text-indigo-600'}`}
                onClick={handleResendOtp}
                disabled={isResendDisabled}
              >
                Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
