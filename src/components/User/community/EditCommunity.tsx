import React, { useState } from 'react';
import axiosInstance from '../../../services/userServices/axiosInstance';
import { toast } from 'sonner';
import ImageUploadModal from '../../Common/ImageUploadModal';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../../context/LoadingContext';

interface EditCommunityProps {
  community: {
    _id: string;
    name: string;
    description?: string;
    postPermission: 'admin' | 'anyone';
    image?: string;
  };
  onCommunityUpdate: (updatedCommunity: any) => void;
  // onCommunityDelete: () => void; // Callback for handling the community deletion
}

const EditCommunity: React.FC<EditCommunityProps> = ({ community, onCommunityUpdate }) => {
  const [communityName, setCommunityName] = useState(community.name);
  const [description, setDescription] = useState(community.description || '');
  const [postPermission, setPostPermission] = useState(community.postPermission);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');
  const navigate = useNavigate()
  const { setLoading } = useLoading();

  const handleImageUpload = (croppedImage: string) => {
    const base64String = croppedImage.split(',')[1];
    setUploadedImage(base64String);
    setImageUploadModal(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData: any = {};
  
      if (communityName !== community.name) updateData.name = communityName;
      if (description !== (community.description || '')) updateData.description = description;
      if (postPermission !== community.postPermission) updateData.postPermission = postPermission;
      if (uploadedImage !== community.image) updateData.image = uploadedImage;
      if (Object.keys(updateData).length > 0) {
        const response = await axiosInstance.patch(`update-community/${community._id}`, updateData);
  
        if (response.status === 200) {
          toast.success('Community updated successfully');
          onCommunityUpdate(response.data);
          navigate(`/community/${community._id}`);
        }
      } else {
        toast.info('No changes to update.');
      }
    } catch (error: any) {
      console.error('Failed to update community:', error);
      toast.error('Failed to update community');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const normalizedConfirmName = confirmDeleteName.trim();
      const normalizedCommunityName = community.name.trim();

      if (normalizedConfirmName !== normalizedCommunityName) {
        toast.error('Community name does not match. Please try again.');
        return;
      }

      const response = await axiosInstance.delete(`delete-community/${community._id}`);

      toast.success('Community deleted successfully');
      navigate('/community-list')
      // onCommunityDelete();

    } catch (error: any) {
      console.error('Failed to delete community:', error);
      toast.error('Failed to delete community');
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-xl bg-white transform transition-transform duration-300">
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="communityName">
          Community Name
        </label>
        <input
          id="communityName"
          className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="communityDescription">
          Description
        </label>
        <textarea
          id="communityDescription"
          className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <p className="block text-gray-700 font-semibold mb-4">Who can add posts?</p>
        <div className="flex items-center space-x-8">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="postPermission"
              value="admin"
              className="form-radio text-purple-600 focus:ring-purple-500"
              checked={postPermission === 'admin'}
              onChange={() => setPostPermission('admin')}
            />
            <span className="ml-2 text-gray-700">Admin</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="postPermission"
              value="anyone"
              className="form-radio text-purple-600 focus:ring-purple-500"
              checked={postPermission === 'anyone'}
              onChange={() => setPostPermission('anyone')}
            />
            <span className="ml-2 text-gray-700">Anyone</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Community Image</label>

        <div className="flex items-center">
          <button
            onClick={() => setImageUploadModal(true)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            Choose File
          </button>
          {imageUploadModal && (
            <ImageUploadModal
              isOpen={imageUploadModal}
              profile={true}
              onClose={() => setImageUploadModal(false)}
              onSubmit={handleImageUpload}
              isPost={false}
            />
          )}
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
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <button
          className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 transform transition-transform duration-300 hover:scale-105"
          onClick={handleSubmit}
        >
          Save Changes
        </button>

        <button
          className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transform transition-transform duration-300 hover:scale-105"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete Community
        </button>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Community</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this community? If so, please type <strong>{community.name}</strong> to confirm.
            </p>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={`Type "${community.name}" to confirm`}
              value={confirmDeleteName}
              onChange={(e) => setConfirmDeleteName(e.target.value)}
            />
            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => { setDeleteModalOpen(false), setConfirmDeleteName('') }}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCommunity;
