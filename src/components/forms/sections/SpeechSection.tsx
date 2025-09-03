
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionProps } from "../types/counselingFormTypes";

const SpeechSection = ({ formData, onInputChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-emerald-700">4) Speech</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>a) Form of Utterances</Label>
          <RadioGroup
            value={formData.formOfUtterances}
            onValueChange={(value) => onInputChange("formOfUtterances", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="clear" id="utterance-clear" />
              <Label htmlFor="utterance-clear">Clear</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unclear" id="utterance-unclear" />
              <Label htmlFor="utterance-unclear">Unclear</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mumbling" id="utterance-mumbling" />
              <Label htmlFor="utterance-mumbling">Mumbling</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>b) Spontaneous</Label>
          <RadioGroup
            value={formData.spontaneous}
            onValueChange={(value) => onInputChange("spontaneous", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="spontaneous-yes" />
              <Label htmlFor="spontaneous-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="spontaneous-no" />
              <Label htmlFor="spontaneous-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="spontaneous-sometimes" />
              <Label htmlFor="spontaneous-sometimes">Sometimes</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>c) Speech Mannerism</Label>
          <RadioGroup
            value={formData.speechMannerism}
            onValueChange={(value) => onInputChange("speechMannerism", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="speech-normal" />
              <Label htmlFor="speech-normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stuttering" id="speech-stuttering" />
              <Label htmlFor="speech-stuttering">Stuttering</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="repetitive" id="speech-repetitive" />
              <Label htmlFor="speech-repetitive">Repetitive</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>d) Tone</Label>
          <RadioGroup
            value={formData.tone}
            onValueChange={(value) => onInputChange("tone", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pleasant" id="tone-pleasant" />
              <Label htmlFor="tone-pleasant">Pleasant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="harsh" id="tone-harsh" />
              <Label htmlFor="tone-harsh">Harsh</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monotone" id="tone-monotone" />
              <Label htmlFor="tone-monotone">Monotone</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>e) Speech</Label>
          <RadioGroup
            value={formData.speech}
            onValueChange={(value) => onInputChange("speech", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fluent" id="speech-fluent" />
              <Label htmlFor="speech-fluent">Fluent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-fluent" id="speech-nonfluent" />
              <Label htmlFor="speech-nonfluent">Non-fluent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hesitant" id="speech-hesitant" />
              <Label htmlFor="speech-hesitant">Hesitant</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>f) Reaction Time</Label>
          <RadioGroup
            value={formData.reactionTime}
            onValueChange={(value) => onInputChange("reactionTime", value)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="quick" id="reaction-quick" />
              <Label htmlFor="reaction-quick">Quick</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delayed" id="reaction-delayed" />
              <Label htmlFor="reaction-delayed">Delayed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="appropriate" id="reaction-appropriate" />
              <Label htmlFor="reaction-appropriate">Appropriate</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default SpeechSection;
