import React, { useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { loginAdmin } from '../../Slices/adminSlice/adminSlice';


const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting, setStatus }: any) => {
    setStatus(null);
    const { email, password } = values;
    dispatch(loginAdmin({ email, password }))
      .unwrap()
      .then(() => {
        setStatus({ success: true });
      })
      .catch((error: any) => {
        setStatus({ success: false, error: error.message });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => {
            useEffect(() => {
              if (status?.success) {
                navigate('/admin/dashboard');
              }
            }, [status, navigate]);

            return (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {status?.error && <div className="text-red-500 text-sm mb-4">{status.error}</div>}

                <div className="mb-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    disabled={isSubmitting || status === 'loading'}
                  >
                    {isSubmitting || status === 'loading' ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
