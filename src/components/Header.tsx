
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="bg-primary rounded-lg p-1 text-white">
              <span className="font-bold text-xl">F</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Formula Ace
            </h1>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-1">
          <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          <Button variant="ghost" onClick={() => navigate('/physics')}>Physics</Button>
          <Button variant="ghost" onClick={() => navigate('/chemistry')}>Chemistry</Button>
          <Button variant="ghost" onClick={() => navigate('/mathematics')}>Mathematics</Button>
          <Button variant="ghost" onClick={() => navigate('/ai-solver')}>AI Solver</Button>
          <Button variant="ghost" onClick={() => navigate('/todo')}>Todo List</Button>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
