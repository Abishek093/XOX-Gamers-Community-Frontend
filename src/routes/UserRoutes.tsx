import Signup from '../pages/user/Signup';
import OtpPage from '../pages/user/Otp';
import LoginPage from '../pages/user/Login';
import Home from '../pages/user/Home';
import Profile from '../pages/user/Profile';
import ConfirmMail from '../pages/user/ConfirmMail';
import ConfirmPassword from '../pages/user/ConfirmPassword';
import Friends from '../pages/user/Friends';
import CommunityList from '../pages/user/CommunityList';
import Community from '../pages/user/Community';
import SettingsPage from '../pages/user/SettingsPage';
import LoadingPage from '../components/Common/LoadingPage';
import ChatPage from '../pages/user/ChatPage';
import NewsPage from '../pages/user/NewsPage';
import StreamingControl from '../pages/user/Streaming';
import Live from '../pages/user/Live';
import StreamViewPage from '../pages/user/StreamViewPage';
import SocketStatusChecker from '../pages/user/SocketStatusChecker';
import ExplorePage from '../components/User/Explore/ExplorePage';

const userRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:username",
    element: <Profile />,
  },
  {
    path: "friends",
    element: <Friends />,
  },
  {
    path: "community-list",
    element: <CommunityList />,
  },
  {
    path: "community/:communityId",
    element: <Community />,
  },
  {
    path: "settings",
    element: <SettingsPage />,
  },
  {
    path: "chats",
    element: <ChatPage />,
  },
  {
    path: "news",
    element: <NewsPage />,
  },
  {
    path: "streams",
    element: <StreamingControl />
  },
  {
    path: "go-live",
    element: <Live />
  },
  {
    path: "loading",
    element: <LoadingPage />,
  },
  {
    path: "streams/stream/:streamId",
    element: <StreamViewPage />,
  },
  {
    path: "socket",
    element: <SocketStatusChecker />,
  },
  {
    path: "explore",
    element: <ExplorePage />,
  },
];

const userPublicRoutes = [
  {
    path: 'signup',
    element: <Signup />,
  },
  {
    path: 'otp',
    element: <OtpPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'confirm-mail',
    element: <ConfirmMail />,
  },
  {
    path: 'reset-password',
    element: <ConfirmPassword />,
  },
];

export { userRoutes, userPublicRoutes };
