import { io } from "socket.io-client";
import useUserStore from "../store/useUserStore";

let socket = null;

export const initializeSocket = () => {
    const user = useUserStore.getState().user;
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    if (!user?._id) {
        console.error("Cannot connect socket: user not logged in");
        return null;
    }

    if (!token) {
        console.error("Cannot connect socket: JWT token missing");
        return null;
    }

    // Reuse an existing connected socket
    if (socket?.connected) {
        return socket;
    }

    // Reconnect an existing socket
    if (socket) {
        socket.auth = { token };
        socket.connect();
        return socket;
    }

    const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";

    socket = io(BACKEND_URL, {
        auth: {
            token,
        },

        withCredentials: true,

        transports: ["websocket", "polling"],

        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("connected", (data) => {
        console.log("Authenticated socket:", data);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initializeSocket();
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
};