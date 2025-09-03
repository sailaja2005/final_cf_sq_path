
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionProps } from "../types/counselingFormTypes";

const ThoughtSection = ({ formData, onInputChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-emerald-700">5) Thought</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>a) Flight of Ideas</Label>
          <RadioGroup
            value={formData.flightOfIdeas}
            onValueChange={(value) => onInputChange("flightOfIdeas", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="flight-present" />
              <Label htmlFor="flight-present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="flight-absent" />
              <Label htmlFor="flight-absent">Absent</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>b) Retardation of Thinking</Label>
          <RadioGroup
            value={formData.retardationOfThinking}
            onValueChange={(value) => onInputChange("retardationOfThinking", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="retardation-present" />
              <Label htmlFor="retardation-present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="retardation-absent" />
              <Label htmlFor="retardation-absent">Absent</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>c) Circumstantial</Label>
          <RadioGroup
            value={formData.circumstantial}
            onValueChange={(value) => onInputChange("circumstantial", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="circumstantial-present" />
              <Label htmlFor="circumstantial-present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="circumstantial-absent" />
              <Label htmlFor="circumstantial-absent">Absent</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>d) Preservation</Label>
          <RadioGroup
            value={formData.preservation}
            onValueChange={(value) => onInputChange("preservation", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="preservation-present" />
              <Label htmlFor="preservation-present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="preservation-absent" />
              <Label htmlFor="preservation-absent">Absent</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>e) Thought Blocks</Label>
          <RadioGroup
            value={formData.thoughtBlocks}
            onValueChange={(value) => onInputChange("thoughtBlocks", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="blocks-present" />
              <Label htmlFor="blocks-present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="blocks-absent" />
              <Label htmlFor="blocks-absent">Absent</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>f) Obsession</Label>
          <RadioGroup
            value={formData.obsession}
            onValueChange={(value) => onInputChange("obsession", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="obsession-present" />
              <Label htmlFor="obsession-present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="obsession-absent" />
              <Label htmlFor="obsession-absent">Absent</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ThoughtSection;
