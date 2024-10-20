import React from 'react'
import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateCommunityModal from './CreateCommunityModal';

interface CommunityListTitleCardPorps {
    isModalOpen : boolean
    setIsModalOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const CommunityListTitleCard: React.FC <CommunityListTitleCardPorps> = ({isModalOpen, setIsModalOpen}) => {
    const titleImageUrl = 'https://img.freepik.com/free-vector/earth-view-night-from-alien-planet-neon-space_33099-1876.jpg?ga=GA1.1.1355158502.1721899147&semt=ais_hybrid'; // updated image link
  return (
    <div 
      className="flex flex-col w-full h-48 justify-center items-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${titleImageUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="text-white text-2xl font-bold font-serif mb-4 relative z-10">
        Community Directory
      </div>
      <Button 
        onClick={()=>{setIsModalOpen(true)}}
        variant="contained" 
        color="primary" 
        startIcon={<AddCircleIcon />} 
        sx={{
          backgroundColor: '#ffffff', 
          color: '#000', 
          fontWeight: 'bold', 
          borderRadius: '8px',
          zIndex: 10,
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        Create a Community
      </Button>
    </div>
  )
}

export default CommunityListTitleCard
