
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionProps } from "../types/counselingFormTypes";

const FamilyHistorySection = ({ formData, onInputChange, onCheckboxChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-emerald-700">2) Family History</h3>
      
      <div>
        <Label htmlFor="familyHistory">Enter family history details *</Label>
        <Textarea
          id="familyHistory"
          value={formData.familyHistory}
          onChange={(e) => onInputChange("familyHistory", e.target.value)}
          className="mt-1"
          rows={4}
          placeholder="Enter detailed family history information..."
        />
      </div>

      <div>
        <Label>a) Socio economic status</Label>
        <RadioGroup
          value={formData.annualIncome}
          onValueChange={(value) => onInputChange("annualIncome", value)}
          className="flex flex-wrap gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="below-2lakh" id="below-2lakh" />
            <Label htmlFor="below-2lakh">Annual Income &lt;2 lakh</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2l-8l" id="2l-8l" />
            <Label htmlFor="2l-8l">2L-8L</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="8l-15l" id="8l-15l" />
            <Label htmlFor="8l-15l">8L-15L</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="above-15l" id="above-15l" />
            <Label htmlFor="above-15l">&gt;15L</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>b) Leadership Pattern</Label>
        <RadioGroup
          value={formData.leadershipPattern}
          onValueChange={(value) => onInputChange("leadershipPattern", value)}
          className="flex space-x-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lead" id="lead" />
            <Label htmlFor="lead">Lead</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="influence" id="influence" />
            <Label htmlFor="influence">Influence</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="guide" id="guide" />
            <Label htmlFor="guide">Guide</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>c) Role of Function</Label>
        <div className="space-y-3 mt-2">
          {["Joint family", "Nuclear family", "Single earning member", "More than one earning member"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={(formData.roleOfFunction as string[]).includes(option)}
                onCheckedChange={(checked) => onCheckboxChange("roleOfFunction", option, checked as boolean)}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>d) Communication</Label>
        <RadioGroup
          value={formData.communication}
          onValueChange={(value) => onInputChange("communication", value)}
          className="flex space-x-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="comm-poor" />
            <Label htmlFor="comm-poor">Poor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="comm-fair" />
            <Label htmlFor="comm-fair">Fair</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="comm-good" />
            <Label htmlFor="comm-good">Good</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very-good" id="comm-very-good" />
            <Label htmlFor="comm-very-good">Very Good</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default FamilyHistorySection;
