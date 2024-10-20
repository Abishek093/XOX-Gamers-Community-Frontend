// import React, { useState, useEffect } from 'react';
// import './LoadingPage.css';

// const LoadingPage: React.FC = () => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((oldProgress) => (oldProgress + 1) % 100);
//     }, 30);

//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   return (
//     <div className="loading-container">
//       <div className="controller-outline">
//         <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
//           <path 
//             d="M50,20 C20,20 10,50 10,60 C10,70 20,100 50,100 L150,100 C180,100 190,70 190,60 C190,50 180,20 150,20 Z
//                M60,20 V40 H140 V20 M40,60 A10,10 0 0,1 40,80 A10,10 0 0,1 40,60
//                M160,60 A10,10 0 0,1 160,80 A10,10 0 0,1 160,60
//                M120,70 A5,5 0 0,1 120,80 A5,5 0 0,1 120,70
//                M135,60 A5,5 0 0,1 135,70 A5,5 0 0,1 135,60"
//             className="controller-path"
//           />
//           <path 
//             d="M50,20 C20,20 10,50 10,60 C10,70 20,100 50,100 L150,100 C180,100 190,70 190,60 C190,50 180,20 150,20 Z
//                M60,20 V40 H140 V20 M40,60 A10,10 0 0,1 40,80 A10,10 0 0,1 40,60
//                M160,60 A10,10 0 0,1 160,80 A10,10 0 0,1 160,60
//                M120,70 A5,5 0 0,1 120,80 A5,5 0 0,1 120,70
//                M135,60 A5,5 0 0,1 135,70 A5,5 0 0,1 135,60"
//             className="loading-path"
//             strokeDasharray="800"
//             strokeDashoffset={800 - (progress / 100 * 800)}
//           />
//         </svg>
//       </div>
//       <p className="loading-text">Loading Gamers Hub...</p>
//     </div>
//   );
// };

// export default LoadingPage;



import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => (oldProgress + 1) % 100);
    }, 30);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="controller-outline">
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M50,20 C20,20 10,50 10,60 C10,70 20,100 50,100 L150,100 C180,100 190,70 190,60 C190,50 180,20 150,20 Z
               M60,20 V40 H140 V20 M40,60 A10,10 0 0,1 40,80 A10,10 0 0,1 40,60
               M160,60 A10,10 0 0,1 160,80 A10,10 0 0,1 160,60
               M120,70 A5,5 0 0,1 120,80 A5,5 0 0,1 120,70
               M135,60 A5,5 0 0,1 135,70 A5,5 0 0,1 135,60"
            className="controller-path"
          />
          <path 
            d="M50,20 C20,20 10,50 10,60 C10,70 20,100 50,100 L150,100 C180,100 190,70 190,60 C190,50 180,20 150,20 Z
               M60,20 V40 H140 V20 M40,60 A10,10 0 0,1 40,80 A10,10 0 0,1 40,60
               M160,60 A10,10 0 0,1 160,80 A10,10 0 0,1 160,60
               M120,70 A5,5 0 0,1 120,80 A5,5 0 0,1 120,70
               M135,60 A5,5 0 0,1 135,70 A5,5 0 0,1 135,60"
            className="loading-path"
            strokeDasharray="800"
            strokeDashoffset={800 - (progress / 20 * 800)}
          />
        </svg>
        <p className='p-2'>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;