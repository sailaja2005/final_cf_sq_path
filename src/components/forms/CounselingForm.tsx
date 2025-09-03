import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import indexedDBService from "@/integrations/sqlite/database";
import { CounselingFormData } from "./types/counselingFormTypes";
import { mapFormDataToDatabase } from "@/utils/counselingFormMapper";
import GeneralInformationSection from "./sections/GeneralInformationSection";
import FamilyHistorySection from "./sections/FamilyHistorySection";
import GeneralBehaviourSection from "./sections/GeneralBehaviourSection";
import SpeechSection from "./sections/SpeechSection";
import ThoughtSection from "./sections/ThoughtSection";
import FeelingsEmotionsSection from "./sections/FeelingsEmotionsSection";
import CounselorRemarksSection from "./sections/CounselorRemarksSection";
import FormNavigation from "./components/FormNavigation";

interface CounselingFormProps {
  onBack: () => void;
  editingAssessment?: any;
}

const CounselingForm = ({ onBack, editingAssessment }: CounselingFormProps) => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(editingAssessment ? 7 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSections = 7;

  const [formData, setFormData] = useState<CounselingFormData>(() => {
    if (editingAssessment) {
      return {
        // Map existing assessment data to form data
        studentName: editingAssessment.studentName || "",
        rollNumber: editingAssessment.rollNumber || "",
        age: editingAssessment.age || "",
        gender: editingAssessment.gender || "",
        address: editingAssessment.address || "",
        education: editingAssessment.education || "",
        fatherName: editingAssessment.fatherName || "",
        motherName: editingAssessment.motherName || "",
        guardianName: editingAssessment.guardianName || "",
        fatherOccupation: editingAssessment.fatherOccupation || "",
        motherOccupation: editingAssessment.motherOccupation || "",
        guardianOccupation: editingAssessment.guardianOccupation || "",
        socioEconomicStatus: editingAssessment.socioEconomicStatus || "",
        studentMobile: editingAssessment.studentMobile || "",
        fatherMobile: editingAssessment.fatherMobile || "",
        motherMobile: editingAssessment.motherMobile || "",
        guardianMobile: editingAssessment.guardianMobile || "",
        studentEmail: editingAssessment.studentEmail || "",
        fatherEmail: editingAssessment.fatherEmail || "",
        motherEmail: editingAssessment.motherEmail || "",
        guardianEmail: editingAssessment.guardianEmail || "",
        familyHistory: editingAssessment.familyHistory || "",
        annualIncome: editingAssessment.annualIncome || "",
        leadershipPattern: editingAssessment.leadershipPattern || "",
        roleOfFunction: editingAssessment.roleOfFunction || [],
        communication: editingAssessment.communication || "",
        eatingHabit: editingAssessment.eatingHabit || "",
        sleepingHabit: editingAssessment.sleepingHabit || "",
        cleanlinessHabit: editingAssessment.cleanlinessHabit || "",
        dressSense: editingAssessment.dressSense || "",
        approachTowardsFaculty: editingAssessment.approachTowardsFaculty || "",
        consciousnessOfSurroundings: editingAssessment.consciousnessOfSurroundings || "",
        inTouchWithSurroundings: editingAssessment.inTouchWithSurroundings || "",
        approachOfStudent: editingAssessment.approachOfStudent || "",
        responsivenessOfStudent: editingAssessment.responsivenessOfStudent || "",
        mannerism: editingAssessment.mannerism || "",
        formOfUtterances: editingAssessment.formOfUtterances || "",
        spontaneous: editingAssessment.spontaneous || "",
        speechMannerism: editingAssessment.speechMannerism || "",
        tone: editingAssessment.tone || "",
        speech: editingAssessment.speech || "",
        reactionTime: editingAssessment.reactionTime || "",
        relevanceAndCoherence: editingAssessment.relevanceAndCoherence || "",
        prosody: editingAssessment.prosody || "",
        flightOfIdeas: editingAssessment.flightOfIdeas || "",
        retardationOfThinking: editingAssessment.retardationOfThinking || "",
        circumstantial: editingAssessment.circumstantial || "",
        preservation: editingAssessment.preservation || "",
        thoughtBlocks: editingAssessment.thoughtBlocks || "",
        obsession: editingAssessment.obsession || "",
        hallucinations: editingAssessment.hallucinations || "",
        delusions: editingAssessment.delusions || "",
        sinAndGuilt: editingAssessment.sinAndGuilt || "",
        range: editingAssessment.range || "",
        intensityOfExpression: editingAssessment.intensityOfExpression || "",
        reactivity: editingAssessment.reactivity || "",
        mood: editingAssessment.mood || "",
        diurnalVariations: editingAssessment.diurnalVariations || "",
        congruityWith: editingAssessment.congruityWith || "",
        appropriateness: editingAssessment.appropriateness || "",
        liability: editingAssessment.liability || "",
        levelOfAwareness: editingAssessment.levelOfAwareness || "",
        insight: editingAssessment.insight || "",
        orientation: editingAssessment.orientation || "",
        memory: editingAssessment.memory || "",
        intelligence: editingAssessment.intelligence || "",
        judgement: editingAssessment.judgement || "",
        abstraction: editingAssessment.abstraction || "",
        counselorRemarks: editingAssessment.counselorRemarks || "",
        approved: editingAssessment.approved || false
      };
    }

    return {
      // Default empty form data
      studentName: "",
      rollNumber: "",
      age: "",
      gender: "",
      address: "",
      education: "",
      fatherName: "",
      motherName: "",
      guardianName: "",
      fatherOccupation: "",
      motherOccupation: "",
      guardianOccupation: "",
      socioEconomicStatus: "",
      studentMobile: "",
      fatherMobile: "",
      motherMobile: "",
      guardianMobile: "",
      studentEmail: "",
      fatherEmail: "",
      motherEmail: "",
      guardianEmail: "",
      familyHistory: "",
      annualIncome: "",
      leadershipPattern: "",
      roleOfFunction: [],
      communication: "",
      eatingHabit: "",
      sleepingHabit: "",
      cleanlinessHabit: "",
      dressSense: "",
      approachTowardsFaculty: "",
      consciousnessOfSurroundings: "",
      inTouchWithSurroundings: "",
      approachOfStudent: "",
      responsivenessOfStudent: "",
      mannerism: "",
      formOfUtterances: "",
      spontaneous: "",
      speechMannerism: "",
      tone: "",
      speech: "",
      reactionTime: "",
      relevanceAndCoherence: "",
      prosody: "",
      flightOfIdeas: "",
      retardationOfThinking: "",
      circumstantial: "",
      preservation: "",
      thoughtBlocks: "",
      obsession: "",
      hallucinations: "",
      delusions: "",
      sinAndGuilt: "",
      range: "",
      intensityOfExpression: "",
      reactivity: "",
      mood: "",
      diurnalVariations: "",
      congruityWith: "",
      appropriateness: "",
      liability: "",
      levelOfAwareness: "",
      insight: "",
      orientation: "",
      memory: "",
      intelligence: "",
      judgement: "",
      abstraction: "",
      counselorRemarks: "",
      approved: false
    };
  });

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentValues = formData[field as keyof typeof formData] as string[];
    if (checked) {
      handleInputChange(field, [...currentValues, value]);
    } else {
      handleInputChange(field, currentValues.filter(item => item !== value));
    }
  };

  const handleSaveProgress = async () => {
    if (!formData.studentName.trim() || !formData.rollNumber.trim()) {
      toast({
        title: "Required Information Missing",
        description: "Please fill in the student's name and roll number before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      const dbData = mapFormDataToDatabase(formData);
      
      // Check if assessment already exists
      const existingAssessments = await indexedDBService.select('counseling_assessments', {
        student_name: formData.studentName,
        roll_number: formData.rollNumber
      });

      if (existingAssessments.length > 0) {
        // Update existing assessment
        const existingAssessment = existingAssessments[0];
        const success = await indexedDBService.update('counseling_assessments', dbData, { id: existingAssessment.id });
        if (!success) throw new Error('Failed to update assessment');
      } else {
        // Insert new assessment
        const result = await indexedDBService.insert('counseling_assessments', dbData);
        if (!result) throw new Error('Failed to insert assessment');
      }

      toast({
        title: "Progress Saved",
        description: "Your form data has been saved successfully to the database.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.studentName.trim() || !formData.rollNumber.trim()) {
      toast({
        title: "Required Information Missing",
        description: "Please fill in the student's name and roll number before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Validate that the student exists in the database
    try {
      const existingStudents = await indexedDBService.getStudents();
      const studentExists = existingStudents.find(student => 
        student.roll_number === formData.rollNumber.trim() && 
        student.name === formData.studentName.trim()
      );

      if (!studentExists) {
        toast({
          title: "Student Not Found",
          description: "This student does not exist in the database. Please ensure you have selected a valid student from the list or contact the administrator to add the student first.",
          variant: "destructive"
        });
        return;
      }
    } catch (error) {
      console.error('Error validating student:', error);
      toast({
        title: "Validation Error",
        description: "Unable to validate student information. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dbData = mapFormDataToDatabase(formData);
      
      // Check if assessment already exists
      const existingAssessments = await indexedDBService.select('counseling_assessments', {
        student_name: formData.studentName,
        roll_number: formData.rollNumber
      });

      if (existingAssessments.length > 0) {
        // Update existing assessment
        const existingAssessment = existingAssessments[0];
        const success = await indexedDBService.update('counseling_assessments', dbData, { id: existingAssessment.id });
        if (!success) throw new Error('Failed to update assessment');
      } else {
        // Insert new assessment
        const result = await indexedDBService.insert('counseling_assessments', dbData);
        if (!result) throw new Error('Failed to insert assessment');
      }

      // Also update localStorage for compatibility
      const existingAssessmentsLocal = JSON.parse(localStorage.getItem('submittedAssessments') || '[]');
      const newAssessment = {
        ...formData,
        submissionDate: editingAssessment?.submissionDate || new Date().toISOString().split('T')[0],
        status: formData.approved ? 'approved' : 'pending',
        testCompleted: editingAssessment?.testCompleted || false,
        counselorRemarks: formData.counselorRemarks || `Student ${formData.studentName} has been assessed and ${formData.approved ? 'approved' : 'is awaiting approval'} for personality testing.`
      };
      
      if (editingAssessment) {
        // Update existing assessment in localStorage
        const assessmentIndex = existingAssessmentsLocal.findIndex(
          (assessment) => assessment.studentName === editingAssessment.studentName && 
                          assessment.rollNumber === editingAssessment.rollNumber
        );
        if (assessmentIndex !== -1) {
          existingAssessmentsLocal[assessmentIndex] = newAssessment;
        } else {
          existingAssessmentsLocal.push(newAssessment);
        }
      } else {
        // Add new assessment
        existingAssessmentsLocal.push(newAssessment);
      }
      localStorage.setItem('submittedAssessments', JSON.stringify(existingAssessmentsLocal));

      toast({
        title: editingAssessment ? "Assessment Updated Successfully" : "Assessment Submitted Successfully",
        description: `Assessment for ${formData.studentName} has been ${editingAssessment ? 'updated' : 'completed'}${formData.approved ? ' and approved for personality testing. The student can now login to take the test.' : ' and is awaiting approval.'}`,
      });
      
      onBack();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSection = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = () => {
    const sectionProps = {
      formData,
      onInputChange: handleInputChange,
      onCheckboxChange: handleCheckboxChange
    };

    switch (currentSection) {
      case 1:
        return <GeneralInformationSection {...sectionProps} />;
      case 2:
        return <FamilyHistorySection {...sectionProps} />;
      case 3:
        return <GeneralBehaviourSection {...sectionProps} />;
      case 4:
        return <SpeechSection {...sectionProps} />;
      case 5:
        return <ThoughtSection {...sectionProps} />;
      case 6:
        return <FeelingsEmotionsSection {...sectionProps} />;
      case 7:
        return <CounselorRemarksSection {...sectionProps} isEditing={!!editingAssessment} />;
      default:
        return <GeneralInformationSection {...sectionProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        <div className="text-sm text-gray-600">
          Section {currentSection} of {totalSections}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl text-emerald-700">STUDENT COUNSELLING FORM</CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSection()}

          <FormNavigation
            currentSection={currentSection}
            totalSections={totalSections}
            onPrevious={prevSection}
            onNext={nextSection}
            onSave={handleSaveProgress}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselingForm;
