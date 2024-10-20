// import React from 'react';
// import { FaGamepad, FaUserFriends, FaInfo, FaFileImage } from 'react-icons/fa';

// interface ProfileTabsProps {
//   setActiveTab: (tab: 'posts' | 'info' | 'friends' | 'groups') => void;
// }

// interface OwnProfileProps {
//   ownProfile: boolean;
// }

// interface CombinedProps extends ProfileTabsProps, OwnProfileProps {}

// const ProfileTabs: React.FC<CombinedProps> = ({ setActiveTab, ownProfile }) => {
//   console.log("ownProfile in ProfileTabs component:", ownProfile);
  
//   return (
//     <div className="bg-white drop-shadow-sm">
//       <div className="grid grid-cols-12 gap-2 text-gray font-sans text-center">
//         <button className="justify-self-center py-6 flex items-center" onClick={() => setActiveTab('posts')}>
//           <FaFileImage className="mr-2" /> Posts
//         </button>
//         {ownProfile && (
//           <>
//             <button className="justify-self-center py-6 flex items-center" onClick={() => setActiveTab('groups')}>
//               <FaGamepad className="mr-2" /> Groups
//             </button>
//             <button className="justify-self-center py-6 flex items-center" onClick={() => setActiveTab('friends')}>
//               <FaUserFriends className="mr-2" /> Friends
//             </button>
//             <button className="justify-self-center py-6 flex items-center" onClick={() => setActiveTab('info')}>
//               <FaInfo/> Info
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileTabs;
import React, { useState } from 'react';
import { FaFileImage, FaGamepad, FaUserFriends, FaInfo } from 'react-icons/fa';

interface ProfileTabsProps {
  setActiveTab: (tab: 'posts' | 'info' | 'friends' | 'groups') => void;
  ownProfile: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ setActiveTab, ownProfile }) => {
  const [activeTab, setActiveTabState] = useState<'posts' | 'info' | 'friends' | 'groups'>('posts');

  const handleTabClick = (tab: 'posts' | 'info' | 'friends' | 'groups') => {
    setActiveTab(tab);
    setActiveTabState(tab);
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: FaFileImage },
    { id: 'groups', label: 'Groups', icon: FaGamepad },
    { id: 'friends', label: 'Friends', icon: FaUserFriends },
    { id: 'info', label: 'Info', icon: FaInfo },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => (
          (ownProfile || tab.id === 'posts') && (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as 'posts' | 'info' | 'friends' | 'groups')}
              className={`flex-1 py-4 px-2 flex flex-col items-center transition-colors duration-300 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="text-xl mb-1" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;