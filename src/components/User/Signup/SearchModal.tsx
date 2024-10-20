import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import axiosInstance from '../../../services/userServices/axiosInstance';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState<string>('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setIsUsernameAvailable(null);
    }
  }, [isOpen]);

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      console.log("khjfgdjkfh",username)
      try {
        const response = await axiosInstance.get(`/check-username?username=${username}`);
        setIsUsernameAvailable(response.data.available);
      } catch (error) {
        console.error('Error checking username availability', error);
      }
    }, 500),
    []
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    console.log(newUsername)
    setUsername(newUsername);
    setIsUsernameAvailable(null);
    checkUsernameAvailability(newUsername);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameAvailable) {
      onSubmit(username);
      onClose();
    }
  };


  return (
    isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Choose a unique username</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold mb-1">New Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter a unique username"
                required
              />
              {isUsernameAvailable === false && (
                <div className="text-red-500 text-sm mt-1">Username already taken</div>
              )}
              {isUsernameAvailable === true && (
                <div className="text-green-500 text-sm mt-1">Username is available</div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                disabled={!isUsernameAvailable}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
};

export default SearchModal;
