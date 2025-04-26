
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
      
      // In a real app, call an API to get a real answer
      setTimeout(() => {
        // Generate a more detailed response based on common academic topics
        const userQuestion = newMessage.trim().toLowerCase();
        
        let aiResponse = "";
        
        if (userQuestion.includes("newton's laws")) {
          aiResponse = `Newton's Three Laws of Motion are fundamental principles in classical mechanics:\n\n1. **First Law (Law of Inertia)**: An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an external force. Mathematically, when $\\sum \\vec{F} = 0$, acceleration $\\vec{a} = 0$.\n\n2. **Second Law**: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This is expressed as $\\vec{F} = m\\vec{a}$ or $\\sum \\vec{F} = m\\vec{a}$.\n\n3. **Third Law**: For every action, there is an equal and opposite reaction. When object A exerts a force on object B, object B simultaneously exerts a force of equal magnitude but opposite direction on object A. This is written as $\\vec{F}_{A\\text{ on }B} = -\\vec{F}_{B\\text{ on }A}$.\n\nThese laws form the foundation of classical mechanics and are applicable in countless physics problems.`;
        } else if (userQuestion.includes("thermodynamics")) {
          aiResponse = `Thermodynamics deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter. The four laws of thermodynamics are:\n\n**Zeroth Law**: If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with one another.\n\n**First Law** (Conservation of Energy): Energy cannot be created or destroyed, only transformed. Mathematically: $\\Delta U = Q - W$, where $\\Delta U$ is change in internal energy, $Q$ is heat added, and $W$ is work done by the system.\n\n**Second Law**: The entropy of an isolated system not in equilibrium will tend to increase over time, approaching a maximum value at equilibrium. This can be expressed as $\\Delta S \\geq 0$ for an isolated system.\n\n**Third Law**: As the temperature approaches absolute zero, the entropy of a perfect crystal approaches zero: $\\lim_{T \\to 0} S = 0$.`;
        } else if (userQuestion.includes("quadratic")) {
          aiResponse = `For a quadratic equation in standard form $ax^2 + bx + c = 0$ (where $a \\neq 0$), the solutions are given by the quadratic formula:\n\n$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n\nThe discriminant $b^2 - 4ac$ tells us about the nature of the roots:\n- If $b^2 - 4ac > 0$, there are two distinct real roots\n- If $b^2 - 4ac = 0$, there is exactly one real root (a repeated root)\n- If $b^2 - 4ac < 0$, there are two complex conjugate roots\n\nFor example, solving $2x^2 - 4x - 6 = 0$:\n$a = 2, b = -4, c = -6$\n\n$x = \\frac{4 \\pm \\sqrt{16 + 48}}{4} = \\frac{4 \\pm \\sqrt{64}}{4} = \\frac{4 \\pm 8}{4}$\n\nTherefore $x = 3$ or $x = -1$`;
        } else if (userQuestion.includes("molar")) {
          aiResponse = `Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). One mole contains exactly $6.02214076 \\times 10^{23}$ elementary entities (Avogadro's number).\n\nTo calculate the molar mass of a compound:\n1. Identify the atoms in the compound's chemical formula\n2. Find the atomic mass of each element from the periodic table\n3. Multiply each atom's mass by the number of atoms in the formula\n4. Sum these values\n\nFor example, calculating the molar mass of $H_2SO_4$:\n- Hydrogen (H): $2 \\times 1.008 = 2.016$ g/mol\n- Sulfur (S): $1 \\times 32.06 = 32.06$ g/mol\n- Oxygen (O): $4 \\times 16.00 = 64.00$ g/mol\n\nMolar mass of $H_2SO_4 = 2.016 + 32.06 + 64.00 = 98.076$ g/mol`;
        } else {
          aiResponse = `To solve this problem, I'll break it down step by step:\n\n${newMessage.trim()} can be approached using fundamental principles in this subject area.\n\nFirst, we need to understand the key concepts involved. The main principle here is that ${newMessage.includes("force") ? "force equals mass times acceleration ($F = ma$)" : newMessage.includes("energy") ? "energy is conserved in a closed system" : "we can apply relevant formulas to find the solution"}.\n\nLet's work through this methodically:\n\n1. Identify the known variables from the problem\n2. Determine which formula applies to this scenario\n3. Substitute the values and solve step-by-step\n\nFor this specific question, I would use the equation $${newMessage.includes("velocity") ? "v = u + at" : newMessage.includes("distance") ? "s = ut + \\frac{1}{2}at^2" : "E = mc^2"}$$\n\nSolving further gives us the final answer of $${Math.floor(Math.random() * 100)}$ ${newMessage.includes("force") ? "N" : newMessage.includes("energy") ? "J" : "units"}$.\n\nThis solution demonstrates how to systematically approach this type of problem using established principles.`;
        }
        
        addMessageToThread(activeThreadId, { content: aiResponse, isUser: false });
        setIsLoading(false);
        
        // Refresh threads
        setThreads(getChatThreads());
      }, 1500);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error generating response",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    
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

export default AIChat;
