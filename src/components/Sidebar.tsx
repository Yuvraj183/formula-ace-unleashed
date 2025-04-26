
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, AlignLeft, Calculator, CheckSquare } from "lucide-react";
import { Subject } from "@/lib/data";

interface AppSidebarProps {
  subject?: Subject;
}

const AppSidebar = ({ subject }: AppSidebarProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Physics", icon: BookOpen, path: "/physics" },
    { title: "Chemistry", icon: AlignLeft, path: "/chemistry" },
    { title: "Mathematics", icon: Calculator, path: "/mathematics" },
    { title: "AI Solver", icon: Calculator, path: "/ai-solver" },
    { title: "Todo List", icon: CheckSquare, path: "/todo" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    
    if (subject) {
      // If we have a subject prop and the path includes that subject, consider it active
      if (path.includes(subject)) return true;
    }
    
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Formula Ace</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    data-active={isActive(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
