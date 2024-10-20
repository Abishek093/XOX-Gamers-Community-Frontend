import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface DescriptionModalProps {
  descriptionProps: string | null
  isOpen: boolean;
  croppedImage: string | null;
  onClose: () => void;
  onSubmit: (description: string, croppedImage: string | null) => void; 
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ descriptionProps, isOpen, croppedImage, onClose, onSubmit }) => {
  const [description, setDescription] = useState<string>(descriptionProps || '');
  const [wordCount, setWordCount] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit(description, croppedImage); 
    onClose();
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    setWordCount(text.split(/\s+/).filter(Boolean).length); 
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative w-1/2 h-3/4 bg-white rounded-lg p-4 flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-black" onClick={onClose}>
          <CloseIcon />
        </button>
        {/* {croppedImage && (
          <img src={croppedImage} alt="Cropped" className="w-full h-auto rounded-sm mb-4" />
        )} */}
        {croppedImage && (
          <div className="mb-6 flex justify-center">
            <img
              src={croppedImage}
              alt="Cropped"
              className="max-w-full max-h-96 rounded-lg shadow-md"
            />
          </div>
        )}
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add a description..."
          rows={6}
          className="w-full p-2 h-16 border border-gray-300 rounded-md mb-4"
        />
        <button
          className="absolute bottom-4 bg-white text-black font-sans font-semibold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  ) : null;
};

export default DescriptionModal;
