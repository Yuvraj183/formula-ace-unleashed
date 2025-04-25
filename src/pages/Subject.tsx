
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Chapter, SUBJECTS, Subject as SubjectType } from "@/lib/data";
import { getChapters } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import AddContentForm from "@/components/AddContentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Subject = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const subject = subjectId as SubjectType;
  const subjectData = SUBJECTS[subject];

  useEffect(() => {
    // Load chapters
    const loadedChapters = getChapters().filter(
      (chapter) => chapter.subject === subject
    );
    setChapters(loadedChapters);
  }, [subject]);

  if (!subjectData) {
    return <div>Invalid subject</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar subject={subject} />
        <main className="flex-1 bg-background">
          <div className="container mx-auto py-8 px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Subject
                </div>
                <h1 className="text-3xl font-bold">{subjectData.name}</h1>
                <p className="text-muted-foreground mt-1">
                  {subjectData.description}
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Chapter
                </Button>
                <DialogContent className="sm:max-w-lg">
                  <AddContentForm onComplete={() => {
                    setDialogOpen(false);
                    // Refresh chapters after adding
                    const loadedChapters = getChapters().filter(
                      (chapter) => chapter.subject === subject
                    );
                    setChapters(loadedChapters);
                  }} />
                </DialogContent>
              </Dialog>
            </div>
            
            {chapters.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mb-4 text-4xl">📚</div>
                <h2 className="text-2xl font-semibold mb-2">No Chapters Yet</h2>
                <p className="text-gray-500 mb-6">
                  Get started by adding your first chapter to {subjectData.name}.
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Chapter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/${subject}/${chapter.id}`)}
                  >
                    <div className={`h-2 ${subjectData.bgClass}`} />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">{chapter.title}</h2>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${subjectData.bgClass}`}>
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        <span className="font-medium">{chapter.concepts.length}</span> Concepts • 
                        <span className="font-medium"> {chapter.formulas.length}</span> Formulas • 
                        <span className="font-medium"> {chapter.examples.length}</span> Examples
                      </div>
                      <Button variant="outline" className="w-full">
                        View Chapter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subject;
