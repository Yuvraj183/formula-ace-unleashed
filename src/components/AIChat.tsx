import { useState, useEffect, useRef } from "react";
import { ChatThread, ChatMessage } from "@/lib/data";
import { addMessageToThread, createChatThread, getChatThreads, saveChatThreads } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MathRenderer from "./MathRenderer";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';

interface AIChatProps {
  initialThreadId?: string;
}

const AIChat = ({ initialThreadId }: AIChatProps) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreadId || null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [showCameraInput, setShowCameraInput] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    
    // Generate AI response
    setIsLoading(true);
    
    try {
      // Get context from the current thread for memory
      const currentThread = threads.find(thread => thread.id === activeThreadId);
      const context = currentThread?.messages
        .slice(-5) // Get last 5 messages for context
        .map(msg => ({role: msg.isUser ? 'user' : 'assistant', content: msg.content}));
      
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: JSON.stringify({ message: newMessage.trim(), context })
      });

      if (error) throw error;

      // Add AI response to thread
      addMessageToThread(activeThreadId, { 
        content: data.response, 
        isUser: false 
      });
      
      setIsLoading(false);
      
      // Refresh threads
      setThreads(getChatThreads());
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error generating response",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCameraInput(true);
      
      // Set the video stream to the video element once the dialog is open
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access failed",
        description: "Please check your camera permissions",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraInput(false);
  };

  const captureImage = () => {
    try {
      const canvas = document.createElement('canvas');
      if (videoRef.current) {
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get the image as base64 data URL
        const imageData = canvas.toDataURL('image/jpeg');
        
        // In a real app, you would send the image to an API or process it
        // For now, we'll create a message with an indication that an image was uploaded
        if (activeThreadId) {
          addMessageToThread(activeThreadId, { 
            content: "I've uploaded an image with my question. [Image analysis would happen here in a production app]",
            isUser: true 
          });
          setThreads(getChatThreads());
          
          // Simulate AI response to image
          setIsLoading(true);
          setTimeout(() => {
            addMessageToThread(activeThreadId as string, { 
              content: "I can see the image you've uploaded. It appears to contain a problem related to physics/mathematics. To solve this properly, I would analyze the text and diagrams from the image. For now, could you also type out the key details of the problem so I can provide a more accurate solution?",
              isUser: false 
            });
            setIsLoading(false);
            setThreads(getChatThreads());
          }, 1500);
        }
        
        stopCamera(); // Close the camera after capturing
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Failed to capture image",
        description: "Please try again",
        variant: "destructive",
      });
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
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={startCamera} 
                  className="flex items-center gap-1"
                >
                  <Camera size={16} />
                  <span>Camera</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder="Type your doubt or question here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                  className="min-h-[60px] max-h-[150px]"
                  rows={2}
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
      
      {/* Camera Dialog */}
      <Dialog open={showCameraInput} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Photo of Your Question</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={captureImage}>Capture</Button>
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
async function handleAsk() {
  if (!question.trim()) return;
  setLoading(true);

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    if (data.answer) {
      setAnswer(data.answer);
    } else {
      setAnswer("Sorry, I couldn't solve this right now.");
    }
  } catch (error) {
    console.error(error);
    setAnswer("Error connecting to server.");
  }

  setLoading(false);
}

export default AIChat;
