import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/users');
        console.log(response.data);
        
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleBlockUser = async (userId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/admin/users/${userId}/block`);
      setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: response.data.isBlocked } : user));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

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
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
