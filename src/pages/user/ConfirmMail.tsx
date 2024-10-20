import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { confirmMail } from '../../Slices/userSlice/userSlice';
import { toast } from 'sonner';


const ConfirmMail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email Required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      const response = await dispatch(confirmMail({ email: values.email })).unwrap();
      toast.message("Confirm OTP")
      navigate('/otp', { state: { email: response.email, isPasswordReset: true, isSignup: false } });
    } catch (error: any) {
      toast.error(error.message || 'Email confirmation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('https://pro-theme.com/html/teamhost/assets/img/heading8.jpg')" }}>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex justify-center">
          <div className="w-5/6 text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
            <header className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
              <p className="text-[15px] text-slate-500">Confirm your email</p>
            </header>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMail;
