
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Chat, Lightbulb, Calendar } from "lucide-react";
import { SUBJECTS } from "@/lib/data";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="container mx-auto px-6 py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Master JEE with Formula Ace
              </h1>
              <p className="text-lg opacity-90 mb-8">
                Your complete guide to Physics, Chemistry, and Mathematics formulas, concepts, 
                and solved examples. Ace your JEE preparation with intelligent doubt solving.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => navigate('/physics')}
                >
                  Explore Formulas
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => navigate('/ai-solver')}
                >
                  Ask a Doubt
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <div className="bg-hero-pattern h-24 w-full"></div>
          </div>
        </section>

        {/* Subject Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(SUBJECTS).map(([key, value]) => (
                <div 
                  key={key}
                  className={`${value.bgClass} chapter-card cursor-pointer`}
                  onClick={() => navigate(`/${key}`)}
                >
                  <div className="text-3xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.name}</h3>
                  <p className="text-sm opacity-80">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Formulas</h3>
                <p className="text-gray-600">
                  Access all formulas required for JEE Physics, Chemistry, and Mathematics,
                  neatly organized by chapters with detailed explanations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Chat className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Doubt Solver</h3>
                <p className="text-gray-600">
                  Get your doubts solved instantly with our intelligent AI, which provides
                  step-by-step explanations with mathematical notation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Study Planner</h3>
                <p className="text-gray-600">
                  Organize your study sessions with our interactive todo list and calendar,
                  helping you track progress and manage time effectively.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to boost your JEE preparation?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Start exploring formulas, concepts, and examples or get your doubts solved instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => navigate('/ai-solver')}
              >
                Ask a Doubt Now
              </Button>
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate('/todo')}
              >
                Create Study Plan
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
