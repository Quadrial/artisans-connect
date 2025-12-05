import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiSend, FiUser, FiSearch, FiMoreVertical } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import useAuth from '../hooks/useAuth';
import { messageService } from '../services/messageService';
import { useSocket } from '../context/SocketContext';

interface Message {
  _id: string;
  sender: any;
  receiver: any;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  _id: string;
  participants: any[];
  lastMessage?: any;
  lastMessageAt: string;
  unreadCount: Map<string, number>;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = (user as any)?._id || user?.id;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message: Message) => {
      if (selectedConversation && 
          (message.sender._id === getOtherUser(selectedConversation)?._id || 
           message.sender._id === userId)) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      fetchConversations(); // Update conversation list
    });

    socket.on('messageSent', (message: Message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageSent');
    };
  }, [socket, selectedConversation, userId]);

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation: Conversation) => {
    try {
      const otherUser = getOtherUser(conversation);
      const result = await messageService.getMessages(otherUser._id);
      setMessages(result.messages);
      setSelectedConversation(conversation);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    const otherUser = getOtherUser(selectedConversation);

    try {
      if (socket && isConnected) {
        socket.emit('sendMessage', {
          receiverId: otherUser._id,
          senderId: userId,
          content: newMessage.trim(),
        });
      } else {
        await messageService.sendMessage(otherUser._id, newMessage.trim());
        fetchMessages(selectedConversation);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find((p: any) => {
      const participantId = p._id || p.id;
      return participantId !== userId;
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherUser(conv);
    const name = otherUser?.profile?.fullName || otherUser?.username || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Sidebar />
      <DashboardHeader />

      <main className="md:ml-64 h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-3">Messages</h1>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <FiMessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const unread = conversation.unreadCount?.get?.(userId) || 0;
                
                return (
                  <div
                    key={conversation._id}
                    onClick={() => fetchMessages(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        {otherUser?.profile?.profilePicture ? (
                          <img
                            src={otherUser.profile.profilePicture}
                            alt={otherUser.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {otherUser?.profile?.fullName || otherUser?.username}
                          </h3>
                          {unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                              {unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.content || 'Start a conversation'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {conversation.lastMessageAt && new Date(conversation.lastMessageAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {getOtherUser(selectedConversation)?.profile?.profilePicture ? (
                      <img
                        src={getOtherUser(selectedConversation).profile.profilePicture}
                        alt={getOtherUser(selectedConversation).username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {getOtherUser(selectedConversation)?.profile?.fullName || 
                       getOtherUser(selectedConversation)?.username}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {isConnected ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <FiMoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender._id === userId || message.sender.id === userId;
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h2>
                <p className="text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MessagesPage;
