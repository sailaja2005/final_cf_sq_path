
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionProps } from "../types/counselingFormTypes";

interface CounselorRemarksSectionProps extends SectionProps {
  isEditing?: boolean;
}

const CounselorRemarksSection = ({ formData, onInputChange, isEditing = false }: CounselorRemarksSectionProps) => {
  return (
    <div className="space-y-6">
      {isEditing && (
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Review Assessment for Approval</h3>
          <p className="text-blue-700 text-sm">
            You are reviewing the assessment for <strong>{formData.studentName}</strong> (Roll No: {formData.rollNumber}). 
            Use the approval checkbox below to grant access to the personality test.
          </p>
        </div>
      )}
      <h3 className="text-xl font-semibold text-emerald-700">7) Counselor's Remarks and Recommendation</h3>
      
      <div>
        <Label htmlFor="counselorRemarks">Final Assessment and Recommendations</Label>
        <Textarea
          id="counselorRemarks"
          value={formData.counselorRemarks}
          onChange={(e) => onInputChange("counselorRemarks", e.target.value)}
          className="mt-1"
          rows={6}
          placeholder="Provide your professional assessment, recommendations, and approval for personality testing..."
        />
      </div>

      <div className={`p-6 rounded-lg border-2 ${formData.approved ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'} ${isEditing ? 'shadow-lg' : ''}`}>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="approved"
            checked={formData.approved}
            onCheckedChange={(checked) => onInputChange("approved", checked as boolean)}
            className={isEditing ? 'h-5 w-5' : ''}
          />
          <Label htmlFor="approved" className={`font-semibold ${formData.approved ? 'text-green-800' : 'text-blue-800'} ${isEditing ? 'text-lg' : ''}`}>
            Approve student for personality testing
          </Label>
        </div>
        <p className={`text-sm mt-2 ${formData.approved ? 'text-green-700' : 'text-blue-700'}`}>
          By checking this box, you are approving <strong>{formData.studentName || "the student"}</strong> to take the Big Five Personality Test. 
          The student will be able to log in using their name and roll number to access the test only if approved.
        </p>
        {isEditing && !formData.approved && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ This student is currently waiting for approval to take the personality test.
            </p>
          </div>
        )}
      </div>
      
      {formData.approved && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Assessment Completion</h4>
          <p className="text-sm text-green-700">
            Student <strong>{formData.studentName || "the student"}</strong> will be approved for personality testing upon form submission.
            The student will receive immediate access to the Big Five Personality Test.
          </p>
        </div>
      )}

      {!formData.approved && (
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">Pending Approval</h4>
          <p className="text-sm text-amber-700">
            The assessment will be submitted but the student will not be able to access the personality test until approval is granted.
          </p>
        </div>
      )}
    </div>
  );
};

export default CounselorRemarksSection;
