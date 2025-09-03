
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import indexedDBService from "@/integrations/sqlite/database";
import questionsData from "@/data/questions.json";

interface PersonalityTestProps {
  onBack: () => void;
  onComplete?: () => void;
  studentId?: string;
}

const PersonalityTest = ({ onBack, onComplete, studentId }: PersonalityTestProps) => {
  const { toast } = useToast();
  const [currentTrait, setCurrentTrait] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number[]>>({});
  const [testSessionId] = useState(() => crypto.randomUUID());

  const questions = questionsData as Record<string, Array<{ text: string; reverse: boolean }>>;

  const traits = Object.keys(questions);
  const currentTraitName = traits[currentTrait];
  const currentQuestionData = questions[currentTraitName as keyof typeof questions][currentQuestion];
  const totalQuestions = Object.values(questions).flat().length;
  const currentQuestionNumber = traits.slice(0, currentTrait).reduce((sum, trait) => 
    sum + questions[trait as keyof typeof questions].length, 0) + currentQuestion + 1;

  const handleAnswer = (score: number) => {
    const processedScore = currentQuestionData.reverse ? 6 - score : score;
    
    setResponses(prev => ({
      ...prev,
      [currentTraitName]: [...(prev[currentTraitName] || []), processedScore]
    }));

    if (currentQuestion < questions[currentTraitName as keyof typeof questions].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentTrait < traits.length - 1) {
      setCurrentTrait(currentTrait + 1);
      setCurrentQuestion(0);
    } else {
      handleTestCompletion();
    }
  };

  const calculateScores = () => {
    const scores: Record<string, number> = {};
    for (const [trait, responseArray] of Object.entries(responses)) {
      scores[trait] = responseArray.reduce((sum, score) => sum + score, 0) / responseArray.length;
    }
    return scores;
  };

  const generateAnalysis = (scores: Record<string, number>) => {
    const analysis = [];
    
    if (scores["Openness"] >= 4.0) {
      analysis.push("High Openness: You are highly creative and curious, ideal for innovative engineering fields like R&D or product design. Pursue projects involving emerging technologies or experimental designs.");
    } else if (scores["Openness"] <= 2.5) {
      analysis.push("Low Openness: You prefer familiar methods, suitable for roles like quality control or process engineering. Explore new tools or workshops to boost creativity.");
    }

    if (scores["Conscientiousness"] >= 4.0) {
      analysis.push("High Conscientiousness: Your strong work ethic and organization make you well-suited for project management or detail-oriented tasks like circuit design or systems engineering.");
    } else if (scores["Conscientiousness"] <= 2.5) {
      analysis.push("Low Conscientiousness: You may struggle with deadlines or organization. Use planning tools (e.g., Trello, calendars) to improve time management.");
    }

    if (scores["Extraversion"] >= 4.0) {
      analysis.push("High Extraversion: You thrive in team settings and leadership roles, ideal for client-facing or project lead positions in engineering.");
    } else if (scores["Extraversion"] <= 2.5) {
      analysis.push("Low Extraversion: You prefer solo work, which suits tasks like coding or design. Join group projects or clubs to develop collaboration skills.");
    }

    if (scores["Agreeableness"] >= 4.0) {
      analysis.push("High Agreeableness: Your cooperative and empathetic nature is excellent for multidisciplinary team projects. Leverage this in collaborative engineering tasks.");
    } else if (scores["Agreeableness"] <= 2.5) {
      analysis.push("Low Agreeableness: You may prioritize personal goals over team needs. Practice active listening and compromise to improve team dynamics.");
    }

    if (scores["Neuroticism"] >= 4.0) {
      analysis.push("High Neuroticism: You may feel stressed or anxious under pressure. Practice stress management techniques (e.g., mindfulness, time management) to handle tight deadlines.");
    } else if (scores["Neuroticism"] <= 2.5) {
      analysis.push("Low Neuroticism: Your emotional stability is a strength in high-pressure engineering environments like systems troubleshooting or crisis management.");
    }

    return analysis;
  };

  const handleTestCompletion = async () => {
    const finalScores = calculateScores();
    const analysis = generateAnalysis(finalScores);
    
    try {
      // Save responses to personality_responses table
      const responsePromises = Object.entries(responses).map(async ([trait, responseArray]) => {
        const traitQuestions = questions[trait];
        
        return Promise.all(
          responseArray.map(async (responseValue, index) => {
            const result = await indexedDBService.insert('personality_responses', {
              test_session_id: testSessionId,
              student_id: studentId,
              response_value: responseValue,
              question_id: null // We'll use question order and trait for identification
            });
            
            if (!result) throw new Error('Failed to insert response');
          })
        );
      });

      await Promise.all(responsePromises);

      // Get student info from localStorage
      const storedLogin = localStorage.getItem('studentLogin');
      let studentName = '';
      let rollNumber = '';
      
      if (storedLogin) {
        const loginInfo = JSON.parse(storedLogin);
        studentName = loginInfo.name || '';
        rollNumber = loginInfo.rollNumber || '';
      }

      // Save results to personality_results table
      const result = await indexedDBService.insert('personality_results', {
        test_session_id: testSessionId,
        student_id: studentId,
        name: studentName,
        roll_no: rollNumber,
        openness_score: finalScores.Openness,
        conscientiousness_score: finalScores.Conscientiousness,
        extraversion_score: finalScores.Extraversion,
        agreeableness_score: finalScores.Agreeableness,
        neuroticism_score: finalScores.Neuroticism,
        analysis_text: analysis,
        detailed_analysis: {
          scores: finalScores,
          analysis: analysis,
          test_date: new Date().toISOString()
        }
      });

      if (!result) throw new Error('Failed to insert results');

      // Also update localStorage for backward compatibility
      if (storedLogin) {
        const loginInfo = JSON.parse(storedLogin);
        const assessments = JSON.parse(localStorage.getItem('submittedAssessments') || '[]');
        
        const updatedAssessments = assessments.map((assessment: any) => {
          if (assessment.studentName.toLowerCase().trim() === loginInfo.name.toLowerCase().trim() && 
              assessment.rollNumber.trim() === loginInfo.rollNumber.trim()) {
            return { 
              ...assessment, 
              testCompleted: true, 
              testCompletionDate: new Date().toISOString().split('T')[0],
              personalityScores: finalScores,
              personalityAnalysis: analysis
            };
          }
          return assessment;
        });
        
        localStorage.setItem('submittedAssessments', JSON.stringify(updatedAssessments));
      }

      toast({
        title: "Test Completed Successfully!",
        description: "Your Big Five personality assessment has been completed. Results have been saved and analysis generated.",
      });

      if (onComplete) {
        onComplete();
      } else {
        onBack();
      }
    } catch (error) {
      console.error('Error saving test results:', error);
      toast({
        title: "Error Saving Results",
        description: "There was an error saving your test results. Please try again.",
        variant: "destructive"
      });
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
          Question {currentQuestionNumber} of {totalQuestions}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl text-blue-700 flex items-center justify-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Big Five Personality Test</span>
          </CardTitle>
          <div className="text-center text-gray-600">
            <p className="font-semibold">{currentTraitName} - Section {currentTrait + 1} of {traits.length}</p>
            <p className="text-sm">Question {currentQuestion + 1} of {questions[currentTraitName as keyof typeof questions].length} in this section</p>
            <p className="text-sm mt-1">Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 mb-8 leading-relaxed">
              {currentQuestionData.text}
            </p>
          </div>

          <RadioGroup className="space-y-4">
            {[1, 2, 3, 4, 5].map((score) => (
              <div key={score} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                   onClick={() => handleAnswer(score)}>
                <RadioGroupItem value={score.toString()} id={score.toString()} />
                <Label htmlFor={score.toString()} className="cursor-pointer flex-1">
                  <span className="font-medium mr-2">{score}</span>
                  <span className="text-gray-600">
                    {score === 1 && "Strongly Disagree"}
                    {score === 2 && "Disagree"}
                    {score === 3 && "Neutral"}
                    {score === 4 && "Agree"}
                    {score === 5 && "Strongly Agree"}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="text-center text-sm text-gray-500">
            <p>Take your time to consider each statement carefully.</p>
            <p>There are no right or wrong answers - just be honest about yourself.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalityTest;
