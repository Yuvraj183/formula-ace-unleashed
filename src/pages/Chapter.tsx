
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChapterContent from "@/components/ChapterContent";
import { getChapters } from "@/lib/storage";
import { Chapter as ChapterType } from "@/lib/data";

const Chapter = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const [searchParams] = useSearchParams();
  const conceptId = searchParams.get('concept') || undefined;
  const [chapter, setChapter] = useState<ChapterType | null>(null);

  useEffect(() => {
    // Load chapter
    if (chapterId) {
      const loadedChapter = getChapters().find((ch) => ch.id === chapterId);
      setChapter(loadedChapter || null);
    }
  }, [chapterId]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar subject={subjectId as any} />
          <main className="flex-1 bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Chapter not found</h2>
              <p className="text-muted-foreground">
                The chapter you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar subject={subjectId as any} />
        <main className="flex-1 bg-background overflow-auto">
          <ChapterContent chapter={chapter} selectedConceptId={conceptId} />
        </main>
      </div>
    </div>
  );
};

export default Chapter;
