import React, { useEffect, useState } from 'react';
import adminAxiosInstance from '../../../src/services/adminServices/adminAxiosInstance';

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAxiosInstance.get(`/users`, {
          params: { page: currentPage, limit: usersPerPage }
        });

        setUsers(response.data.users);
        setTotalUsers(response.data.total);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const toggleBlockUser = async (userId: string) => {
    try {
      const response = await adminAxiosInstance.patch(`/users/${userId}/block`);
      setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: response.data.isBlocked } : user));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-center">User Name</th>
                  <th className="py-2 px-4 border-b text-center">Email</th>
                  <th className="py-2 px-4 border-b text-center">Status</th>
                  <th className="py-2 px-4 border-b text-center">Action</th>
                </tr>
              </thead>
              {users.length > 0 ? (
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="py-2 px-4 border-b text-center">{user.username}</td>
                      <td className="py-2 px-4 border-b text-center">{user.email}</td>
                      <td className="py-2 px-4 border-b text-center">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                          onClick={() => toggleBlockUser(user._id)}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
            <div className="flex justify-center items-center p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
