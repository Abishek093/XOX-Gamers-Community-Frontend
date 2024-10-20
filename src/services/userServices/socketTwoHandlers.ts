// import { toast } from "sonner";

// export const setupSocketTwoEvents = (
//   socket: ReturnType<typeof io>,
//   ownUser: { id: string },
//   setFollowRequests: React.Dispatch<React.SetStateAction<{ userId: string; followerId: string }[]>>
// ) => {
//   socket.on("connect", () => {
//     console.log(`Socket connected to service two with ID: ${socket.id}`);
//   });

//   socket.on(
//     "followRequest",
//     ({
//       userId,
//       followerId,
//       followerUsername,
//       followerDisplayName,
//     }: {
//       userId: string;
//       followerId: string;
//       followerUsername: string;
//       followerDisplayName: string;
//     }) => {
//       if (ownUser?.id === userId) {
//         const displayName = followerDisplayName || followerUsername;
//         toast(`New follow request from ${displayName}`);
//         console.log(`New follow request from user ${followerId} (${displayName}) to user ${userId}`);

//         setFollowRequests((prevRequests) => [
//           ...prevRequests,
//           { userId, followerId },
//         ]);
//       }
//     }
//   );

//   socket.on(
//     "friendRequestAccepted",
//     ({
//       followerId,
//       userId,
//       username,
//       displayName,
//     }: {
//       followerId: string;
//       userId: string;
//       username: string;
//       displayName: string;
//     }) => {
//       if (ownUser?.id === followerId) {
//         const name = displayName || username;
//         toast(`${name} accepted your friend request`);
//         console.log(`User ${userId} (${name}) accepted your friend request`);
//       }
//     }
//   );

//   // Listen for the new comment notification
//   socket.on(
//     "newComment",
//     ({
//       postId,
//       postOwnerId,
//       commenterId,
//       commenterUsername,
//       commenterDisplayName,
//       comment,
//     }: {
//       postId: string;
//       postOwnerId: string;
//       commenterId: string;
//       commenterUsername: string;
//       commenterDisplayName: string;
//       comment: string;
//     }) => {
//       // Display notification only if the current user is the post owner and not the commenter
//       if (ownUser?.id === postOwnerId && ownUser?.id !== commenterId) {
//         const name = commenterDisplayName || commenterUsername;
//         toast(`${name} added a comment to your post`);
//         console.log(`New comment on your post by ${name}: ${comment}`);
//       }
//     }
//   );

//   socket.on(
//     "postLiked",
//     ({
//       postId,
//       likerId,
//       likerUsername,
//       likerDisplayName
//     }: {
//       postId: string;
//       likerId: string;
//       likerUsername: string;
//       likerDisplayName: string;
//     }) => {
//       const displayName = likerDisplayName || likerUsername;
//       toast(`${displayName} liked your post!`);
//       console.log(`User ${likerId} (${displayName}) liked your post with ID ${postId}`);
//     }
//   );

  
//   socket.on("disconnect", () => {
//     console.log("Socket from service two disconnected");
//   });

//   return () => {
//     socket.off("connect");
//     socket.off("followRequest");
//     socket.off("friendRequestAccepted");
//     socket.off("newComment"); // Cleanup the newComment event listener
//     socket.off("disconnect");
//     console.log("Cleaned up Socket Two events");
//   };
// };

import { toast } from "sonner";

export const setupSocketTwoEvents = (
  socket: ReturnType<typeof io>,
  ownUser: { id: string },
  setFollowRequests: React.Dispatch<React.SetStateAction<{ userId: string; followerId: string }[]>>
) => {
  socket.on("connect", () => {
    console.log(`Socket connected to service two with ID: ${socket.id}`);
  });

  socket.on(
    "followRequest",
    ({
      userId,
      followerId,
      followerUsername,
      followerDisplayName,
    }: {
      userId: string;
      followerId: string;
      followerUsername: string;
      followerDisplayName: string;
    }) => {
      if (ownUser?.id === userId) {
        const displayName = followerDisplayName || followerUsername;
        toast(`New follow request from ${displayName}`);
        console.log(`New follow request from user ${followerId} (${displayName}) to user ${userId}`);

        setFollowRequests((prevRequests) => [
          ...prevRequests,
          { userId, followerId },
        ]);
      }
    }
  );

  socket.on(
    "friendRequestAccepted",
    ({
      followerId,
      userId,
      username,
      displayName,
    }: {
      followerId: string;
      userId: string;
      username: string;
      displayName: string;
    }) => {
      if (ownUser?.id === followerId) {
        const name = displayName || username;
        toast(`${name} accepted your friend request`);
        console.log(`User ${userId} (${name}) accepted your friend request`);
      }
    }
  );

  // Listen for the new comment notification
  socket.on(
    "newComment",
    ({
      postId,
      postOwnerId,
      commenterId,
      commenterUsername,
      commenterDisplayName,
      comment,
    }: {
      postId: string;
      postOwnerId: string;
      commenterId: string;
      commenterUsername: string;
      commenterDisplayName: string;
      comment: string;
    }) => {
      // Display notification only if the current user is the post owner and not the commenter
      if (ownUser?.id === postOwnerId && ownUser?.id !== commenterId) {
        const name = commenterDisplayName || commenterUsername;
        toast(`${name} added a comment to your post`);
        console.log(`New comment on your post by ${name}: ${comment}`);
      }
    }
  );

  socket.on(
    "postLiked",
    ({
      postId,
      likerId,
      likerUsername,
      likerDisplayName
    }: {
      postId: string;
      likerId: string;
      likerUsername: string;
      likerDisplayName: string;
    }) => {
      const displayName = likerDisplayName || likerUsername;
      toast(`${displayName} liked your post!`);
      console.log(`User ${likerId} (${displayName}) liked your post with ID ${postId}`);
    }
  );


  // Emit follow community
  socket.on(
    "updateFollowerCount",
    ({
      communityId,
      followerCount,
    }: {
      communityId: string;
      followerCount: number;
    }) => {
      console.log(`Community ${communityId} now has ${followerCount} followers.`);
      toast(`Community ${communityId} follower count updated to ${followerCount}`);
    }
  );

  socket.on("disconnect", () => {
    console.log("Socket from service two disconnected");
  });

  return () => {
    socket.off("connect");
    socket.off("followRequest");
    socket.off("friendRequestAccepted");
    socket.off("newComment");
    socket.off("postLiked");
    socket.off("likePost");
    socket.off("unlikePost");
    socket.off("updateFollowerCount");
    socket.off("disconnect");
    console.log("Cleaned up Socket Two events");
  };
};
