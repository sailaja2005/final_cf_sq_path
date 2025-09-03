
import { CounselingFormData } from "@/components/forms/types/counselingFormTypes";

// Map form data to database structure
export const mapFormDataToDatabase = (formData: CounselingFormData) => {
  return {
    // General Information
    student_name: formData.studentName,
    roll_number: formData.rollNumber,
    age: formData.age,
    gender: formData.gender,
    address: formData.address,
    education: formData.education,
    father_name: formData.fatherName,
    mother_name: formData.motherName,
    guardian_name: formData.guardianName,
    father_occupation: formData.fatherOccupation,
    mother_occupation: formData.motherOccupation,
    guardian_occupation: formData.guardianOccupation,
    socio_economic_status: formData.socioEconomicStatus,
    student_mobile: formData.studentMobile,
    father_mobile: formData.fatherMobile,
    mother_mobile: formData.motherMobile,
    guardian_mobile: formData.guardianMobile,
    student_email: formData.studentEmail,
    father_email: formData.fatherEmail,
    mother_email: formData.motherEmail,
    guardian_email: formData.guardianEmail,
    
    // Family History
    family_history: formData.familyHistory,
    annual_income: formData.annualIncome,
    leadership_pattern: formData.leadershipPattern,
    role_of_function: formData.roleOfFunction,
    communication: formData.communication,
    
    // General Behaviour
    eating_habit: formData.eatingHabit,
    sleeping_habit: formData.sleepingHabit,
    cleanliness_habit: formData.cleanlinessHabit,
    dress_sense: formData.dressSense,
    approach_towards_faculty: formData.approachTowardsFaculty,
    consciousness_of_surroundings: formData.consciousnessOfSurroundings,
    in_touch_with_surroundings: formData.inTouchWithSurroundings,
    approach_of_student: formData.approachOfStudent,
    responsiveness_of_student: formData.responsivenessOfStudent,
    mannerism: formData.mannerism,
    
    // Speech
    form_of_utterances: formData.formOfUtterances,
    spontaneous: formData.spontaneous,
    speech_mannerism: formData.speechMannerism,
    tone: formData.tone,
    speech: formData.speech,
    reaction_time: formData.reactionTime,
    relevance_and_coherence: formData.relevanceAndCoherence,
    prosody: formData.prosody,
    
    // Thought
    flight_of_ideas: formData.flightOfIdeas,
    retardation_of_thinking: formData.retardationOfThinking,
    circumstantial: formData.circumstantial,
    preservation: formData.preservation,
    thought_blocks: formData.thoughtBlocks,
    obsession: formData.obsession,
    hallucinations: formData.hallucinations,
    delusions: formData.delusions,
    sin_and_guilt: formData.sinAndGuilt,
    
    // Feelings and emotions
    range: formData.range,
    intensity_of_expression: formData.intensityOfExpression,
    reactivity: formData.reactivity,
    mood: formData.mood,
    diurnal_variations: formData.diurnalVariations,
    congruity_with: formData.congruityWith,
    appropriateness: formData.appropriateness,
    liability: formData.liability,
    
    // Cognitive
    level_of_awareness: formData.levelOfAwareness,
    insight: formData.insight,
    orientation: formData.orientation,
    memory: formData.memory,
    intelligence: formData.intelligence,
    judgement: formData.judgement,
    abstraction: formData.abstraction,
    
    // Counselor's remarks
    counselor_remarks: formData.counselorRemarks,
    approved: formData.approved,
    status: formData.approved ? 'approved' : 'pending'
  };
};

// Map database data back to form structure (for future use in editing)
export const mapDatabaseToFormData = (dbData: any): CounselingFormData => {
  return {
    // General Information
    studentName: dbData.student_name || "",
    rollNumber: dbData.roll_number || "",
    age: dbData.age || "",
    gender: dbData.gender || "",
    address: dbData.address || "",
    education: dbData.education || "",
    fatherName: dbData.father_name || "",
    motherName: dbData.mother_name || "",
    guardianName: dbData.guardian_name || "",
    fatherOccupation: dbData.father_occupation || "",
    motherOccupation: dbData.mother_occupation || "",
    guardianOccupation: dbData.guardian_occupation || "",
    socioEconomicStatus: dbData.socio_economic_status || "",
    studentMobile: dbData.student_mobile || "",
    fatherMobile: dbData.father_mobile || "",
    motherMobile: dbData.mother_mobile || "",
    guardianMobile: dbData.guardian_mobile || "",
    studentEmail: dbData.student_email || "",
    fatherEmail: dbData.father_email || "",
    motherEmail: dbData.mother_email || "",
    guardianEmail: dbData.guardian_email || "",
    
    // Family History
    familyHistory: dbData.family_history || "",
    annualIncome: dbData.annual_income || "",
    leadershipPattern: dbData.leadership_pattern || "",
    roleOfFunction: dbData.role_of_function || [],
    communication: dbData.communication || "",
    
    // General Behaviour
    eatingHabit: dbData.eating_habit || "",
    sleepingHabit: dbData.sleeping_habit || "",
    cleanlinessHabit: dbData.cleanliness_habit || "",
    dressSense: dbData.dress_sense || "",
    approachTowardsFaculty: dbData.approach_towards_faculty || "",
    consciousnessOfSurroundings: dbData.consciousness_of_surroundings || "",
    inTouchWithSurroundings: dbData.in_touch_with_surroundings || "",
    approachOfStudent: dbData.approach_of_student || "",
    responsivenessOfStudent: dbData.responsiveness_of_student || "",
    mannerism: dbData.mannerism || "",
    
    // Speech
    formOfUtterances: dbData.form_of_utterances || "",
    spontaneous: dbData.spontaneous || "",
    speechMannerism: dbData.speech_mannerism || "",
    tone: dbData.tone || "",
    speech: dbData.speech || "",
    reactionTime: dbData.reaction_time || "",
    relevanceAndCoherence: dbData.relevance_and_coherence || "",
    prosody: dbData.prosody || "",
    
    // Thought
    flightOfIdeas: dbData.flight_of_ideas || "",
    retardationOfThinking: dbData.retardation_of_thinking || "",
    circumstantial: dbData.circumstantial || "",
    preservation: dbData.preservation || "",
    thoughtBlocks: dbData.thought_blocks || "",
    obsession: dbData.obsession || "",
    hallucinations: dbData.hallucinations || "",
    delusions: dbData.delusions || "",
    sinAndGuilt: dbData.sin_and_guilt || "",
    
    // Feelings and emotions
    range: dbData.range || "",
    intensityOfExpression: dbData.intensity_of_expression || "",
    reactivity: dbData.reactivity || "",
    mood: dbData.mood || "",
    diurnalVariations: dbData.diurnal_variations || "",
    congruityWith: dbData.congruity_with || "",
    appropriateness: dbData.appropriateness || "",
    liability: dbData.liability || "",
    
    // Cognitive
    levelOfAwareness: dbData.level_of_awareness || "",
    insight: dbData.insight || "",
    orientation: dbData.orientation || "",
    memory: dbData.memory || "",
    intelligence: dbData.intelligence || "",
    judgement: dbData.judgement || "",
    abstraction: dbData.abstraction || "",
    
    // Counselor's remarks
    counselorRemarks: dbData.counselor_remarks || "",
    approved: dbData.approved || false
  };
};
