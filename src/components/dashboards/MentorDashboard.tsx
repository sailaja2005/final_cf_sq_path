
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, TrendingUp, Eye } from "lucide-react";

const MentorDashboard = () => {
  const students = [
    {
      id: 1,
      name: "John Doe",
      personalityScores: {
        openness: 4.2,
        conscientiousness: 3.8,
        extraversion: 3.5,
        agreeableness: 4.1,
        neuroticism: 2.3
      },
      counselorRemarks: "Excellent academic performance with strong analytical skills.",
      testDate: "2024-01-14"
    },
    {
      id: 2,
      name: "Jane Smith",
      personalityScores: {
        openness: 3.9,
        conscientiousness: 4.3,
        extraversion: 4.0,
        agreeableness: 3.7,
        neuroticism: 2.1
      },
      counselorRemarks: "Shows leadership potential and excellent teamwork skills.",
      testDate: "2024-01-13"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h2>
        <p className="text-gray-600">Monitor student progress and provide guidance</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">12</div>
            <p className="text-sm text-gray-600">Under supervision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <p className="text-sm text-gray-600">Completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Progress Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">85%</div>
            <p className="text-sm text-gray-600">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Profiles</CardTitle>
          <CardDescription>Comprehensive view of student assessments and personality insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {students.map((student) => (
              <div key={student.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">Assessment completed: {student.testDate}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-700">Personality Scores</h4>
                    <div className="space-y-2">
                      {Object.entries(student.personalityScores).map(([trait, score]) => (
                        <div key={trait} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{trait}:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(score / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-700">Counselor Remarks</h4>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{student.counselorRemarks}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDashboard;
