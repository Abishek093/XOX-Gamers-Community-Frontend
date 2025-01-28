// import {useState } from 'react';
// import { useSockets } from '../../../../src/context/socketContext';
// import { useSocket } from '../../../services/userServices/socketProvider';
// import { toast } from 'sonner'; // Import toast from sonner for notifications

const NotificationPanel = () => {
  // const { followRequests } = useSockets();
  // const [notifications, setNotifications] = useState<{ userId: string; followerId: string }[]>([]);

  // useEffect(() => {
  //   if (followRequests.length > 0) {
  //     const newRequests = followRequests.slice(notifications.length); // Get only the new follow requests
  //     setNotifications(prev => [...prev, ...newRequests]);
  //       console.log("new nortification", newRequests)
  //     // Display a toast for each new follow request
  //     newRequests.forEach(request => {
  //       toast.success(`You have a new follow request from ${request.followerId}`);
  //     });
  //   }
  // }, [followRequests]);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {/* {notifications.map((request, index) => (
          <li key={index}>
            <span>You have a new follow request from {request.followerId}</span>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default NotificationPanel;
