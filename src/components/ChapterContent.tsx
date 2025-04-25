
import { useState } from "react";
import { Chapter, Concept, Formula, Example } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormulaCard from "./FormulaCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { updateChapter } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface ChapterContentProps {
  chapter: Chapter;
  selectedConceptId?: string;
}

const ChapterContent = ({ chapter, selectedConceptId }: ChapterContentProps) => {
  const [activeTab, setActiveTab] = useState<string>(selectedConceptId ? "concepts" : "formulas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<"concept" | "formula" | "example">("concept");
  const [newConcept, setNewConcept] = useState<Partial<Concept>>({ title: "", content: "" });
  const [newFormula, setNewFormula] = useState<Partial<Formula>>({ title: "", latex: "", explanation: "", where: "" });
  const [newExample, setNewExample] = useState<Partial<Example>>({ question: "", solution: "", isJeeAdvanced: false });
  const { toast } = useToast();

  const handleAddContent = () => {
    const updatedChapter = { ...chapter };
    
    if (contentType === "concept" && newConcept.title && newConcept.content) {
      const concept: Concept = {
        id: `concept-${Date.now()}`,
        title: newConcept.title,
        content: newConcept.content,
      };
      updatedChapter.concepts = [...updatedChapter.concepts, concept];
      setNewConcept({ title: "", content: "" });
    } else if (contentType === "formula" && newFormula.title && newFormula.latex) {
      const formula: Formula = {
        id: `formula-${Date.now()}`,
        title: newFormula.title || "",
        latex: newFormula.latex || "",
        explanation: newFormula.explanation || "",
        where: newFormula.where || "",
      };
      updatedChapter.formulas = [...updatedChapter.formulas, formula];
      setNewFormula({ title: "", latex: "", explanation: "", where: "" });
    } else if (contentType === "example" && newExample.question && newExample.solution) {
      const example: Example = {
        id: `example-${Date.now()}`,
        question: newExample.question || "",
        solution: newExample.solution || "",
        isJeeAdvanced: newExample.isJeeAdvanced || false,
      };
      updatedChapter.examples = [...updatedChapter.examples, example];
      setNewExample({ question: "", solution: "", isJeeAdvanced: false });
    } else {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    updateChapter(updatedChapter);
    setDialogOpen(false);
    toast({
      title: "Content added successfully",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload
    // In a real app, this would integrate with a storage service
    toast({
      title: "File upload functionality would be implemented here",
      description: "This would connect to a storage service in a complete app",
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={contentType === "concept" ? "default" : "outline"}
                  onClick={() => setContentType("concept")}
                >
                  Concept
                </Button>
                <Button
                  variant={contentType === "formula" ? "default" : "outline"}
                  onClick={() => setContentType("formula")}
                >
                  Formula
                </Button>
                <Button
                  variant={contentType === "example" ? "default" : "outline"}
                  onClick={() => setContentType("example")}
                >
                  Example
                </Button>
              </div>
              
              {/* Content form based on selected type */}
              {contentType === "concept" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Concept Title</Label>
                    <Input
                      id="title"
                      value={newConcept.title}
                      onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
                      placeholder="e.g. Newton's Second Law"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      rows={5}
                      value={newConcept.content}
                      onChange={(e) => setNewConcept({ ...newConcept, content: e.target.value })}
                      placeholder="Enter detailed explanation of the concept..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="images">Upload Images (Optional)</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}
              
              {contentType === "formula" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Formula Title</Label>
                    <Input
                      id="title"
                      value={newFormula.title}
                      onChange={(e) => setNewFormula({ ...newFormula, title: e.target.value })}
                      placeholder="e.g. Force Equation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="latex">Formula (LaTeX)</Label>
                    <Textarea
                      id="latex"
                      value={newFormula.latex}
                      onChange={(e) => setNewFormula({ ...newFormula, latex: e.target.value })}
                      placeholder="e.g. F = ma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={newFormula.explanation}
                      onChange={(e) => setNewFormula({ ...newFormula, explanation: e.target.value })}
                      placeholder="Explain the meaning and variables..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="where">Where It's Used</Label>
                    <Input
                      id="where"
                      value={newFormula.where}
                      onChange={(e) => setNewFormula({ ...newFormula, where: e.target.value })}
                      placeholder="e.g. Used in mechanics problems"
                    />
                  </div>
                </div>
              )}
              
              {contentType === "example" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      rows={3}
                      value={newExample.question}
                      onChange={(e) => setNewExample({ ...newExample, question: e.target.value })}
                      placeholder="Enter the problem statement..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="solution">Solution</Label>
                    <Textarea
                      id="solution"
                      rows={5}
                      value={newExample.solution}
                      onChange={(e) => setNewExample({ ...newExample, solution: e.target.value })}
                      placeholder="Provide a detailed solution..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isJeeAdvanced"
                      checked={newExample.isJeeAdvanced}
                      onChange={(e) => setNewExample({ ...newExample, isJeeAdvanced: e.target.checked })}
                    />
                    <Label htmlFor="isJeeAdvanced">JEE Advanced Question</Label>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddContent}>Save Content</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="concepts" className="mt-4">
          <div className="space-y-8">
            {chapter.concepts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No concepts have been added yet</p>
                <Button variant="outline" onClick={() => {setContentType("concept"); setDialogOpen(true)}} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add a Concept
                </Button>
              </div>
            ) : (
              chapter.concepts.map((concept) => (
                <div key={concept.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">{concept.title}</h2>
                  <div className="prose max-w-none">
                    <p>{concept.content}</p>
                  </div>
                  {concept.diagrams && concept.diagrams.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Diagrams</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {concept.diagrams.map((diagram, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded">
                            <img src={diagram} alt={`Diagram ${index + 1}`} className="w-full h-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="formulas" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapter.formulas.length === 0 ? (
              <div className="text-center py-8 text-gray-500 col-span-2">
                <p>No formulas have been added yet</p>
                <Button variant="outline" onClick={() => {setContentType("formula"); setDialogOpen(true)}} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add a Formula
                </Button>
              </div>
            ) : (
              chapter.formulas.map((formula) => (
                <FormulaCard key={formula.id} formula={formula} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="mt-4">
          <div className="space-y-6">
            {chapter.examples.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No examples have been added yet</p>
                <Button variant="outline" onClick={() => {setContentType("example"); setDialogOpen(true)}} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add an Example
                </Button>
              </div>
            ) : (
              chapter.examples.map((example) => (
                <div key={example.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {example.isJeeAdvanced && (
                    <div className="bg-physics-main text-white px-4 py-1 text-sm font-semibold">
                      JEE Advanced
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Question:</h3>
                      <p>{example.question}</p>
                    </div>
                    <div className="pt-3 border-t">
                      <h3 className="font-semibold mb-2">Solution:</h3>
                      <p className="whitespace-pre-wrap">{example.solution}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChapterContent;
