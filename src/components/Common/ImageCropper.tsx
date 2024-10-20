// import React, { useState, useCallback, useEffect } from 'react';
// import Cropper, { Area } from 'react-easy-crop';
// import { getCroppedImg } from './canvasUtils';

// interface ImageCropperProps {
//   imageSrc: string;
//   profile: boolean;
//   onCropComplete: (croppedImage: string) => void;
// }

// const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, profile, onCropComplete }) => {
//   const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState<number>(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
//   const [aspects, setAspects] = useState<number>(16 / 9)

//   const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const handleSave = useCallback(async () => {
//     if (imageSrc && croppedAreaPixels) {
//       const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
//       if (croppedImage) {
//         const base64String = await convertToBase64(croppedImage);
//         onCropComplete(base64String);
//       } else {
//         console.error('Cropped image is undefined');
//       }
//     }
//   }, [imageSrc, croppedAreaPixels, onCropComplete]);

//   const convertToBase64 = (blobUrl: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       fetch(blobUrl)
//         .then(response => response.blob())
//         .then(blob => {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             resolve(reader.result as string);
//           };
//           reader.onerror = reject;
//           reader.readAsDataURL(blob);
//         })
//         .catch(reject);
//     });
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col items-center justify-center">
//       <Cropper
//         image={imageSrc}
//         crop={crop}
//         zoom={zoom}
//         cropShape={profile ? "round" : "rect"}
//         aspect={profile ? 1 / 1 : 16 / 9}
//         onCropChange={setCrop}
//         onCropComplete={handleCropComplete}
//         onZoomChange={setZoom}
//         style={{
//           containerStyle: {
//             width: '100%',
//             height: '100%',
//           },
//         }}
//       />
//       <button
//         onClick={handleSave}
//         className="absolute bottom-4 bg-white text-black font-sans font-semibold py-2 px-4 rounded"
//       >
//         Save
//       </button>
//     </div>
//   );
// };

// export default ImageCropper;











// import React, { useState, useCallback, useEffect } from 'react';
// import Cropper, { Area } from 'react-easy-crop';
// import { getCroppedImg } from './canvasUtils';
// import Crop32Icon from '@mui/icons-material/Crop32';
// import CropDinIcon from '@mui/icons-material/CropDin';
// import DescriptionModal from './DescriptionModal';
// interface ImageCropperProps {
//   imageSrc: string;
//   profile: boolean;
//   aspectRatio: number;
//   setAspectRatio: (aspectRatio: number) => void;
//   onCropComplete: (croppedImage: string) => void;
//   isPost: boolean;
//   onDescriptionSubmit: (description: string, croppedImage: string | null) => void; // Add this line
// }


// const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, profile, aspectRatio, setAspectRatio, onCropComplete, isPost, onDescriptionSubmit }) => {
//   const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState<number>(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);

//   const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const handleSave = useCallback(async () => {
//     if (imageSrc && croppedAreaPixels) {
//       const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
//       if (croppedImage) {
//         const base64String = await convertToBase64(croppedImage);
//         setCroppedImage(base64String);
//         if (isPost) {
//           setIsModalOpen(true);
//         } else {
//           onCropComplete(base64String);
//         }
//       } else {
//         console.error('Cropped image is undefined');
//       }
//     }
//   }, [imageSrc, croppedAreaPixels, onCropComplete, isPost]);


//   const convertToBase64 = (blobUrl: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       fetch(blobUrl)
//         .then(response => response.blob())
//         .then(blob => {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             resolve(reader.result as string);
//           };
//           reader.onerror = reject;
//           reader.readAsDataURL(blob);
//         })
//         .catch(reject);
//     });
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col items-center justify-center">
//       <Cropper
//         image={imageSrc}
//         crop={crop}
//         zoom={zoom}
//         cropShape={profile ? "round" : "rect"}
//         aspect={aspectRatio}
//         onCropChange={setCrop}
//         onCropComplete={handleCropComplete}
//         onZoomChange={setZoom}
//         style={{
//           containerStyle: {
//             width: '100%',
//             height: '100%',
//           },
//         }}
//       />
//       {isPost && (
//         <div className="absolute bottom-24 left-5 flex flex-col ">
//           <button onClick={() => setAspectRatio(1020 / 400)} className="bg-gray-600 rounded-full p-2 py mb-2">
//             <Crop32Icon className="text-white" style={{ fontSize: '30px' }} />
//           </button>
//           <button onClick={() => setAspectRatio(700 / 400)} className="bg-gray-600 rounded-full p-2">
//             <CropDinIcon className="text-white" style={{ fontSize: '25px' }} />
//           </button>
//         </div>
//       )}

//       {isPost ? (
//         <>
//           <button className='absolute bottom-4 bg-white text-black font-sans font-semibold py-2 px-4 rounded' onClick={handleSave}>
//             Next
//           </button>
//           <DescriptionModal
//             isOpen={isModalOpen}
//             croppedImage={croppedImage} // Pass cropped image
//             onClose={() => setIsModalOpen(false)} // Add onClose handler
//             onSubmit={onDescriptionSubmit}
//           />
//         </>
//       ) : (
//         <>
//           <button
//             onClick={handleSave}
//             className="absolute bottom-4 bg-white text-black font-sans font-semibold py-2 px-4 rounded"
//           >
//             Save
//           </button>
//         </>
//       )}


//     </div>
//   );
// };

// export default ImageCropper;



// ImageCropper.tsx

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from './canvasUtils';
import Crop32Icon from '@mui/icons-material/Crop32';
import CropDinIcon from '@mui/icons-material/CropDin';
import DescriptionModal from './DescriptionModal';

interface ImageCropperProps {
  imageSrc: string;
  profile: boolean;
  aspectRatio: number;
  setAspectRatio: (aspectRatio: number) => void;
  onCropComplete: (croppedImage: string) => void;
  isPost: boolean;
  onDescriptionSubmit: (description: string, croppedImage: string | null) => void;  
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  profile,
  aspectRatio,
  setAspectRatio,
  onCropComplete,
  isPost,
  onDescriptionSubmit, 
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        const base64String = await convertToBase64(croppedImage);
        setCroppedImage(base64String);
        if (isPost) {
          setIsModalOpen(true);
        } else {
          // console.log(base64String)
          onCropComplete(base64String);
        }
      } else {
        console.error('Cropped image is undefined');
      }
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete, isPost]);

  const convertToBase64 = (blobUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        cropShape={profile ? 'round' : 'rect'}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
        style={{
          containerStyle: {
            width: '100%',
            height: '100%',
          },
        }}
      />
      {isPost && (
        <div className="absolute bottom-24 left-5 flex flex-col ">
          <button onClick={() => setAspectRatio(1020 / 400)} className="bg-gray-600 rounded-full p-2 py mb-2">
            <Crop32Icon className="text-white" style={{ fontSize: '30px' }} />
          </button>
          <button onClick={() => setAspectRatio(700 / 700)} className="bg-gray-600 rounded-full p-2">
            <CropDinIcon className="text-white" style={{ fontSize: '25px' }} />
          </button>
        </div>
      )}

      {isPost ? (
        <>
          <button
            className="absolute bottom-4 bg-white text-black font-sans font-semibold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Next
          </button>
          <DescriptionModal
            descriptionProps = {null}
            isOpen={isModalOpen}
            croppedImage={croppedImage}
            onClose={() => setIsModalOpen(false)} 
            onSubmit={onDescriptionSubmit} 
          />
        </>
      ) : (
        <>
          <button
            onClick={handleSave}
            className="absolute bottom-4 bg-white text-black font-sans font-semibold py-2 px-4 rounded"
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCropper;
