import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/config/socket";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import toast from "react-hot-toast";

/**
 * Initialises Socket.io connection when user is logged in.
 * Handles incoming notifications and broadcasts.
 * Call once in App.jsx.
 */
export const useSocketInit = () => {
  const { user, accessToken } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!user || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(accessToken);

    // Real-time notification from server
    socket.on("notification:new", (notification) => {
      addNotification(notification);
      toast(notification.title, {
        icon: "🔔",
        duration: 5000,
        style: { maxWidth: "360px" },
      });
    });

    // Platform-wide broadcast
    socket.on("notification:broadcast", ({ title, message }) => {
      toast(`📢 ${title}: ${message}`, { duration: 8000 });
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:broadcast");
    };
  }, [user, accessToken]);
};

/**
 * Listen to a specific socket event.
 * Automatically cleans up on unmount or when deps change.
 */
export const useSocketEvent = (event, handler, deps = []) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const listener = (...args) => handlerRef.current(...args);
    socket.on(event, listener);

    return () => socket.off(event, listener);
  }, [event, ...deps]);
};

/**
 * Subscribe to a competition room and listen for leaderboard updates.
 */
export const useCompetitionSocket = (competitionId, onLeaderboardUpdate) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !competitionId) return;

    socket.emit("join:competition", competitionId);
    socket.on("leaderboard:update", onLeaderboardUpdate);

    return () => {
      socket.emit("leave:competition", competitionId);
      socket.off("leaderboard:update", onLeaderboardUpdate);
    };
  }, [competitionId]);
};

/**
 * Subscribe to a webinar chat room.
 */
export const useWebinarChat = (webinarId, onMessage) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !webinarId) return;

    socket.emit("join:webinar", webinarId);
    socket.on("webinar:message", onMessage);

    return () => {
      socket.emit("leave:webinar", webinarId);
      socket.off("webinar:message", onMessage);
    };
  }, [webinarId]);
};