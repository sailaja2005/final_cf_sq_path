
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, FileText, BarChart3, Clock, CheckCircle, AlertCircle, User, Hash, XCircle } from "lucide-react";
import PersonalityTest from "@/components/assessment/PersonalityTest";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const [showTest, setShowTest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ name: "", rollNumber: "" });
  const [studentAssessment, setStudentAssessment] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if student is already logged in
    const storedLogin = localStorage.getItem('studentLogin');
    if (storedLogin) {
      const loginInfo = JSON.parse(storedLogin);
      setIsLoggedIn(true);
      setLoginData(loginInfo);
      loadStudentAssessment(loginInfo.name, loginInfo.rollNumber);
    }
  }, []);

  const loadStudentAssessment = (name: string, rollNumber: string) => {
    const assessments = JSON.parse(localStorage.getItem('submittedAssessments') || '[]');
    console.log('All assessments:', assessments);
    console.log('Looking for:', { name: name.toLowerCase().trim(), rollNumber: rollNumber.trim() });
    
    const studentAssess = assessments.find(
      (assessment: any) => {
        const assessmentName = assessment.studentName.toLowerCase().trim();
        const assessmentRoll = assessment.rollNumber.trim();
        const searchName = name.toLowerCase().trim();
        const searchRoll = rollNumber.trim();
        
        console.log('Comparing:', { assessmentName, assessmentRoll, searchName, searchRoll });
        
        return assessmentName === searchName && assessmentRoll === searchRoll;
      }
    );
    
    console.log('Found assessment:', studentAssess);
    setStudentAssessment(studentAssess || null);
  };

  const handleLogin = () => {
    if (!loginData.name.trim() || !loginData.rollNumber.trim()) {
      toast({
        title: "Login Required",
        description: "Please enter both your name and roll number.",
        variant: "destructive"
      });
      return;
    }

    // Check if assessment exists for this student
    const assessments = JSON.parse(localStorage.getItem('submittedAssessments') || '[]');
    const studentAssess = assessments.find(
      (assessment: any) => {
        const assessmentName = assessment.studentName.toLowerCase().trim();
        const assessmentRoll = assessment.rollNumber.trim();
        const searchName = loginData.name.toLowerCase().trim();
        const searchRoll = loginData.rollNumber.trim();
        
        return assessmentName === searchName && assessmentRoll === searchRoll;
      }
    );

    if (!studentAssess) {
      toast({
        title: "No Assessment Found",
        description: "No counselor assessment found for this student. Please contact your counselor.",
        variant: "destructive"
      });
      return;
    }

    setStudentAssessment(studentAssess);
    setIsLoggedIn(true);
    localStorage.setItem('studentLogin', JSON.stringify(loginData));
    
    toast({
      title: "Login Successful",
      description: `Welcome ${loginData.name}! You can now access your assessment.`,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ name: "", rollNumber: "" });
    setStudentAssessment(null);
    localStorage.removeItem('studentLogin');
  };

  const handleTestComplete = () => {
    if (studentAssessment) {
      // Reload the assessment to get updated data
      loadStudentAssessment(loginData.name, loginData.rollNumber);
    }
    setShowTest(false);
  };

  if (showTest) {
    return (
      <PersonalityTest 
        onBack={() => setShowTest(false)} 
        onComplete={handleTestComplete}
        studentId={studentAssessment?.studentId}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                <Brain className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Student Login</CardTitle>
              <CardDescription>
                Enter your details to access your personality assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={loginData.name}
                    onChange={(e) => setLoginData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="Enter your roll number"
                    value={loginData.rollNumber}
                    onChange={(e) => setLoginData(prev => ({ ...prev, rollNumber: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
                Access Dashboard
              </Button>

              <p className="text-xs text-gray-500 text-center">
                You can only access if your counselor has completed your assessment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Dashboard</h2>
          <p className="text-gray-600">Welcome {loginData.name} (Roll No: {loginData.rollNumber})</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Brain className="h-5 w-5 mr-2" />
              Personality Assessment
            </CardTitle>
            <CardDescription>Big Five Personality Test</CardDescription>
          </CardHeader>
          <CardContent>
            {studentAssessment ? (
              <div className="space-y-4">
                {studentAssessment.testCompleted ? (
                  <div className="space-y-4">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Test Completed</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      You have successfully completed the personality assessment. Your results have been processed and are available below.
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">Completed on: {studentAssessment.testCompletionDate}</p>
                    </div>
                  </div>
                ) : studentAssessment.status === 'approved' ? (
                  <div className="space-y-4">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Approved for Testing</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your counselor has approved you for the personality assessment. This comprehensive test contains 50 questions divided into 5 sections and will help identify your personality traits.
                    </p>
                    <Button onClick={() => setShowTest(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                      Start Personality Test (50 Questions)
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center text-amber-600">
                      <XCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Awaiting Counselor Approval</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your counselor has completed your assessment but you are not yet approved for testing. Please wait for approval or contact your counselor.
                    </p>
                    <Button disabled className="w-full">
                      Awaiting Counselor Approval
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center text-gray-500">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">No Assessment Found</span>
                </div>
                <p className="text-sm text-gray-600">
                  No counselor assessment found. Please contact your counselor to complete your assessment first.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <FileText className="h-5 w-5 mr-2" />
              Counselor Feedback
            </CardTitle>
            <CardDescription>Latest remarks and suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentAssessment ? (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{studentAssessment.counselorRemarks || "Assessment completed successfully. Student shows good potential for personality testing."}</p>
                  <p className="text-xs text-gray-500 mt-2">Date: {studentAssessment.submissionDate}</p>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No counselor feedback available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {studentAssessment && studentAssessment.testCompleted && studentAssessment.personalityScores && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Your Personality Test Results
            </CardTitle>
            <CardDescription>Big Five Personality Traits Analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {Object.entries(studentAssessment.personalityScores).map(([trait, score]) => (
                <div key={trait} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm capitalize font-medium">{trait}:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full" 
                        style={{ width: `${(Number(score) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10">{Number(score).toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {studentAssessment.personalityAnalysis && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Personalized Analysis & Recommendations</h4>
                <ul className="space-y-2">
                  {studentAssessment.personalityAnalysis.map((analysis: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">• {analysis}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Assessment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentAssessment ? (
              <>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Counselor Assessment</h4>
                    <p className="text-sm text-gray-600">Completed on {studentAssessment.submissionDate}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className={`font-semibold ${studentAssessment.testCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      Big Five Personality Test (50 Questions)
                    </h4>
                    <p className="text-sm text-gray-600">
                      {studentAssessment.testCompleted 
                        ? `Completed on ${studentAssessment.testCompletionDate}`
                        : studentAssessment.status === 'approved' 
                        ? "Ready to complete" 
                        : "Awaiting approval"}
                    </p>
                  </div>
                  {studentAssessment.testCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : studentAssessment.status === 'approved' ? (
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No assessment history available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
