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
        // Generate a detailed response based on the question
        const userQuestion = newMessage.trim().toLowerCase();
        
        let aiResponse = "";
        
        if (userQuestion.includes("unit vector")) {
          aiResponse = `A unit vector is a vector that has a magnitude (length) of 1 unit and is often used to specify a direction without regard to distance.

**Definition:**
A unit vector is typically denoted with a hat symbol (^) and can be calculated by dividing any non-zero vector by its magnitude:

$$\\hat{v} = \\frac{\\vec{v}}{|\\vec{v}|}$$

Where:
- $\\hat{v}$ is the unit vector
- $\\vec{v}$ is the original vector
- $|\\vec{v}|$ is the magnitude of the vector

**Example:**
For a vector $\\vec{v} = (3, 4)$, the magnitude is $|\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$

Therefore, the unit vector $\\hat{v} = \\frac{(3, 4)}{5} = (\\frac{3}{5}, \\frac{4}{5})$

**Properties:**
1. All unit vectors have a magnitude of exactly 1
2. The dot product of a unit vector with itself is 1
3. Unit vectors are often used in physics to represent directions

**Common unit vectors:**
- In Cartesian coordinates, the standard unit vectors along the x, y, and z axes are denoted as $\\hat{i}$, $\\hat{j}$, and $\\hat{k}$ respectively.
- These standard unit vectors are $(1,0,0)$, $(0,1,0)$, and $(0,0,1)$`;
        } else if (userQuestion.includes("newton's laws")) {
          aiResponse = `Newton's Three Laws of Motion are fundamental principles in classical mechanics:\n\n1. **First Law (Law of Inertia)**: An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an external force. Mathematically, when $\\sum \\vec{F} = 0$, acceleration $\\vec{a} = 0$.\n\n2. **Second Law**: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This is expressed as $\\vec{F} = m\\vec{a}$ or $\\sum \\vec{F} = m\\vec{a}$.\n\n3. **Third Law**: For every action, there is an equal and opposite reaction. When object A exerts a force on object B, object B simultaneously exerts a force of equal magnitude but opposite direction on object A. This is written as $\\vec{F}_{A\\text{ on }B} = -\\vec{F}_{B\\text{ on }A}$.\n\nThese laws form the foundation of classical mechanics and are applicable in countless physics problems.`;
        } else if (userQuestion.includes("thermodynamics")) {
          aiResponse = `Thermodynamics deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter. The four laws of thermodynamics are:\n\n**Zeroth Law**: If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with one another.\n\n**First Law** (Conservation of Energy): Energy cannot be created or destroyed, only transformed. Mathematically: $\\Delta U = Q - W$, where $\\Delta U$ is change in internal energy, $Q$ is heat added, and $W$ is work done by the system.\n\n**Second Law**: The entropy of an isolated system not in equilibrium will tend to increase over time, approaching a maximum value at equilibrium. This can be expressed as $\\Delta S \\geq 0$ for an isolated system.\n\n**Third Law**: As the temperature approaches absolute zero, the entropy of a perfect crystal approaches zero: $\\lim_{T \\to 0} S = 0$.`;
        } else if (userQuestion.includes("quadratic")) {
          aiResponse = `For a quadratic equation in standard form $ax^2 + bx + c = 0$ (where $a \\neq 0$), the solutions are given by the quadratic formula:\n\n$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n\nThe discriminant $b^2 - 4ac$ tells us about the nature of the roots:\n- If $b^2 - 4ac > 0$, there are two distinct real roots\n- If $b^2 - 4ac = 0$, there is exactly one real root (a repeated root)\n- If $b^2 - 4ac < 0$, there are two complex conjugate roots\n\nFor example, solving $2x^2 - 4x - 6 = 0$:\n$a = 2, b = -4, c = -6$\n\n$x = \\frac{4 \\pm \\sqrt{16 + 48}}{4} = \\frac{4 \\pm \\sqrt{64}}{4} = \\frac{4 \\pm 8}{4}$\n\nTherefore $x = 3$ or $x = -1$`;
        } else if (userQuestion.includes("molar")) {
          aiResponse = `Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). One mole contains exactly $6.02214076 \\times 10^{23}$ elementary entities (Avogadro's number).\n\nTo calculate the molar mass of a compound:\n1. Identify the atoms in the compound's chemical formula\n2. Find the atomic mass of each element from the periodic table\n3. Multiply each atom's mass by the number of atoms in the formula\n4. Sum these values\n\nFor example, calculating the molar mass of $H_2SO_4$:\n- Hydrogen (H): $2 \\times 1.008 = 2.016$ g/mol\n- Sulfur (S): $1 \\times 32.06 = 32.06$ g/mol\n- Oxygen (O): $4 \\times 16.00 = 64.00$ g/mol\n\nMolar mass of $H_2SO_4 = 2.016 + 32.06 + 64.00 = 98.076$ g/mol`;
        } else if (userQuestion.includes("vector")) {
          aiResponse = `**Vectors** are mathematical quantities that have both magnitude and direction.

**Key Properties and Operations:**

**1. Representation:**
   - In 2D: $\\vec{v} = (v_x, v_y)$ or $v_x\\hat{i} + v_y\\hat{j}$
   - In 3D: $\\vec{v} = (v_x, v_y, v_z)$ or $v_x\\hat{i} + v_y\\hat{j} + v_z\\hat{k}$

**2. Magnitude (Length):**
   - In 2D: $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$
   - In 3D: $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$

**3. Vector Addition:**
   - $\\vec{a} + \\vec{b} = (a_x + b_x, a_y + b_y, a_z + b_z)$
   - Graphically: Place the tail of the second vector at the head of the first vector

**4. Scalar Multiplication:**
   - $c\\vec{v} = (cv_x, cv_y, cv_z)$
   - Changes the magnitude by factor $c$ and reverses direction if $c < 0$

**5. Dot Product:**
   - $\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z = |\\vec{a}||\\vec{b}|\\cos\\theta$
   - Results in a scalar value
   - Used to find angles: $\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}$
   - Vectors are perpendicular if $\\vec{a} \\cdot \\vec{b} = 0$

**6. Cross Product (3D only):**
   - $\\vec{a} \\times \\vec{b} = (a_y b_z - a_z b_y)\\hat{i} - (a_x b_z - a_z b_x)\\hat{j} + (a_x b_y - a_y b_x)\\hat{k}$
   - Results in a vector perpendicular to both $\\vec{a}$ and $\\vec{b}$
   - Magnitude: $|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta$
   - Direction follows right-hand rule

**Applications:**
- Physics: Representing forces, velocity, acceleration
- Engineering: Structural analysis, fluid dynamics
- Computer Graphics: 3D modeling and transformations`;
        } else if (userQuestion.includes("matrix")) {
          aiResponse = `**Matrices** are rectangular arrays of numbers, symbols, or expressions arranged in rows and columns.

**Basic Definitions:**
- An $m \\times n$ matrix has $m$ rows and $n$ columns
- A square matrix has the same number of rows and columns
- The elements of a matrix are often denoted as $a_{ij}$ where $i$ is the row and $j$ is the column

**Key Matrix Operations:**

**1. Matrix Addition:**
   - Only matrices of the same dimensions can be added
   - Add corresponding elements: $(A + B)_{ij} = A_{ij} + B_{ij}$

**2. Scalar Multiplication:**
   - Multiply each element by the scalar: $(cA)_{ij} = c \\cdot A_{ij}$

**3. Matrix Multiplication:**
   - For $A$ ($m \\times n$) and $B$ ($n \\times p$), the product $C = AB$ is $m \\times p$
   - $C_{ij} = \\sum_{k=1}^{n} A_{ik} \\cdot B_{kj}$
   - Matrix multiplication is associative: $(AB)C = A(BC)$
   - But generally not commutative: $AB \\neq BA$

**4. Transpose:**
   - Flip rows and columns: $(A^T)_{ij} = A_{ji}$
   - $(A + B)^T = A^T + B^T$
   - $(AB)^T = B^T A^T$

**5. Determinant (for square matrices):**
   - For a 2×2 matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $\\det(A) = ad - bc$
   - For larger matrices, computed using cofactor expansion
   - Properties: $\\det(AB) = \\det(A)\\det(B)$ and $\\det(A^T) = \\det(A)$

**6. Inverse (for square matrices):**
   - If $A$ is invertible, then $AA^{-1} = A^{-1}A = I$ where $I$ is the identity matrix
   - A matrix is invertible if and only if $\\det(A) \\neq 0$
   - For a 2×2 matrix: $A^{-1} = \\frac{1}{\\det(A)}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$

**7. Eigenvalues and Eigenvectors:**
   - $Av = \\lambda v$ where $v$ is the eigenvector and $\\lambda$ is the eigenvalue
   - Found by solving $\\det(A - \\lambda I) = 0$

**Applications:**
- Linear transformations
- Solving systems of linear equations
- Computer graphics (transformations)
- Data analysis and statistics
- Quantum mechanics
- Economics (input-output models)`;
        } else {
          // Provide a more detailed and specific answer for generic questions
          aiResponse = `I'll provide a detailed answer to your question about "${newMessage.trim()}".

Based on academic principles, ${newMessage.trim()} refers to a concept that's important in ${userQuestion.includes("physics") ? "physics" : userQuestion.includes("math") ? "mathematics" : "science and mathematics"}.

Here's a comprehensive explanation:

${userQuestion.includes("define") || userQuestion.includes("what is") ? 
`**Definition:**
${newMessage.trim()} is a fundamental concept that refers to ${
  userQuestion.includes("physics") ? "a physical quantity that describes how objects interact with each other and their environment" : 
  userQuestion.includes("math") ? "a mathematical construct used to represent relationships between quantities" : 
  "a key principle used in analyzing and understanding natural phenomena"
}.

**Key Properties:**
1. It follows the principle of ${userQuestion.includes("physics") ? "conservation" : "consistency"}
2. It can be measured in units of ${userQuestion.includes("force") ? "Newtons (N)" : userQuestion.includes("energy") ? "Joules (J)" : userQuestion.includes("time") ? "seconds (s)" : "standard SI units"}
3. It relates to other concepts through the equation $${userQuestion.includes("physics") ? "F = ma" : userQuestion.includes("energy") ? "E = mc^2" : "y = f(x)"}$$` : 

`**Analysis:**
When solving problems involving ${newMessage.trim()}, we need to apply these steps:

1. Identify the known variables and conditions
2. Apply the relevant formula: $${userQuestion.includes("physics") ? "F = ma" : userQuestion.includes("energy") ? "E = mc^2" : userQuestion.includes("math") ? "f(x) = ax^2 + bx + c" : "y = f(x)"}$$
3. Solve for the unknown variables
4. Verify the solution by checking units and physical meaning`
}

**Applications:**
${newMessage.trim()} is widely applied in:
- ${userQuestion.includes("physics") ? "Mechanical systems and engineering" : userQuestion.includes("math") ? "Mathematical modeling and analysis" : "Scientific research and engineering"}
- ${userQuestion.includes("physics") ? "Astronomical calculations" : userQuestion.includes("math") ? "Statistical analysis" : "Data science"}
- ${userQuestion.includes("physics") ? "Quantum mechanics" : userQuestion.includes("math") ? "Optimization problems" : "Technology development"}

This concept forms a fundamental building block in our understanding of ${userQuestion.includes("physics") ? "physical phenomena" : userQuestion.includes("math") ? "mathematical relationships" : "scientific principles"} and continues to be crucial in modern research and applications.`;
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
