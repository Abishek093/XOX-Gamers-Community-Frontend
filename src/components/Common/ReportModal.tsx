import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../services/userServices/axiosInstance';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reportingReasons, setReportingReasons] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string>('');

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await axiosInstance.get('report-reasons');
        setReportingReasons(response.data);
      } catch (error) {
        console.error('Error fetching reporting reasons:', error);
      }
    };

    fetchReasons();
  }, []);

  const validationSchema = Yup.object({
    reason: Yup.string().required('Choose an option to continue'),
    otherReason: Yup.string().when('reason', {
      is: 'Other',
      then: (schema) => schema.required('Please specify your reason for reporting'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleSubmit = (values: { reason: string; otherReason?: string }) => {
    const reason = values.reason === 'Other' ? values.otherReason : values.reason;
    onSubmit(reason || '');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Reason for Reporting</h2>
            <Formik
              initialValues={{ reason: '', otherReason: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, handleChange }) => (
                <Form>
                  <div className="mb-4">
                    {reportingReasons.map((reason) => (
                      <div key={reason} className="flex items-center mb-2">
                        <Field
                          type="radio"
                          name="reason"
                          value={reason}
                          checked={values.reason === reason}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            handleReasonChange(reason);
                          }}
                          className="mr-2"
                        />
                        <label>{reason}</label>
                      </div>
                    ))}
                    {values.reason === 'Other' && (
                      <div className="mt-2">
                        <Field
                          name="otherReason"
                          as="textarea"
                          value={values.otherReason}
                          onChange={handleChange}
                          className="w-full p-2 border rounded"
                          rows={2}
                          placeholder="Specify your reason"
                        />
                        <ErrorMessage name="otherReason" component="div" className="text-red-500 text-sm" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="reason" component="div" className="text-red-500 text-sm" />

                  <div className="flex justify-end">
                    <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded mr-2" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-[#1f83ee] text-white rounded" disabled={isSubmitting}>
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportModal;
