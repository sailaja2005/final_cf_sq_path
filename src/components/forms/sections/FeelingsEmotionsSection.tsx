
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionProps } from "../types/counselingFormTypes";

const FeelingsEmotionsSection = ({ formData, onInputChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-emerald-700">6) Feelings and Emotions</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>a) Range</Label>
          <RadioGroup
            value={formData.range}
            onValueChange={(value) => onInputChange("range", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wide" id="range-wide" />
              <Label htmlFor="range-wide">Wide</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="restricted" id="range-restricted" />
              <Label htmlFor="range-restricted">Restricted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blunt" id="range-blunt" />
              <Label htmlFor="range-blunt">Blunt</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>b) Intensity of Expression</Label>
          <RadioGroup
            value={formData.intensityOfExpression}
            onValueChange={(value) => onInputChange("intensityOfExpression", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="intensity-high" />
              <Label htmlFor="intensity-high">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="intensity-moderate" />
              <Label htmlFor="intensity-moderate">Moderate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="intensity-low" />
              <Label htmlFor="intensity-low">Low</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>c) Reactivity</Label>
          <RadioGroup
            value={formData.reactivity}
            onValueChange={(value) => onInputChange("reactivity", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="responsive" id="reactivity-responsive" />
              <Label htmlFor="reactivity-responsive">Responsive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-responsive" id="reactivity-nonresponsive" />
              <Label htmlFor="reactivity-nonresponsive">Non-responsive</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>d) Mood</Label>
          <RadioGroup
            value={formData.mood}
            onValueChange={(value) => onInputChange("mood", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="depressed" id="mood-depressed" />
              <Label htmlFor="mood-depressed">Depressed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="elated" id="mood-elated" />
              <Label htmlFor="mood-elated">Elated</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="euthymic" id="mood-euthymic" />
              <Label htmlFor="mood-euthymic">Euthymic</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>e) Appropriateness</Label>
          <RadioGroup
            value={formData.appropriateness}
            onValueChange={(value) => onInputChange("appropriateness", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="appropriate" id="appropriateness-appropriate" />
              <Label htmlFor="appropriateness-appropriate">Appropriate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inappropriate" id="appropriateness-inappropriate" />
              <Label htmlFor="appropriateness-inappropriate">Inappropriate</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>f) Liability</Label>
          <RadioGroup
            value={formData.liability}
            onValueChange={(value) => onInputChange("liability", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stable" id="liability-stable" />
              <Label htmlFor="liability-stable">Stable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="labile" id="liability-labile" />
              <Label htmlFor="liability-labile">Labile</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default FeelingsEmotionsSection;
