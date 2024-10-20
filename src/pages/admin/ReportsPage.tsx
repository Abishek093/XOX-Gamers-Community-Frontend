import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';  

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"ignore" | "delete" | null>(null);
  const reportsPerPage = 5;

  useEffect(() => {
    const handleReportFetch = async () => {
      try {
        const fetchReport = await axios.get('http://localhost:3000/admin/fetch-reports');
        setReports(fetchReport.data.results);
        console.log(fetchReport);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    handleReportFetch();
  }, []);

  const openModal = (report: any) => {
    setSelectedReport(report);
    setModalIsOpen(true);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedReport(null);
  };

  const openConfirmModal = (action: "ignore" | "delete") => {
    setConfirmAction(action);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
    setConfirmAction(null);
  };

  const handleIgnore = async () => {

    // Placeholder function for ignoring the report
    console.log("Ignoring report for post:", selectedReport.post._id);
    await axios.patch(`http://localhost:3000/admin/resolve-report/${selectedReport.post._id}`)
    closeConfirmModal();
    closeModal();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/admin/delete-post/${selectedReport.post._id}`);
      console.log('Delete response:', response.data); 
      closeConfirmModal();
      closeModal();
    } catch (error) {
      console.error('Error deleting post:', error); 
    }
  };
  

  const totalPages = Math.ceil((selectedReport?.reports.length || 0) / reportsPerPage);
  const displayedReports = selectedReport?.reports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 font-mono">Reports</h1>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-purple-400 to-blue-600 text-white text-sm leading-normal font-mono font-bold">
            <th className="py-3 px-6 text-left">Image</th>
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-center">Report Count</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light font-mono font-bold">
          {reports.map((report, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition ease-in-out duration-150">
              <td className="py-3 px-6">
                <img 
                  src={report.post.content} 
                  alt={report.post.title} 
                  className="w-16 h-16 rounded-lg shadow-md object-cover" 
                />
              </td>
              <td className="py-3 px-4">{report.post.title}</td>
              <td className="py-3 px-8 text-center">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  report.reportCount > 5 ? 'bg-red-400 text-gray-700 font-extrabold' : 'bg-yellow-400 text-gray-800'
                }`}>
                  {report.reportCount}
                </span>
              </td>
              <td className="py-3 px-6">
                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                  report.reportCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {report.reportCount > 0 ? 'Reported' : 'Clear'}
                </span>
              </td>
              <td className="py-3 px-6">
                <button 
                  onClick={() => openModal(report)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition ease-in-out duration-150 shadow-md"
                >
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReport && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Report Details"
          className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <button 
            onClick={closeModal} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>

          <img src={selectedReport.post.content} alt="" className="mb-4 rounded-lg shadow-md"/>
          <h2 className="text-2xl font-bold mb-4 font-mono">{selectedReport.post.title}</h2>
          <p className="mb-4 font-mono">{selectedReport.post.description}</p>

          <table className="min-w-full bg-gray-100 rounded-lg shadow-md overflow-hidden mb-4">
            <thead>
              <tr className="bg-gray-200 text-gray-700 font-mono font-bold">
                <th className="py-2 px-4 text-left">User ID</th>
                <th className="py-2 px-4 text-left">Reason</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 font-mono">
              {displayedReports.map((report: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4">{report.reporterId}</td>
                  <td className="py-2 px-4">{report.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-mono">{`Page ${currentPage} of ${totalPages}`}</span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="flex justify-between">
            <button 
              onClick={() => openConfirmModal("ignore")} 
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition ease-in-out duration-150"
            >
              Ignore
            </button>
            <button 
              onClick={() => openConfirmModal("delete")} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ease-in-out duration-150"
            >
              Delete Post
            </button>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {confirmModalIsOpen && (
        <Modal
          isOpen={confirmModalIsOpen}
          onRequestClose={closeConfirmModal}
          contentLabel="Confirm Action"
          className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <h2 className="text-xl font-bold mb-4 font-mono">
            {confirmAction === "ignore" ? "Ignore Report?" : "Delete Post?"}
          </h2>
          <p className="mb-4 font-mono">
            {confirmAction === "ignore" ? 
              "Are you sure you want to ignore this report? This action cannot be undone." : 
              "Are you sure you want to delete this post? This action cannot be undone."
            }
          </p>

          <div className="flex justify-between">
            <button 
              onClick={confirmAction === "ignore" ? handleIgnore : handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ease-in-out duration-150"
            >
              Confirm
            </button>
            <button 
              onClick={closeConfirmModal} 
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ease-in-out duration-150"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ReportsPage;
