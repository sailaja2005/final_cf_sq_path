import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { authenticateUser, storeUserSession } from "@/utils/credentialsAuth";
import { useToast } from "@/hooks/use-toast";
import PasswordChangeModal from "@/components/auth/PasswordChangeModal";

interface AdminLoginProps {
  onLoginSuccess: (user: { id: string; gmail: string; role: string }) => void;
  onBack: () => void;
}

const AdminLogin = ({ onLoginSuccess, onBack }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; gmail: string; role: string } | null>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateUser({
        gmail: email,
        password: password,
        role: 'admin'
      });

      if (result.success && result.user) {
        if (result.requiresPasswordChange) {
          setCurrentUser(result.user);
          setShowPasswordChange(true);
        } else {
          storeUserSession(result.user);
          toast({
            title: "Login Successful",
            description: "Welcome to the Admin portal!",
          });
          onLoginSuccess(result.user);
        }
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    if (currentUser) {
      storeUserSession(currentUser);
      toast({
        title: "Password Changed Successfully",
        description: "Welcome to the Admin portal!",
      });
      onLoginSuccess(currentUser);
    }
    setShowPasswordChange(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to access the Admin portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@college.edu"
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
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {showPasswordChange && currentUser && (
        <PasswordChangeModal
          isOpen={showPasswordChange}
          onClose={() => setShowPasswordChange(false)}
          onSuccess={handlePasswordChangeSuccess}
          userId={currentUser.id}
          currentPassword={password}
        />
      )}
    </>
  );
};

export default AdminLogin;