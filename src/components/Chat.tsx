
import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number | string;
  user: string;
  message: string;
  timestamp: number;
}

interface ChatProps {
  roomId: string;
  username: string;
}

const Chat = ({ roomId, username = 'You' }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Connect to the server
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);
    
    // Join the chat room
    socketInstance.emit('joinRoom', roomId);
    
    // Welcome message
    setMessages([{
      id: Date.now(),
      user: 'QuizMaster',
      message: 'Welcome to the chat!',
      timestamp: Date.now()
    }]);
    
    // Listen for incoming messages
    socketInstance.on('message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;
    
    const messageData = {
      roomId,
      user: username,
      message: newMessage.trim()
    };
    
    // Emit message to server
    socket.emit('chatMessage', messageData);
    
    setNewMessage('');
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4 mb-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 ${msg.user === username ? 'justify-end' : ''}`}
            >
              {msg.user !== username && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-quiz-primary text-white text-xs">
                    {msg.user.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`${msg.user === username ? 'bg-quiz-primary text-white' : 'bg-muted'} px-3 py-2 rounded-lg max-w-[80%]`}>
                {msg.user !== username && (
                  <div className="font-semibold text-xs">{msg.user}</div>
                )}
                <p className="text-sm">{msg.message}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
              {msg.user === username && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-quiz-secondary text-white text-xs">
                    YOU
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          className="bg-quiz-primary hover:bg-quiz-secondary"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};

export default Chat;
