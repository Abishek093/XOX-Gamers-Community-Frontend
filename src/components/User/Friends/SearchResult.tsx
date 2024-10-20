// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// interface User {
//   id: string,
//   username: string,
//   displayName: string,
//   profileImage: string
// }

// interface SearchResultProps {
//   results: User[];
// }

// const SearchResult: React.FC<SearchResultProps> = ({ results }) => {
//     const navigate = useNavigate()

//     const viewProfile = (username: string) =>{            
//       navigate(`/${username}`)
//     }


//   return (
//     <div className='grid grid-cols-2 gap-4'>
//       {results.map((result) => (
//         <div key={result.id} className='bg-white rounded-md h-20 flex items-center justify-start px-5'>
//           <img
//             className="w-16 h-16 rounded-full object-contain"
//             src={result.profileImage || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1719396828~exp=1719400428~hmac=3992078a184c24bf98ee7b06afbab8f3bad2a1d00f616f2b7a906e219f974cb1&w=740"}
//             alt={result.username}
//           />
//           <div className='flex flex-col ml-4'>
//             <strong>{result.username}</strong>
//             <span>{result.displayName}</span>
//           </div>
//           <div className='ml-auto'>
//               <button onClick={()=>viewProfile(result.username)} className="bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100">
//                 View Profile
//               </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default SearchResult;


import React from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string,
  username: string,
  displayName: string,
  profileImage: string
}

interface SearchResultProps {
  results: User[];
  title: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ results, title }) => {
  const navigate = useNavigate();

  const viewProfile = (username: string) => {            
    navigate(`/${username}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className='grid grid-cols-2 gap-4'>
        {results.map((result) => (
          <div key={result.id} className='bg-white rounded-md h-20 flex items-center justify-start px-5'>
            <img
              className="w-16 h-16 rounded-full object-contain"
              src={result.profileImage || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1719396828~exp=1719400428~hmac=3992078a184c24bf98ee7b06afbab8f3bad2a1d00f616f2b7a906e219f974cb1&w=740"}
              alt={result.username}
            />
            <div className='flex flex-col ml-4'>
              <strong>{result.username}</strong>
              <span>{result.displayName}</span>
            </div>
            <div className='ml-auto'>
              <button onClick={() => viewProfile(result.username)} className="bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;