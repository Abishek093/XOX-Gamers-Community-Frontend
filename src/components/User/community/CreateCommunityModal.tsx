  import React, { useState } from 'react';
  import { Button } from '@mui/material';
  import ImageUploadModal from '../../Common/ImageUploadModal';

  interface CreateCommunityModalProps {
    onClose: () => void;
    onSubmit: (communityName: string, description: string, postPermission: string, uploadedImage: string | null) => void;
  }

  const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onClose, onSubmit }) => {
    const [communityName, setCommunityName] = useState('');
    const [description, setDescription] = useState('');
    const [postPermission, setPostPermission] = useState('admin'); // Set default to "admin"
    const [error, setError] = useState('');
    const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleImageUpload = (croppedImage: string) => {
      const base64String = croppedImage.split(",")[1];
      setUploadedImage(base64String);
      setIsImageUploadOpen(false);
    };

    const handleSubmitClick = () => {
      onSubmit(communityName, description, postPermission, uploadedImage);
    };

    return (
      <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative bg-white w-11/12 md:w-3/5 lg:w-2/5 p-8 rounded-xl shadow-2xl z-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create a Community</h2>
          <button
            className="text-gray-600 hover:text-gray-800 text-3xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="communityName">
              Community Name
            </label>
            <input
              id="communityName"
              className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-indigo-500 transition-colors duration-300"
              placeholder="Enter your community name"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="communityDescription">
              Description
            </label>
            <textarea
              id="communityDescription"
              className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-indigo-500 transition-colors duration-300"
              placeholder="Enter the group description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-700 text-sm font-bold mb-2">Choose who can add posts:</p>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="postPermission"
                  value="admin"
                  className="form-radio text-indigo-600"
                  checked={postPermission === 'admin'}
                  onChange={(e) => setPostPermission(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Admin</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="postPermission"
                  value="anyone"
                  className="form-radio text-indigo-600"
                  checked={postPermission === 'anyone'}
                  onChange={(e) => setPostPermission(e.target.value)}
                />
                <span className="ml-2 text-gray-700">All users</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <Button
              onClick={() => setIsImageUploadOpen(true)}
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, rgba(72, 85, 99, 1) 0%, rgba(58, 66, 86, 1) 100%)',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '8px',
                padding: '12px 24px',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, rgba(58, 66, 86, 1) 0%, rgba(72, 85, 99, 1) 100%)',
                },
              }}
            >
              Upload Community Image
            </Button>
            {uploadedImage && (
              <div className="mt-6">
                <img
                  src={`data:image/jpeg;base64,${uploadedImage}`}
                  alt="Uploaded Community"
                  className="w-40 h-40 object-cover rounded-lg shadow-md border-2 border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 transition-colors duration-300 focus:outline-none"
              onClick={handleSubmitClick}
            >
              Create Community
            </button>
          </div>
        </div>

        {/* Image Upload Modal */}
        <ImageUploadModal
          isOpen={isImageUploadOpen}
          profile={true}  // 1:1 aspect ratio
          onClose={() => setIsImageUploadOpen(false)}
          onSubmit={handleImageUpload}
          isPost={false}
        />
      </div>
    );
  }

  export default CreateCommunityModal;
