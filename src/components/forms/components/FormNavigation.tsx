
import { Button } from "@/components/ui/button";
import { Save, Send, Loader2 } from "lucide-react";

interface FormNavigationProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const FormNavigation = ({ 
  currentSection, 
  totalSections, 
  onPrevious, 
  onNext, 
  onSave, 
  onSubmit,
  isSubmitting = false
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button 
        variant="outline" 
        onClick={onPrevious} 
        disabled={currentSection === 1 || isSubmitting}
      >
        Previous
      </Button>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={onSave}
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Progress
        </Button>

        {currentSection === totalSections ? (
          <Button 
            onClick={onSubmit} 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Assessment
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            Next Section
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
