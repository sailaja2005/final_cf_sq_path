
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionProps } from "../types/counselingFormTypes";

const GeneralBehaviourSection = ({ formData, onInputChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-emerald-700">3) General Behaviour</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>a) Eating Habit</Label>
          <RadioGroup
            value={formData.eatingHabit}
            onValueChange={(value) => onInputChange("eatingHabit", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="eating-good" />
              <Label htmlFor="eating-good">Good</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fair" id="eating-fair" />
              <Label htmlFor="eating-fair">Fair</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="eating-poor" />
              <Label htmlFor="eating-poor">Poor</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>b) Sleeping Habit</Label>
          <RadioGroup
            value={formData.sleepingHabit}
            onValueChange={(value) => onInputChange("sleepingHabit", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="sleep-regular" />
              <Label htmlFor="sleep-regular">Regular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="irregular" id="sleep-irregular" />
              <Label htmlFor="sleep-irregular">Irregular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disturbed" id="sleep-disturbed" />
              <Label htmlFor="sleep-disturbed">Disturbed</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>c) Cleanliness Habit</Label>
          <RadioGroup
            value={formData.cleanlinessHabit}
            onValueChange={(value) => onInputChange("cleanlinessHabit", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="neat" id="clean-neat" />
              <Label htmlFor="clean-neat">Neat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="untidy" id="clean-untidy" />
              <Label htmlFor="clean-untidy">Untidy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dirty" id="clean-dirty" />
              <Label htmlFor="clean-dirty">Dirty</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>d) Dress Sense</Label>
          <RadioGroup
            value={formData.dressSense}
            onValueChange={(value) => onInputChange("dressSense", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="appropriate" id="dress-appropriate" />
              <Label htmlFor="dress-appropriate">Appropriate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inappropriate" id="dress-inappropriate" />
              <Label htmlFor="dress-inappropriate">Inappropriate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bizarre" id="dress-bizarre" />
              <Label htmlFor="dress-bizarre">Bizarre</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>e) Approach towards Faculty</Label>
          <RadioGroup
            value={formData.approachTowardsFaculty}
            onValueChange={(value) => onInputChange("approachTowardsFaculty", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friendly" id="faculty-friendly" />
              <Label htmlFor="faculty-friendly">Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reserved" id="faculty-reserved" />
              <Label htmlFor="faculty-reserved">Reserved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hostile" id="faculty-hostile" />
              <Label htmlFor="faculty-hostile">Hostile</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>f) Consciousness of Surroundings</Label>
          <RadioGroup
            value={formData.consciousnessOfSurroundings}
            onValueChange={(value) => onInputChange("consciousnessOfSurroundings", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aware" id="conscious-aware" />
              <Label htmlFor="conscious-aware">Aware</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partially-aware" id="conscious-partial" />
              <Label htmlFor="conscious-partial">Partially Aware</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unaware" id="conscious-unaware" />
              <Label htmlFor="conscious-unaware">Unaware</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default GeneralBehaviourSection;
