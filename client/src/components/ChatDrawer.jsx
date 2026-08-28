import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";

const ChatDrawer = ({ isOpen, onClose, bookingId, barberId, barberName, senderId }) => {
  const { backendURL, token } = useContext(AppContext);
  const socket = useContext(SocketContext); // Sockets global connection context fetch
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of the chat helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // HTTP call se chat history load load logic
  const loadChatHistory = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/user/messages/${bookingId}`,
        { headers: { token } }
      );
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadChatHistory();

    if (socket) {
      // Sockets event emit connection join room logic
      socket.emit("join_chat_room", bookingId);

      // Listening for incoming messages in real-time
      socket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [isOpen, socket, bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;

    const messageData = {
      senderId,
      receiverId: barberId,
      bookingId,
      text: inputValue.trim()
    };

    // Socket server call transmit trigger
    socket.emit("send_message", messageData);
    setInputValue("");
  };

  if (!isOpen) return null;

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : "Q";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop area click closes drawer */}
      <div className="flex-grow h-full" onClick={onClose}></div>

      {/* Main sliding chat window panel */}
      <div className="w-full max-w-md h-full bg-[#0b0f19]/95 backdrop-blur-lg border-l border-white/10 flex flex-col shadow-[0_0_50px_rgba(236,72,153,0.12)] animate-slideLeft text-white">
        
        {/* Header section */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-sm font-extrabold text-white shadow-md">
              {getInitials(barberName)}
            </div>
            <div>
              <h3 className="text-white font-extrabold text-base tracking-wide">{barberName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase">Live Connection</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full border border-white/10 hover:border-pink-500/30 text-gray-400 hover:text-white hover:rotate-90 hover:bg-white/5 transition-all duration-300 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Messages display message area list */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950/20 to-black/20">
          {messages.length > 0 ? (
            messages.map((msg, i) => {
              const isMe = msg.senderId === senderId;
              return (
                <div key={i} className={`flex gap-2 items-end ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-extrabold text-pink-400 shadow-sm flex-shrink-0">
                      {getInitials(barberName)}
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] leading-relaxed border transition-transform hover:scale-[1.01] ${
                    isMe 
                      ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white border-pink-400/20 rounded-br-none" 
                      : "bg-white/10 text-gray-200 border-white/10 rounded-bl-none"
                  }`}>
                    <p className="break-words">{msg.text}</p>
                    <span className="block text-[8px] text-right opacity-60 mt-1.5 font-medium">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
              <svg className="w-12 h-12 text-pink-500/30 mb-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p className="text-sm font-semibold text-white/80">No messages yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Ask {barberName} about styling recommendations or updates!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box bottom section */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your styling queries here..."
            className="flex-grow bg-[#141b2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 shadow-inner placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-[1.02] text-white font-bold rounded-xl text-sm shadow-md active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatDrawer;
