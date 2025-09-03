
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Brain } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  currentRole: string;
  onLogout: () => void;
}

const DashboardLayout = ({ children, currentRole, onLogout }: DashboardLayoutProps) => {
  const getRoleColor = () => {
    switch (currentRole) {
      case "counselor": return "text-emerald-600";
      case "student": return "text-blue-600";
      case "admin": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const getRoleBg = () => {
    switch (currentRole) {
      case "counselor": return "bg-emerald-50 border-emerald-200";
      case "student": return "bg-blue-50 border-blue-200";
      case "admin": return "bg-purple-50 border-purple-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <header className={`${getRoleBg()} border-b`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Brain className={`h-8 w-8 ${getRoleColor()}`} />
            <div>
              <h1 className={`text-xl font-bold ${getRoleColor()}`}>Mind Pathways</h1>
              <p className="text-sm text-gray-600 capitalize">{currentRole} Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
