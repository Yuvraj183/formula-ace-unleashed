import { useState } from "react";
import { Chapter, Concept, Formula, Example, TableData } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormulaCard from "./FormulaCard";
import TableEditor from "./TableEditor";
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
import { Plus, Pencil, Trash } from "lucide-react";
import { updateChapter } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChapterContentProps {
  chapter: Chapter;
  selectedConceptId?: string;
}

const ChapterContent = ({ chapter, selectedConceptId }: ChapterContentProps) => {
  const [activeTab, setActiveTab] = useState<string>(selectedConceptId ? "concepts" : "formulas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<"concept" | "formula" | "example">("concept");
  const [newConcept, setNewConcept] = useState<Partial<Concept>>({ title: "", content: "" });
  const [newFormula, setNewFormula] = useState<Partial<Formula>>({ title: "", latex: "", explanation: "", where: "" });
  const [newExample, setNewExample] = useState<Partial<Example>>({ question: "", solution: "", isJeeAdvanced: false });
  const [conceptTable, setConceptTable] = useState<TableData | undefined>(undefined);
  const [formulaTable, setFormulaTable] = useState<TableData | undefined>(undefined);
  const [editingItem, setEditingItem] = useState<{id: string, type: "concept" | "formula" | "example"} | null>(null);
  const [deletingItem, setDeletingItem] = useState<{id: string, type: "concept" | "formula" | "example"} | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string[]}>({
    concept: [],
    formula: [],
    example: []
  });
  const { toast } = useToast();

  const resetForms = () => {
    setNewConcept({ title: "", content: "" });
    setNewFormula({ title: "", latex: "", explanation: "", where: "" });
    setNewExample({ question: "", solution: "", isJeeAdvanced: false });
    setConceptTable(undefined);
    setFormulaTable(undefined);
    setUploadedImages({
      concept: [],
      formula: [],
      example: []
    });
  };

  const handleAddContent = () => {
    const updatedChapter = { ...chapter };
    
    if (contentType === "concept" && newConcept.title && newConcept.content) {
      const concept: Concept = {
        id: `concept-${Date.now()}`,
        title: newConcept.title,
        content: newConcept.content,
        diagrams: uploadedImages.concept,
        table: conceptTable
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
        diagrams: uploadedImages.formula,
        table: formulaTable
      };
      updatedChapter.formulas = [...updatedChapter.formulas, formula];
      setNewFormula({ title: "", latex: "", explanation: "", where: "" });
    } else if (contentType === "example" && newExample.question && newExample.solution) {
      const example: Example = {
        id: `example-${Date.now()}`,
        question: newExample.question || "",
        solution: newExample.solution || "",
        isJeeAdvanced: newExample.isJeeAdvanced || false,
        diagrams: uploadedImages.example
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
    resetForms();
    toast({
      title: "Content added successfully",
    });
  };

  const handleEditContent = () => {
    if (!editingItem) return;
    
    const updatedChapter = { ...chapter };
    
    if (editingItem.type === "concept" && newConcept.title && newConcept.content) {
      const conceptIndex = updatedChapter.concepts.findIndex(c => c.id === editingItem.id);
      if (conceptIndex >= 0) {
        updatedChapter.concepts[conceptIndex] = {
          ...updatedChapter.concepts[conceptIndex],
          title: newConcept.title,
          content: newConcept.content,
          diagrams: [...(updatedChapter.concepts[conceptIndex].diagrams || []), ...uploadedImages.concept],
          table: conceptTable
        };
      }
    } else if (editingItem.type === "formula" && newFormula.title && newFormula.latex) {
      const formulaIndex = updatedChapter.formulas.findIndex(f => f.id === editingItem.id);
      if (formulaIndex >= 0) {
        updatedChapter.formulas[formulaIndex] = {
          ...updatedChapter.formulas[formulaIndex],
          title: newFormula.title,
          latex: newFormula.latex,
          explanation: newFormula.explanation || "",
          where: newFormula.where || "",
          diagrams: [...(updatedChapter.formulas[formulaIndex].diagrams || []), ...uploadedImages.formula],
          table: formulaTable
        };
      }
    } else if (editingItem.type === "example" && newExample.question && newExample.solution) {
      const exampleIndex = updatedChapter.examples.findIndex(e => e.id === editingItem.id);
      if (exampleIndex >= 0) {
        updatedChapter.examples[exampleIndex] = {
          ...updatedChapter.examples[exampleIndex],
          question: newExample.question,
          solution: newExample.solution,
          isJeeAdvanced: newExample.isJeeAdvanced || false,
          diagrams: [...(updatedChapter.examples[exampleIndex].diagrams || []), ...uploadedImages.example]
        };
      }
    } else {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    updateChapter(updatedChapter);
    setEditDialogOpen(false);
    setEditingItem(null);
    resetForms();
    toast({
      title: "Content updated successfully",
    });
  };

  const handleDeleteContent = () => {
    if (!deletingItem) return;
    
    const updatedChapter = { ...chapter };
    
    if (deletingItem.type === "concept") {
      updatedChapter.concepts = updatedChapter.concepts.filter(c => c.id !== deletingItem.id);
    } else if (deletingItem.type === "formula") {
      updatedChapter.formulas = updatedChapter.formulas.filter(f => f.id !== deletingItem.id);
    } else if (deletingItem.type === "example") {
      updatedChapter.examples = updatedChapter.examples.filter(e => e.id !== deletingItem.id);
    }
    
    updateChapter(updatedChapter);
    setDeleteDialogOpen(false);
    setDeletingItem(null);
    toast({
      title: "Content deleted successfully",
    });
  };

  const handleEditItem = (id: string, type: "concept" | "formula" | "example") => {
    setEditingItem({ id, type });
    setContentType(type);
    
    if (type === "concept") {
      const concept = chapter.concepts.find(c => c.id === id);
      if (concept) {
        setNewConcept({ title: concept.title, content: concept.content });
        setConceptTable(concept.table);
      }
    } else if (type === "formula") {
      const formula = chapter.formulas.find(f => f.id === id);
      if (formula) {
        setNewFormula({ 
          title: formula.title, 
          latex: formula.latex,
          explanation: formula.explanation,
          where: formula.where
        });
        setFormulaTable(formula.table);
      }
    } else if (type === "example") {
      const example = chapter.examples.find(e => e.id === id);
      if (example) {
        setNewExample({
          question: example.question,
          solution: example.solution,
          isJeeAdvanced: example.isJeeAdvanced
        });
      }
    }
    
    setEditDialogOpen(true);
  };

  const handleDeleteItem = (id: string, type: "concept" | "formula" | "example") => {
    setDeletingItem({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "concept" | "formula" | "example") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to a server and get URLs
    // For this demo, we'll create local object URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    
    setUploadedImages(prev => ({
      ...prev,
      [type]: [...prev[type], ...newImages]
    }));
    
    toast({
      title: `${files.length} image(s) added`,
      description: "Images have been added to your content"
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
                    <Label htmlFor="images">Upload Images</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "concept")}
                    />
                    {uploadedImages.concept.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {uploadedImages.concept.map((img, i) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt={`Uploaded ${i}`} 
                            className="w-full h-20 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Table (Optional)</Label>
                    <TableEditor table={conceptTable} onChange={setConceptTable} />
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
                  <div>
                    <Label htmlFor="formula-images">Upload Images</Label>
                    <Input
                      id="formula-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "formula")}
                    />
                    {uploadedImages.formula.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {uploadedImages.formula.map((img, i) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt={`Uploaded ${i}`} 
                            className="w-full h-20 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Table (Optional)</Label>
                    <TableEditor table={formulaTable} onChange={setFormulaTable} />
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
                  <div>
                    <Label htmlFor="example-images">Upload Images</Label>
                    <Input
                      id="example-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "example")}
                    />
                    {uploadedImages.example.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {uploadedImages.example.map((img, i) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt={`Uploaded ${i}`} 
                            className="w-full h-20 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
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
                <div key={concept.id} className="bg-white p-6 rounded-lg shadow-md relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditItem(concept.id, "concept")} 
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteItem(concept.id, "concept")} 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
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
                  
                  {concept.table && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Table</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              {concept.table.headers.map((header, i) => (
                                <th key={i} className="border border-border px-3 py-2 text-left font-semibold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {concept.table.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border border-border px-3 py-2">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
                <div key={formula.id} className="relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditItem(formula.id, "formula")} 
                      className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteItem(formula.id, "formula")} 
                      className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <FormulaCard formula={formula} />
                  
                  {formula.diagrams && formula.diagrams.length > 0 && (
                    <div className="mt-2 p-3 bg-white rounded-lg shadow-md">
                      <div className="grid grid-cols-2 gap-2">
                        {formula.diagrams.map((diagram, index) => (
                          <div key={index} className="bg-gray-50 p-1 rounded">
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
                <div key={example.id} className="bg-white rounded-lg shadow-md overflow-hidden relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditItem(example.id, "example")} 
                      className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteItem(example.id, "example")} 
                      className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {example.isJeeAdvanced && (
                    <div className="bg-physics-main text-white px-4 py-1 text-sm font-semibold">
                      JEE Advanced
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Question:</h3>
                      <p>{example.question}</p>
                      
                      {example.diagrams && example.diagrams.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {example.diagrams.map((diagram, index) => (
                            <div key={index} className="bg-gray-100 p-1 rounded">
                              <img src={diagram} alt={`Diagram ${index + 1}`} className="w-full h-auto" />
                            </div>
                          ))}
                        </div>
                      )}
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
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {contentType === "concept" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Concept Title</Label>
                  <Input
                    id="edit-title"
                    value={newConcept.title}
                    onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    rows={5}
                    value={newConcept.content}
                    onChange={(e) => setNewConcept({ ...newConcept, content: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-images">Add More Images</Label>
                  <Input
                    id="edit-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "concept")}
                  />
                  {uploadedImages.concept.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {uploadedImages.concept.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={`Uploaded ${i}`} 
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Table (Optional)</Label>
                  <TableEditor table={conceptTable} onChange={setConceptTable} />
                </div>
              </div>
            )}
            {contentType === "formula" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-formula-title">Formula Title</Label>
                  <Input
                    id="edit-formula-title"
                    value={newFormula.title}
                    onChange={(e) => setNewFormula({ ...newFormula, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-latex">Formula (LaTeX)</Label>
                  <Textarea
                    id="edit-latex"
                    value={newFormula.latex}
                    onChange={(e) => setNewFormula({ ...newFormula, latex: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-explanation">Explanation</Label>
                  <Textarea
                    id="edit-explanation"
                    value={newFormula.explanation}
                    onChange={(e) => setNewFormula({ ...newFormula, explanation: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-where">Where It's Used</Label>
                  <Input
                    id="edit-where"
                    value={newFormula.where}
                    onChange={(e) => setNewFormula({ ...newFormula, where: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-formula-images">Add More Images</Label>
                  <Input
                    id="edit-formula-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "formula")}
                  />
                  {uploadedImages.formula.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {uploadedImages.formula.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={`Uploaded ${i}`} 
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Table (Optional)</Label>
                  <TableEditor table={formulaTable} onChange={setFormulaTable} />
                </div>
              </div>
            )}
            {contentType === "example" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-question">Question</Label>
                  <Textarea
                    id="edit-question"
                    rows={3}
                    value={newExample.question}
                    onChange={(e) => setNewExample({ ...newExample, question: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-solution">Solution</Label>
                  <Textarea
                    id="edit-solution"
                    rows={5}
                    value={newExample.solution}
                    onChange={(e) => setNewExample({ ...newExample, solution: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-isJeeAdvanced"
                    checked={newExample.isJeeAdvanced}
                    onChange={(e) => setNewExample({ ...newExample, isJeeAdvanced: e.target.checked })}
                  />
                  <Label htmlFor="edit-isJeeAdvanced">JEE Advanced Question</Label>
                </div>
                <div>
                  <Label htmlFor="edit-example-images">Add More Images</Label>
                  <Input
                    id="edit-example-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "example")}
                  />
                  {uploadedImages.example.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {uploadedImages.example.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={`Uploaded ${i}`} 
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleEditContent}>Update Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingItem(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContent} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChapterContent;
