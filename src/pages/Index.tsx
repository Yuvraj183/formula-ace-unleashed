import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, CheckSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Formula Ace
            </h1>
            <p className="text-xl text-muted-foreground">
              Master JEE with comprehensive formulas and AI-powered doubt solving
            </p>
          </div>

          {/* Subject Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Button
              size="lg"
              className="h-32 text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all"
              onClick={() => navigate('/physics')}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">⚛️</span>
                <span>Physics</span>
              </div>
            </Button>

            <Button
              size="lg"
              className="h-32 text-2xl font-bold bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all"
              onClick={() => navigate('/chemistry')}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🧪</span>
                <span>Chemistry</span>
              </div>
            </Button>

            <Button
              size="lg"
              className="h-32 text-2xl font-bold bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all"
              onClick={() => navigate('/mathematics')}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">📐</span>
                <span>Mathematics</span>
              </div>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              size="lg"
              variant="outline"
              className="h-24 text-xl border-2 hover:bg-primary/10 hover:border-primary shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/ai-solver')}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8" />
                <span>AI Doubt Solver</span>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-24 text-xl border-2 hover:bg-secondary/10 hover:border-secondary shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/todo')}
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="h-8 w-8" />
                <span>Study Planner</span>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
