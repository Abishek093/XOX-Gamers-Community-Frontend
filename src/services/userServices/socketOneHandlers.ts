
// export const setupSocketOneEvents = (socket: ReturnType<typeof io>) => {
//   socket.on("connect", () => {
//     console.log(`Socket connected to service one with ID: ${socket.id}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket from service one disconnected");
//   });

//   // Add other events for newSocketOne here if needed

//   return () => {
//     socket.off("connect");
//     socket.off("disconnect");
//     console.log("Cleaned up Socket One events");
//   };
// };
