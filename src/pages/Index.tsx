
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, GraduationCap, Brain, FileText, BarChart3, Shield } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CounselorDashboard from "@/components/dashboards/CounselorDashboard";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import EnhancedMentorDashboard from "@/components/dashboards/EnhancedMentorDashboard";
import CounselorLogin from "./CounselorLogin";
import MentorLogin from "./MentorLogin";
import AdminLogin from "./AdminLogin";
import StudentLogin from "./StudentLogin";
import { getUserSession, clearUserSession } from "@/utils/credentialsAuth";

const Index = () => {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRoleLogin, setShowRoleLogin] = useState<string | null>(null);

  useEffect(() => {
    // Check for credentials-based sessions (counselor/mentor/admin/student)
    const credentialsSession = getUserSession();
    if (credentialsSession) {
      setCurrentRole(credentialsSession.role);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleRoleSelection = (role: string) => {
    if (role === 'counselor' || role === 'mentor' || role === 'admin' || role === 'student') {
      setShowRoleLogin(role);
    } else {
      setCurrentRole(role);
    }
  };

  const handleLogout = async () => {
    // Clear credentials-based session
    clearUserSession();
    setIsLoggedIn(false);
    setCurrentRole(null);
    setShowRoleLogin(null);
  };

  const handleCredentialsLoginSuccess = (role: string) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    setShowRoleLogin(null);
  };

  const handleBackToPortalSelection = () => {
    setShowRoleLogin(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show specific role login pages
  if (showRoleLogin === 'student') {
    return (
      <StudentLogin 
        onLoginSuccess={() => handleCredentialsLoginSuccess('student')} 
        onBack={handleBackToPortalSelection}
      />
    );
  }

  if (showRoleLogin === 'counselor') {
    return (
      <CounselorLogin 
        onLoginSuccess={() => handleCredentialsLoginSuccess('counselor')} 
        onBack={handleBackToPortalSelection}
      />
    );
  }

  if (showRoleLogin === 'mentor') {
    return (
      <MentorLogin 
        onLoginSuccess={() => handleCredentialsLoginSuccess('mentor')} 
        onBack={handleBackToPortalSelection}
      />
    );
  }

  if (showRoleLogin === 'admin') {
    return (
      <AdminLogin 
        onLoginSuccess={() => handleCredentialsLoginSuccess('admin')} 
        onBack={handleBackToPortalSelection}
      />
    );
  }

  if (isLoggedIn && !currentRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 rounded-full p-4">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Svasthya-Student Wellbeing Tracking ,Monitoring and Management Software
            </h1>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-8xl mx-auto mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("counselor")}>
              <CardHeader className="text-center">
                <div className="bg-emerald-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <UserCheck className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl">Counselor Portal</CardTitle>
                <CardDescription>
                  Assess students and provide professional guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                    Complete student assessment forms
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-emerald-500" />
                    Provide remarks and suggestions
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-emerald-500" />
                    Approve personality tests
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                  Enter as Counselor
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("student")}>
              <CardHeader className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Student Portal</CardTitle>
                <CardDescription>
                  Take personality assessments and view results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-blue-500" />
                    Big Five Personality Test
                  </li>
                  <li className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                    View assessment results
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    Access counselor feedback
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Enter as Student
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("mentor")}>
              <CardHeader className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Mentor Portal</CardTitle>
                <CardDescription>
                  Monitor student progress and provide guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                    View comprehensive profiles
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                    Access counselor assessments
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    Support student development
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  Enter as Mentor
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("admin")}>
              <CardHeader className="text-center">
                <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <Shield className="h-10 w-10 text-orange-600" />
                </div>
                <CardTitle className="text-2xl">Admin Portal</CardTitle>
                <CardDescription>
                  Comprehensive oversight of all student assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-orange-500" />
                    View all students and mentors
                  </li>
                  <li className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-orange-500" />
                    Monitor test completion rates
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-orange-500" />
                    Access detailed analysis reports
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Enter as Admin
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>Secure, professional assessment platform designed for educational institutions</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn && currentRole) {
    return (
      <DashboardLayout currentRole={currentRole} onLogout={handleLogout}>
        {currentRole === "counselor" && <CounselorDashboard />}
        {currentRole === "student" && <StudentDashboard />}
        {currentRole === "mentor" && <EnhancedMentorDashboard />}
        {currentRole === "admin" && <AdminDashboard />}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 rounded-full p-4">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Svasthya-Student Wellbeing Tracking ,Monitoring and Management Software
          </h1>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-8xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("counselor")}>
            <CardHeader className="text-center">
              <div className="bg-emerald-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                <UserCheck className="h-10 w-10 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl">Counselor Portal</CardTitle>
              <CardDescription>
                Assess students and provide professional guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                  Complete student assessment forms
                </li>
                <li className="flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-emerald-500" />
                  Provide remarks and suggestions
                </li>
                <li className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-2 text-emerald-500" />
                  Approve personality tests
                </li>
              </ul>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                Enter as Counselor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("student")}>
            <CardHeader className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>
                Take personality assessments and view results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-blue-500" />
                  Big Five Personality Test
                </li>
                <li className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                  View assessment results
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  Access counselor feedback
                </li>
              </ul>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Enter as Student
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("mentor")}>
            <CardHeader className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Mentor Portal</CardTitle>
              <CardDescription>
                Monitor student progress and provide guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                  View comprehensive profiles
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-500" />
                  Access counselor assessments
                </li>
                <li className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-500" />
                  Support student development
                </li>
              </ul>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Enter as Mentor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleRoleSelection("admin")}>
            <CardHeader className="text-center">
              <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Shield className="h-10 w-10 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                Comprehensive oversight of all student assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                  View all students and mentors
                </li>
                <li className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-orange-500" />
                  Monitor test completion rates
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                  Access detailed analysis reports
                </li>
              </ul>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                Enter as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Secure, professional assessment platform designed for educational institutions</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
