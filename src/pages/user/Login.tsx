import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { loginUser, googleAuth } from '../../Slices/userSlice/userSlice';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'; // Assuming you're using lucide-react for icons

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email required'),
    password: Yup.string().required('Password required'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting, setStatus }: any) => {
    setStatus(null);
    const { email, password } = values;
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        setStatus({ success: true });
        toast.success('Login Successfull')
        setTimeout(() => navigate('/'), 1000);
      })
      .catch((error: any) => {
        setStatus({ success: false, error: error.message });
        toast.error(error.message)
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const googleLoginDetails = {
          userId: user.uid,
          email: user.email!,
          username: user.displayName!,
          profileImage: user.photoURL!,
        };
        console.log("googleLoginDetails in login page:", googleLoginDetails);

        dispatch(googleAuth(googleLoginDetails))
          .unwrap()
          .then(() => {
            toast.success('Google login successfull')
            setTimeout(() => navigate('/'), 1000);
          })
          .catch((error: any) => {
            toast.error(error.message)
          });
      })
      .catch((error) => {
        toast.error('Google sign-in error: ' + error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('https://pro-theme.com/html/teamhost/assets/img/heading8.jpg')" }}
    >
      <div className="bg-zinc-900 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-4">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4 relative">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="border border-gray-300 p-2 rounded-lg w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  disabled={isSubmitting || status === 'loading'}
                >
                  {isSubmitting || status === 'loading' ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="mb-4">
          <button
            onClick={handleGoogleLogin}
            className="bg-red-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login with Google
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 pt-5">
            Don't have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => navigate('/signup')}>Sign up</a>
          </p>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 pt-2">
            <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => navigate('/confirm-mail')}>Forget Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;