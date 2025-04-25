
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subject, SUBJECTS } from "@/lib/data";
import { addChapter } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AddContentFormProps {
  onComplete?: () => void;
}

const AddContentForm = ({ onComplete }: AddContentFormProps) => {
  const [subject, setSubject] = useState<Subject>("physics");
  const [chapterTitle, setChapterTitle] = useState("");
  const [conceptTitle, setConceptTitle] = useState("");
  const [conceptContent, setConceptContent] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddChapter = () => {
    if (!chapterTitle.trim()) {
      toast({
        title: "Please enter a chapter title",
        variant: "destructive",
      });
      return;
    }
    
    // Create new chapter with initial concept if provided
    const concepts = conceptTitle && conceptContent 
      ? [{
          id: `concept-${Date.now()}`,
          title: conceptTitle,
          content: conceptContent
        }] 
      : [];
    
    const newChapter = {
      id: `${subject}-${Date.now()}`,
      title: chapterTitle,
      subject,
      concepts,
      formulas: [],
      examples: [],
      order: Date.now()
    };
    
    addChapter(newChapter);
    
    toast({
      title: "Chapter added successfully",
    });
    
    if (onComplete) {
      onComplete();
    } else {
      navigate(`/${subject}/${newChapter.id}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Chapter</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select value={subject} onValueChange={(value) => setSubject(value as Subject)}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUBJECTS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chapterTitle">Chapter Title</Label>
          <Input
            id="chapterTitle"
            placeholder="e.g. Thermodynamics"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Initial Concept (Optional)</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conceptTitle">Concept Title</Label>
              <Input
                id="conceptTitle"
                placeholder="e.g. First Law of Thermodynamics"
                value={conceptTitle}
                onChange={(e) => setConceptTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conceptContent">Content</Label>
              <Textarea
                id="conceptContent"
                rows={5}
                placeholder="Enter the concept explanation..."
                value={conceptContent}
                onChange={(e) => setConceptContent(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleAddChapter}>Create Chapter</Button>
        </div>
      </div>
    </div>
  );
};

export default AddContentForm;
