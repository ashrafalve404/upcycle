'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  productId?: string;
  productTitle?: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Sarah Johnson',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Thanks for your interest in my work!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
    productId: '1',
    productTitle: 'Vintage Oak Dresser',
  },
  {
    id: '2',
    participantId: '2',
    participantName: 'Mike Chen',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'I can definitely help with that restoration.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
  },
  {
    id: '3',
    participantId: '3',
    participantName: 'Emma Wilson',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Let me know if you have any questions!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', senderId: '1', text: 'Hi! I saw you were interested in my vintage dresser.', timestamp: new Date(Date.now() - 1000 * 60 * 60), read: true },
    { id: '2', senderId: 'me', text: 'Yes! It looks amazing. Is the wood in good condition?', timestamp: new Date(Date.now() - 1000 * 60 * 45), read: true },
    { id: '3', senderId: '1', text: 'Absolutely! I restored it myself. The oak is solid and the drawers work perfectly.', timestamp: new Date(Date.now() - 1000 * 60 * 35), read: true },
    { id: '4', senderId: 'me', text: 'Great! Can you tell me more about the restoration process?', timestamp: new Date(Date.now() - 1000 * 60 * 32), read: true },
    { id: '5', senderId: '1', text: 'Thanks for your interest in my work!', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false },
  ],
  '2': [
    { id: '1', senderId: 'me', text: 'Hi Mike! I have a leather bag that needs restoration.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), read: true },
    { id: '2', senderId: '2', text: 'Hello! I would be happy to help. Can you send me photos?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), read: true },
    { id: '3', senderId: 'me', text: 'Sure, I will upload them now.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2), read: true },
    { id: '4', senderId: '2', text: 'I can definitely help with that restoration.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: true },
  ],
  '3': [
    { id: '1', senderId: 'me', text: 'Hi Emma! Love your textile work.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), read: true },
    { id: '2', senderId: '3', text: 'Thank you so much! Let me know if you have any questions!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true },
  ],
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(c => 
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    // Mark as read
    setConversations(prev => prev.map(c => 
      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date(),
      read: true,
    };

    setMessages(prev => [...prev, message]);
    
    // Update conversation
    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id 
        ? { ...c, lastMessage: newMessage, lastMessageTime: new Date() }
        : c
    ));

    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-3 min-h-[600px]">
              {/* Conversations List */}
              <div className="border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="overflow-y-auto max-h-[550px]">
                  {filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation?.id === conversation.id ? 'bg-emerald-50 border-l-4 border-emerald-600' : ''
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          <Image 
                            src={conversation.participantAvatar} 
                            alt={conversation.participantName}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`font-medium truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {conversation.participantName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        {conversation.productTitle && (
                          <p className="text-xs text-emerald-600 truncate mt-0.5">
                            Re: {conversation.productTitle}
                          </p>
                        )}
                        <p className={`text-sm truncate mt-1 ${
                          conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                  
                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No conversations found
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <Image 
                          src={selectedConversation.participantAvatar} 
                          alt={selectedConversation.participantName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedConversation.participantName}</p>
                        {selectedConversation.productTitle && (
                          <p className="text-sm text-emerald-600">
                            Re: {selectedConversation.productTitle}
                          </p>
                        )}
                      </div>
                      <Link href={`/designers/${selectedConversation.participantId}`} className="ml-auto">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${
                            message.senderId === 'me' 
                              ? 'bg-emerald-600 text-white rounded-br-none' 
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          } rounded-2xl px-4 py-2`}>
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'me' ? 'text-emerald-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Button 
                          onClick={sendMessage}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={!newMessage.trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
