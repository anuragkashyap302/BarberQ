import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";

// Customer ko dynamic real-time queue position and waiting time dikhane ke liye tracker component
const QueueTracker = ({ bookingId, barberId }) => {
  const { backendURL, token } = useContext(AppContext);
  const socket = useContext(SocketContext); // socket integration context retrieve
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // API endpoint se dynamic position details load logic
  const fetchQueuePosition = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/user/queue-position/${bookingId}`,
        { headers: { token } }
      );
      if (data.success) {
        setQueueInfo(data);
      }
    } catch (err) {
      console.error("Queue position fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueuePosition();

    if (socket && barberId) {
      // Room join command trigger
      socket.emit("join_barber_room", barberId);

      // Barber change event (like Complete next customer) listen updates
      socket.on("queue_update", () => {
        // console.log("Realtime queue changed. Re-fetching status...");
        fetchQueuePosition();
      });

      return () => {
        socket.off("queue_update");
      };
    }
  }, [socket, bookingId, barberId]);

  if (loading) {
    return <span className="text-xs text-gray-500 animate-pulse">Calculating queue position...</span>;
  }

  // Complete status bookings ya cancel bookings pe details tracker show nahi karenge
  if (!queueInfo || queueInfo.position === 0) {
    return null;
  }

  return (
    <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3.5 mt-2 space-y-1.5 animate-fadeIn">
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-pink-400 font-bold uppercase tracking-wider">Queue Tracker</span>
        <span className="text-gray-400">Status: {queueInfo.status}</span>
      </div>
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-white">Your Position:</span>
        <span className="text-pink-400 text-lg font-extrabold">#{queueInfo.position}</span>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>People Ahead:</span>
        <span className="text-white font-medium">{queueInfo.peopleAhead}</span>
      </div>
      {queueInfo.estimatedWaitTime > 0 && (
        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-white/5 pt-1.5 mt-1.5">
          <span>Est. Wait Time:</span>
          <span className="text-amber-400 font-bold">~{queueInfo.estimatedWaitTime} Mins</span>
        </div>
      )}
    </div>
  );
};

export default QueueTracker;
