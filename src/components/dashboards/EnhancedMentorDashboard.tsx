import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import indexedDBService from "@/integrations/sqlite/database";
import { Users, BarChart3, TrendingUp, Eye, CheckCircle, XCircle, User, Search } from "lucide-react";

const EnhancedMentorDashboard = () => {
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [mentorInput, setMentorInput] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const mentorsData = await indexedDBService.getMentors();
      setMentors(mentorsData || []);
    } catch (error) {
      console.error('Error loading mentors:', error);
    }
  };

  const loadStudentsForMentor = async (mentorName: string) => {
    setLoading(true);
    try {
      // First get students assigned to this mentor
      const studentsData = await indexedDBService.select('students', { mentor_name: mentorName });

      if (!studentsData || studentsData.length === 0) {
        toast({
          title: "No Students Found",
          description: `No students are assigned to mentor: ${mentorName}`,
          variant: "destructive",
        });
        setStudents([]);
        return;
      }

      // Get test status from mentor_portal_data table
      const rollNumbers = studentsData.map(student => student.roll_number);
      
      const portalData = await indexedDBService.select('mentor_portal_data', {});
      const filteredPortalData = portalData.filter(record => rollNumbers.includes(record.roll_no));

      // Get personality test results for completed tests
      const personalityResults = await indexedDBService.select('personality_results', {});
      const filteredPersonalityResults = personalityResults.filter(result => rollNumbers.includes(result.roll_no));

      // Map students with their test completion status and results
      const studentsWithResults = studentsData.map(student => {
        const portalRecord = filteredPortalData.find(record => record.roll_no === student.roll_number);
        const testResult = filteredPersonalityResults.find(result => result.roll_no === student.roll_number);
        const testCompleted = portalRecord?.test_status === 'Completed';
        
        return {
          ...student,
          personality_results: testCompleted && testResult ? [testResult] : [],
          testCompleted,
        };
      });

      setStudents(studentsWithResults);
      
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load students for this mentor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSearch = async () => {
    if (!mentorInput.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a mentor name or ID.",
        variant: "destructive"
      });
      return;
    }

    const mentor = mentors.find(m => 
      m.employee_id?.toLowerCase() === mentorInput.toLowerCase() || 
      m.name.toLowerCase().includes(mentorInput.toLowerCase().trim())
    );
    
    if (mentor) {
      setSelectedMentor(mentor);
      setSelectedStudent(null);
      await loadStudentsForMentor(mentor.name);
    } else {
      toast({
        title: "Mentor Not Found",
        description: "No mentor found with the provided name or ID.",
        variant: "destructive"
      });
    }
  };

  const handleViewResults = (student: any) => {
    setSelectedStudent(student);
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
  };

  const handleBackToLogin = () => {
    setSelectedMentor(null);
    setSelectedStudent(null);
    setMentorInput("");
  };

  // If viewing student results
  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Test Results</h2>
            <p className="text-gray-600">{selectedStudent.name} - {selectedStudent.rollNumber}</p>
          </div>
          <Button variant="outline" onClick={handleBackToStudents}>
            Back to Students
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">Personality Assessment Results</CardTitle>
              <CardDescription>Big Five Personality Traits</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStudent.personality_results && selectedStudent.personality_results.length > 0 ? (
                <div className="space-y-4">
                  {[
                    { name: 'Openness', score: selectedStudent.personality_results[0].openness_score },
                    { name: 'Conscientiousness', score: selectedStudent.personality_results[0].conscientiousness_score },
                    { name: 'Extraversion', score: selectedStudent.personality_results[0].extraversion_score },
                    { name: 'Agreeableness', score: selectedStudent.personality_results[0].agreeableness_score },
                    { name: 'Neuroticism', score: selectedStudent.personality_results[0].neuroticism_score }
                  ].map(({ name, score }) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{name}</span>
                        <span className="text-sm font-bold">{Number(score).toFixed(1)}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${(Number(score) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No test results available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold">Test Completion Date</Label>
                <p className="text-sm text-gray-600">
                  {selectedStudent.personality_results?.[0]?.completed_at 
                    ? new Date(selectedStudent.personality_results[0].completed_at).toLocaleDateString()
                    : 'Not completed'
                  }
                </p>
              </div>
              <div>
                <Label className="font-semibold">Student Information</Label>
                <div className="bg-emerald-50 p-3 rounded-lg mt-2 space-y-1">
                  <p className="text-sm text-gray-700">Roll: {selectedStudent.roll_number}</p>
                  <p className="text-sm text-gray-700">Age: {selectedStudent.age || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Academic Year: {selectedStudent.academic_year || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Education: {selectedStudent.education || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If mentor is selected, show their students
  if (selectedMentor) {
    const completedTests = students.filter(s => s.personality_results && s.personality_results.length > 0).length;
    const completionRate = students.length > 0 ? Math.round((completedTests / students.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome, {selectedMentor.name}</h2>
            <p className="text-gray-600">{selectedMentor.department || 'Department'} • {students.length} Students Assigned</p>
          </div>
          <Button variant="outline" onClick={handleBackToLogin}>
            Switch Mentor
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{students.length}</div>
              <p className="text-sm text-gray-600">Under your supervision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Tests Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{completedTests}</div>
              <p className="text-sm text-gray-600">Out of {students.length} students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completionRate}%</div>
              <p className="text-sm text-gray-600">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Students</CardTitle>
            <CardDescription>Monitor psychometric test completion and view results</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading students...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => {
                  const hasResults = student.personality_results && student.personality_results.length > 0;
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 rounded-full p-2">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Roll: {student.roll_number}</h3>
                          <p className="text-sm text-gray-600">Year: {student.academic_year || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {hasResults ? (
                          <>
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Test Completed
                            </Badge>
                            <Button 
                              size="sm" 
                              onClick={() => handleViewResults(student)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Test Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                {students.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No students assigned to this mentor.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default mentor login view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mentor Portal</h2>
        <p className="text-gray-600">Enter your details to access your student dashboard</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-purple-600" />
            Mentor Authentication
          </CardTitle>
          <CardDescription>
            Enter your mentor ID or name to access your students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mentorInput">Mentor ID or Name</Label>
            <Input
              id="mentorInput"
              placeholder="e.g., M001 or Dr. Mentor 1"
              value={mentorInput}
              onChange={(e) => setMentorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMentorSearch()}
            />
          </div>
          <Button 
            onClick={handleMentorSearch} 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!mentorInput.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            Access Dashboard
          </Button>
          
          {mentorInput && !selectedMentor && (
            <p className="text-sm text-red-600 text-center">
              Mentor not found. Please check your ID or name.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Available Mentors</CardTitle>
          <CardDescription className="text-center">
            Quick reference for mentor IDs and names
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {mentors.slice(0, 10).map((mentor) => (
              <div key={mentor.id} className="flex justify-between p-2 hover:bg-gray-50 rounded">
                <span className="font-medium">{mentor.employee_id || mentor.name}</span>
                <span className="text-gray-600">{mentor.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Showing first 10 mentors. Total: {mentors.length} mentors available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMentorDashboard;