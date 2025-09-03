import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Users, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser, storeUserSession } from "@/utils/credentialsAuth";
import PasswordChangeModal from "@/components/auth/PasswordChangeModal";
import logo from "@/assets/svasthya-logo.png";

interface MentorLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const MentorLogin = ({ onLoginSuccess, onBack }: MentorLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; gmail: string; role: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authenticateUser({
        gmail: email.trim(),
        password: password,
        role: 'mentor'
      });

      if (result.success && result.user) {
        if (result.requiresPasswordChange) {
          setCurrentUser(result.user);
          setCurrentPassword(password);
          setShowPasswordModal(true);
        } else {
          storeUserSession(result.user);
          toast({
            title: "Login Successful",
            description: "Welcome to the Mentor Portal!",
          });
          onLoginSuccess();
        }
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    if (currentUser) {
      storeUserSession(currentUser);
      setShowPasswordModal(false);
      toast({
        title: "Login Successful",
        description: "Welcome to the Mentor Portal!",
      });
      onLoginSuccess();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute top-4 left-4 flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex justify-center">
              <img src={logo} alt="Svasthya Logo" className="h-24 w-24" />
            </div>
            
            <div className="flex justify-center">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16">
                <Users className="h-10 w-10 text-purple-600 mx-auto" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-purple-700">
              Mentor Portal
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in with your mentor credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Signing in..." : "Login as Mentor"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {showPasswordModal && currentUser && (
        <PasswordChangeModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChangeSuccess}
          userId={currentUser.id}
          currentPassword={currentPassword}
        />
      )}
    </>
  );
};

export default MentorLogin;