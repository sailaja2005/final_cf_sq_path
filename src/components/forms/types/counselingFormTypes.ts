
export interface CounselingFormData {
  // General Information
  studentName: string;
  rollNumber: string;
  age: string;
  gender: string;
  address: string;
  education: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  fatherOccupation: string;
  motherOccupation: string;
  guardianOccupation: string;
  socioEconomicStatus: string;
  studentMobile: string;
  fatherMobile: string;
  motherMobile: string;
  guardianMobile: string;
  studentEmail: string;
  fatherEmail: string;
  motherEmail: string;
  guardianEmail: string;
  
  // Family History
  familyHistory: string;
  annualIncome: string;
  leadershipPattern: string;
  roleOfFunction: string[];
  communication: string;
  
  // General Behaviour
  eatingHabit: string;
  sleepingHabit: string;
  cleanlinessHabit: string;
  dressSense: string;
  approachTowardsFaculty: string;
  consciousnessOfSurroundings: string;
  inTouchWithSurroundings: string;
  approachOfStudent: string;
  responsivenessOfStudent: string;
  mannerism: string;
  
  // Speech
  formOfUtterances: string;
  spontaneous: string;
  speechMannerism: string;
  tone: string;
  speech: string;
  reactionTime: string;
  relevanceAndCoherence: string;
  prosody: string;
  
  // Thought
  flightOfIdeas: string;
  retardationOfThinking: string;
  circumstantial: string;
  preservation: string;
  thoughtBlocks: string;
  obsession: string;
  hallucinations: string;
  delusions: string;
  sinAndGuilt: string;
  
  // Feelings and emotions
  range: string;
  intensityOfExpression: string;
  reactivity: string;
  mood: string;
  diurnalVariations: string;
  congruityWith: string;
  appropriateness: string;
  liability: string;
  
  // Cognitive
  levelOfAwareness: string;
  insight: string;
  orientation: string;
  memory: string;
  intelligence: string;
  judgement: string;
  abstraction: string;
  
  // Counselor's final remarks
  counselorRemarks: string;
  approved: boolean;
}

export interface SectionProps {
  formData: CounselingFormData;
  onInputChange: (field: string, value: string | string[] | boolean) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
}
