
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Chapter, Subject, SUBJECTS } from "@/lib/data";
import { getChapters } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  BookOpen, 
  Lightbulb
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  subject?: Subject;
}

const Sidebar = ({ subject }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chapters, setChapters] = useState<Chapter[]>(getChapters());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddChapter = () => {
    if (!subject || !newChapterTitle.trim()) return;
    
    // In a real app, we would call an API to create the chapter
    const newChapterId = `${subject}-${Date.now()}`;
    // Implementation would be handled elsewhere, this is just for UI state
    setNewChapterTitle("");
    setDialogOpen(false);
    
    // Refresh chapters
    setChapters(getChapters());
  };

  const filteredChapters = chapters.filter(
    (chapter) => !subject || chapter.subject === subject
  );

  return (
    <div className="w-64 bg-white border-r border-border h-[calc(100vh-64px)] overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">
            {subject ? SUBJECTS[subject].name : "All Subjects"}
          </h2>
          {subject && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Chapter</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Chapter Title</Label>
                    <Input
                      id="name"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      placeholder="e.g. Thermodynamics"
                    />
                  </div>
                </div>
                <Button onClick={handleAddChapter}>Add Chapter</Button>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-1">
          {filteredChapters.map((chapter) => (
            <div key={chapter.id} className="space-y-1">
              <div
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                  location.pathname.includes(chapter.id)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => navigate(`/${chapter.subject}/${chapter.id}`)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{chapter.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleExpand(chapter.id)}
                >
                  {expanded[chapter.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expanded[chapter.id] && (
                <div className="ml-4 space-y-1">
                  {chapter.concepts.map((concept) => (
                    <div
                      key={concept.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => 
                        navigate(`/${chapter.subject}/${chapter.id}?concept=${concept.id}`)
                      }
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>{concept.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
