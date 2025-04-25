
import { useState, useEffect, useRef } from "react";
import { ChatThread, ChatMessage } from "@/lib/data";
import { addMessageToThread, createChatThread, getChatThreads, saveChatThreads } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MathRenderer from "./MathRenderer";

interface AIChatProps {
  initialThreadId?: string;
}

const AIChat = ({ initialThreadId }: AIChatProps) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreadId || null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedThreads = getChatThreads();
    setThreads(loadedThreads);
    
    if (!activeThreadId && loadedThreads.length > 0) {
      setActiveThreadId(loadedThreads[0].id);
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeThreadId) return;
    
    // Add user message to thread
    addMessageToThread(activeThreadId, { content: newMessage, isUser: true });
    setNewMessage("");
    
    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, we would call an API to generate a response
      const simulatedResponse = `I'll help you with your question about "${newMessage.trim()}".\n\nThis would be the detailed explanation from the AI, potentially containing math formulas like $E = mc^2$ or chemical equations like $H_2O + CO_2 \\rightarrow H_2CO_3$.\n\nWe can also include more complex equations like:\n$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$`;
      
      addMessageToThread(activeThreadId, { content: simulatedResponse, isUser: false });
      setIsLoading(false);
      
      // Refresh threads
      setThreads(getChatThreads());
    }, 1500);
    
    // Refresh threads to show the user message immediately
    setThreads(getChatThreads());
  };
  
  const handleCreateThread = () => {
    if (!newThreadTitle.trim()) {
      toast({
        title: "Please enter a title for the new conversation",
        variant: "destructive",
      });
      return;
    }
    
    const newThreadId = createChatThread(newThreadTitle, "How can I help you today?");
    setActiveThreadId(newThreadId);
    setThreads(getChatThreads());
    setNewThreadTitle("");
  };
  
  const handleDeleteThread = (threadId: string) => {
    const updatedThreads = threads.filter(thread => thread.id !== threadId);
    saveChatThreads(updatedThreads);
    setThreads(updatedThreads);
    
    if (activeThreadId === threadId) {
      setActiveThreadId(updatedThreads.length > 0 ? updatedThreads[0].id : null);
    }
  };
  
  const activeThread = threads.find(thread => thread.id === activeThreadId);
  
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Threads Sidebar */}
      <div className="w-64 border-r border-border bg-gray-50 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-sm text-gray-700">Conversations</h2>
            <Button variant="outline" size="sm" onClick={handleCreateThread} className="h-7 px-2">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <Input
              placeholder="New conversation title"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateThread()}
            />
          </div>
          
          <div className="space-y-1">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`flex items-center justify-between rounded-md px-3 py-1.5 cursor-pointer ${
                  thread.id === activeThreadId ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="flex-1 truncate text-sm">{thread.title}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteThread(thread.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeThread ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeThread.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.isUser ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <MathRenderer text={message.content} />
                    )}
                    <div className={`text-xs mt-1 ${message.isUser ? "text-white/70" : "text-gray-500"}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your doubt or question here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>No conversation selected or created.</p>
              <p>Create a new conversation to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;
