
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, CheckCircle, Plus } from "lucide-react";
import CounselingForm from "@/components/forms/CounselingForm";

const CounselorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  
  // Get submitted assessments from localStorage
  const getSubmittedAssessments = () => {
    const stored = localStorage.getItem('submittedAssessments');
    return stored ? JSON.parse(stored) : [];
  };

  const [submittedAssessments, setSubmittedAssessments] = useState(getSubmittedAssessments());

  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingAssessment(null);
    // Refresh assessments when returning from form
    setSubmittedAssessments(getSubmittedAssessments());
  };

  if (showForm) {
    return <CounselingForm onBack={handleBack} editingAssessment={editingAssessment} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h2>
          <p className="text-gray-600">Manage student assessments and provide guidance</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-emerald-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{submittedAssessments.length}</div>
            <p className="text-sm text-gray-600">Assessed students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Active Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{submittedAssessments.filter(a => a.status === 'approved').length}</div>
            <p className="text-sm text-gray-600">Ready for testing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{submittedAssessments.filter(a => a.testCompleted).length}</div>
            <p className="text-sm text-gray-600">Tests completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Assessments</CardTitle>
          <CardDescription>Recently completed student evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          {submittedAssessments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No assessments submitted yet</p>
              <p className="text-sm">Click "New Assessment" to start evaluating a student</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedAssessments.map((assessment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 
                      className="font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      onClick={() => handleEditAssessment(assessment)}
                    >
                      {assessment.studentName}
                    </h4>
                    <p className="text-sm text-gray-600">Roll No: {assessment.rollNumber}</p>
                    <p className="text-sm text-gray-600">Submitted: {assessment.submissionDate}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assessment.testCompleted
                        ? "bg-green-100 text-green-800"
                        : assessment.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {assessment.testCompleted ? "Test Completed" : assessment.status === "approved" ? "Test Approved" : "Assessment Complete"}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAssessment(assessment)}
                    >
                      {assessment.status === "approved" ? "View Details" : "Review & Approve"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselorDashboard;
