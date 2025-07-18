import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import ConversationList from "../components/Message/ConversationList";
import ChatWindow from "../components/Message/ChatWindow";
import MessageInput from "../components/Message/MessageInput";
import api from "../api/api";
import fetchAllPaginatedData from "../api/fetchAllPaginatedData";

function MessagePage() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const wsRef = useRef(null);
  const baseWsUrl = import.meta.env.VITE_WS_BASE_URL;

  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchConversationList = async () => {
    try {
      const res = await fetchAllPaginatedData(`courses/`);
      setConversations(res);
    } catch (err) {
      console.log("Can't load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConvo) {
      return;
    }

    try {
      const res = await fetchAllPaginatedData(
        `courses/${selectedConvo}/messages/`
      );
      setMessages(res);
    } catch (err) {
      console.log("Can't load old messages", err);
    } finally {
      setLoading(false);
    }
  };

  const connectWS = () => {
    if (!selectedConvo) {
      return;
    }

    const accessToken = localStorage.getItem("access");

    const ws = new WebSocket(
      `${baseWsUrl}/${selectedConvo}/?token=${accessToken}`
    );

    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  };

  const handleSend = () => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && newMessage.trim()) {
      ws.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
    } else {
      console.warn("WebSocket not open or message empty");
    }
    setNewMessage("");
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    connectWS();
  }, [selectedConvo]);

  useEffect(() => {
    setLoading(true);
    fetchConversationList();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Messages</h2>
      <div className="row">
        <div className="col-md-4">
          <ConversationList
            conversations={conversations}
            selected={selectedConvo}
            onSelect={setSelectedConvo}
          />
        </div>
        <div className="col-md-8 d-flex flex-column">
          {selectedConvo ? (
            <>
              <ChatWindow messages={messages} currentUserId={user.id} />
              <MessageInput
                onSend={handleSend}
                onChange={setNewMessage}
                value={newMessage}
              />
            </>
          ) : (
            <div className="p-3 border rounded bg-light text-center">
              Select a conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagePage;
