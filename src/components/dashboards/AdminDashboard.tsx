
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import indexedDBService from "@/integrations/sqlite/database";
import { Users, BarChart3, TrendingUp, Eye, CheckCircle, XCircle, Search, GraduationCap, Shield, Upload, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMentor, setFilterMentor] = useState<string>("all");
  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showCredentialsUpload, setShowCredentialsUpload] = useState(false);
  const { toast } = useToast();

  // Helper function to get available mentors for display
  const [availableMentors, setAvailableMentors] = useState<string[]>([]);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentors = await indexedDBService.getMentors();
        const mentorNames = mentors.map(m => m.name || m.mentor_name || m.gmail).filter(Boolean);
        setAvailableMentors(mentorNames);
      } catch (error) {
        console.error('Error loading mentors:', error);
      }
    };
    loadMentors();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load students
      const studentsData = await indexedDBService.getStudents();

      // Load mentors
      const mentorsData = await indexedDBService.getMentors();

      // Load test status from admin_portal_data table
      const portalData = await indexedDBService.getAdminPortalData();

      // Load personality results for completed tests
      const personalityResults = await indexedDBService.getPersonalityResults();

      // Load counseling assessments for details view
      const counselingData = await indexedDBService.getCounselingAssessments();

      // Map students with test completion status and results
      const studentsWithResults = studentsData.map(student => {
        const portalRecord = portalData?.find(record => record.roll_no === student.roll_number);
        const testResult = personalityResults?.find(result => 
          result.roll_no === student.roll_number
        );
        const counselingAssessment = counselingData?.find(assessment => 
          assessment.roll_number === student.roll_number
        );
        const testCompleted = portalRecord?.test_status === 'Completed';
        
        return {
          ...student,
          personality_results: testCompleted && testResult ? [testResult] : [],
          counseling_assessment: counselingAssessment,
          testCompleted,
          testCompletionDate: testCompleted && testResult ? testResult.completed_at : null
        };
      });

      setStudents(studentsWithResults);
      setMentors(mentorsData || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let jsonData: any[] = [];
      
      // Handle both Excel and CSV files
      if (file.name.toLowerCase().endsWith('.csv')) {
        // Handle CSV file
        const text = await file.text();
        // Parse CSV manually since XLSX.csv_to_json might not be available
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        jsonData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });
      } else {
        // Handle Excel file
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      }

      // Validate required columns exist
      const firstRow = jsonData[0];
      const requiredColumns = ['roll_number', 'mentor_name', 'year_of_s', 'name'];
      const missingColumns = requiredColumns.filter(col => 
        !firstRow.hasOwnProperty(col) && 
        !firstRow.hasOwnProperty(col.charAt(0).toUpperCase() + col.slice(1)) &&
        !firstRow.hasOwnProperty(col.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
      );

      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}. File must contain: roll_number, mentor_name, year_of_s, name`);
      }

      // Process the data according to the exact format shown in the image
      const studentsToInsert = jsonData.map((row: any, index: number) => {
        // Handle different possible column name variations
        const rollNumber = row['roll_number'] || row['Roll Number'] || row['RollNumber'] || row['roll_number'];
        const mentorName = row['mentor_name'] || row['Mentor Name'] || row['MentorName'] || row['mentor_name'];
        const yearOfStudy = row['year_of_s'] || row['Year of S'] || row['YearOfS'] || row['year_of_s'];
        const studentName = row['name'] || row['Name'] || row['Student Name'] || row['student_name'];

        // Validate required fields
        if (!rollNumber || !mentorName || !yearOfStudy || !studentName) {
          throw new Error(`Row ${index + 1}: Missing required data. All fields must be filled.`);
        }

        // Validate roll number format (CS2024XXX)
        const rollNumberPattern = /^CS2024\d{3}$/;
        if (!rollNumberPattern.test(rollNumber)) {
          throw new Error(`Row ${index + 1}: Invalid roll number format. Must be in format CS2024XXX (e.g., CS2024001)`);
        }

        // Validate year of study (1-4)
        const year = parseInt(yearOfStudy);
        if (isNaN(year) || year < 1 || year > 4) {
          throw new Error(`Row ${index + 1}: Invalid year of study. Must be 1, 2, 3, or 4.`);
        }

        return {
          roll_number: rollNumber,
          name: studentName,
          mentor_name: mentorName,
          academic_year: year,
          // Set default values for optional fields
          age: null,
          gender: null,
          education: null,
          address: null,
          mobile: null
        };
      });

      // Check for duplicate roll numbers
      const rollNumbers = studentsToInsert.map(s => s.roll_number);
      const duplicateRollNumbers = rollNumbers.filter((roll, index) => rollNumbers.indexOf(roll) !== index);
      if (duplicateRollNumbers.length > 0) {
        throw new Error(`Duplicate roll numbers found: ${[...new Set(duplicateRollNumbers)].join(', ')}. Each student must have a unique roll number.`);
      }

      // Check for existing roll numbers in database
      const existingStudents = await indexedDBService.getStudents();
      const existingRollNumbers = existingStudents.map(s => s.roll_number);
      const conflictingRollNumbers = studentsToInsert.filter(s => existingRollNumbers.includes(s.roll_number));
      
      if (conflictingRollNumbers.length > 0) {
        const rollList = conflictingRollNumbers.map(s => s.roll_number).join(', ');
        throw new Error(`Roll numbers already exist in database: ${rollList}. Each student must have a unique roll number.`);
      }

      // Validate that all mentors exist in the database
      const existingMentors = await indexedDBService.getMentors();
      const mentorNames = existingMentors.map(m => m.name || m.mentor_name);
      const invalidMentors = studentsToInsert.filter(s => !mentorNames.includes(s.mentor_name));
      
      if (invalidMentors.length > 0) {
        const invalidMentorList = [...new Set(invalidMentors.map(s => s.mentor_name))].join(', ');
        throw new Error(`Invalid mentors found: ${invalidMentorList}. These mentors do not exist in the database. Please add them first or check spelling.`);
      }

      const { error } = await indexedDBService.insertStudents(studentsToInsert);

      if (error) throw error;

      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${studentsToInsert.length} students with mentor assignments.`,
      });

      loadData(); // Reload data
      setShowUpload(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload student data. Please check the file format.",
        variant: "destructive"
      });
    }
  };

  // Helper function to validate individual credentials
  const validateCredential = (credential: any, existingCredentials: any[]): string[] => {
    const errors: string[] = [];
    
    // Check if email already exists with a different role
    const existingCredential = existingCredentials.find(cred => cred.gmail === credential.gmail);
    if (existingCredential && existingCredential.role !== credential.role) {
      errors.push(`Email ${credential.gmail} already has role '${existingCredential.role}' and cannot be assigned role '${credential.role}'. Each person can only have one role.`);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credential.gmail)) {
      errors.push(`Invalid email format: ${credential.gmail}`);
    }
    
    // Validate password strength
    if (!credential.password || credential.password.length < 6) {
      errors.push(`Password for ${credential.gmail} must be at least 6 characters long`);
    }
    
    return errors;
  };

  const handleCredentialsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and process the credentials data
      const credentialsToInsert = jsonData.map((row: any) => {
        const gmail = row['Gmail'] || row['gmail'] || row['Email'] || row['email'];
        const password = row['Password'] || row['password'];
        const role = row['Role'] || row['role'];
        const id = row['ID'] || row['id'];
        const name = row['Name'] || row['name'] || row['Full Name'] || row['full_name'];

        if (!gmail || !password || !role) {
          throw new Error('Missing required fields: Gmail, Password, or Role');
        }

        // Validate role is one of the allowed values
        const validRoles = ['admin', 'student', 'mentor', 'counselor'];
        if (!validRoles.includes(role.toLowerCase())) {
          throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
        }

        return {
          gmail: gmail.toLowerCase().trim(),
          password: password,
          role: role.toLowerCase(),
          name: name || gmail.split('@')[0], // Use email prefix if no name provided
          // Note: ID is auto-generated by the database, but we can include user_id for reference
        };
      });

      // Additional validation: Check for duplicate emails and role conflicts
      const emailSet = new Set();
      const duplicateEmails = [];
      
      for (const credential of credentialsToInsert) {
        if (emailSet.has(credential.gmail)) {
          duplicateEmails.push(credential.gmail);
        } else {
          emailSet.add(credential.gmail);
        }
      }

      if (duplicateEmails.length > 0) {
        throw new Error(`Duplicate emails found: ${duplicateEmails.join(', ')}. Each person can only have one role.`);
      }

      // Check if any of these emails already exist in the database with a different role
      const existingCredentials = await indexedDBService.getCredentials();
      const conflictingEmails = [];
      
      for (const newCredential of credentialsToInsert) {
        const existingCredential = existingCredentials.find(cred => cred.gmail === newCredential.gmail);
        if (existingCredential && existingCredential.role !== newCredential.role) {
          conflictingEmails.push({
            email: newCredential.gmail,
            existingRole: existingCredential.role,
            newRole: newCredential.role
          });
        }
      }

      if (conflictingEmails.length > 0) {
        const conflictMessages = conflictingEmails.map(conflict => 
          `${conflict.email}: already has role '${conflict.existingRole}', cannot be assigned role '${conflict.newRole}'`
        );
        throw new Error(`Role conflicts found:\n${conflictMessages.join('\n')}\n\nEach person can only have one role.`);
      }

      // Validate each credential individually
      const allErrors: string[] = [];
      for (const credential of credentialsToInsert) {
        const errors = validateCredential(credential, existingCredentials);
        allErrors.push(...errors);
      }

      if (allErrors.length > 0) {
        throw new Error(`Validation errors found:\n${allErrors.join('\n')}`);
      }

      const { error } = await indexedDBService.insertCredentials(credentialsToInsert);

      if (error) throw error;

      // If mentors were uploaded, also create mentor records
      const mentorCredentials = credentialsToInsert.filter(cred => cred.role === 'mentor');
      if (mentorCredentials.length > 0) {
        const mentorsToInsert = mentorCredentials.map(cred => ({
          name: cred.name,
          gmail: cred.gmail,
          role: 'mentor',
          created_at: new Date().toISOString()
        }));

        const mentorResult = await indexedDBService.insertMentors(mentorsToInsert);
        if (mentorResult.error) {
          console.warn('Warning: Credentials uploaded but mentor records failed:', mentorResult.error);
        }
        
        // Refresh the mentor list to show newly added mentors
        const mentors = await indexedDBService.getMentors();
        const mentorNames = mentors.map(m => m.name || m.mentor_name || m.gmail).filter(Boolean);
        setAvailableMentors(mentorNames);
      }

      toast({
        title: "Credentials Upload Successful",
        description: `Successfully uploaded ${credentialsToInsert.length} credentials${mentorCredentials.length > 0 ? ` (including ${mentorCredentials.length} mentors)` : ''}.`,
      });

      setShowCredentialsUpload(false);
    } catch (error) {
      console.error('Error uploading credentials file:', error);
      toast({
        title: "Credentials Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload credentials. Please check the file format.",
        variant: "destructive"
      });
    }
  };


  const handleViewAnalysis = (student: any) => {
    setSelectedStudent(student);
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudentDetails(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setSelectedStudentDetails(null);
  };

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const hasResults = student.personality_results && student.personality_results.length > 0;
    
    // Search functionality - search by roll number, name, or mentor name
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
                         (student.roll_number || '').toLowerCase().includes(searchLower) ||
                         (student.name || '').toLowerCase().includes(searchLower) ||
                         (student.mentor_name || '').toLowerCase().includes(searchLower);
    
    // Status filter
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && hasResults) ||
                         (filterStatus === "pending" && !hasResults);
    
    // Year filter
    const matchesYear = filterYear === "all" || student.academic_year?.toString() === filterYear;
    
    // Mentor filter
    const matchesMentor = filterMentor === "all" || student.mentor_name === filterMentor;
    
    return matchesSearch && matchesStatus && matchesYear && matchesMentor;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const completedTests = students.filter(s => s.personality_results && s.personality_results.length > 0).length;
  const pendingTests = totalStudents - completedTests;
  const completionRate = totalStudents > 0 ? Math.round((completedTests / totalStudents) * 100) : 0;

  // If viewing student details
  if (selectedStudentDetails) {
    const assessment = selectedStudentDetails.counseling_assessment;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Student Details</h2>
            <p className="text-gray-600">Roll: {selectedStudentDetails.roll_number}</p>
            <p className="text-sm text-gray-500">Mentor: {selectedStudentDetails.mentor_name}</p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            Back to Student List
          </Button>
        </div>

        {assessment ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* General Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Name:</strong> {assessment.student_name || 'N/A'}</div>
                <div><strong>Age:</strong> {assessment.age || 'N/A'}</div>
                <div><strong>Gender:</strong> {assessment.gender || 'N/A'}</div>
                <div><strong>Address:</strong> {assessment.address || 'N/A'}</div>
                <div><strong>Education:</strong> {assessment.education || 'N/A'}</div>
                <div><strong>Student Mobile:</strong> {assessment.student_mobile || 'N/A'}</div>
                <div><strong>Student Email:</strong> {assessment.student_email || 'N/A'}</div>
                <div><strong>Submission Date:</strong> {assessment.submission_date ? new Date(assessment.submission_date).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Status:</strong> <Badge variant={assessment.approved ? "default" : "secondary"}>{assessment.status}</Badge></div>
              </CardContent>
            </Card>

            {/* Family Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Family Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Father's Name:</strong> {assessment.father_name || 'N/A'}</div>
                <div><strong>Father's Occupation:</strong> {assessment.father_occupation || 'N/A'}</div>
                <div><strong>Father's Mobile:</strong> {assessment.father_mobile || 'N/A'}</div>
                <div><strong>Father's Email:</strong> {assessment.father_email || 'N/A'}</div>
                <div><strong>Mother's Name:</strong> {assessment.mother_name || 'N/A'}</div>
                <div><strong>Mother's Occupation:</strong> {assessment.mother_occupation || 'N/A'}</div>
                <div><strong>Mother's Mobile:</strong> {assessment.mother_mobile || 'N/A'}</div>
                <div><strong>Mother's Email:</strong> {assessment.mother_email || 'N/A'}</div>
                <div><strong>Guardian's Name:</strong> {assessment.guardian_name || 'N/A'}</div>
                <div><strong>Guardian's Occupation:</strong> {assessment.guardian_occupation || 'N/A'}</div>
                <div><strong>Guardian's Mobile:</strong> {assessment.guardian_mobile || 'N/A'}</div>
                <div><strong>Guardian's Email:</strong> {assessment.guardian_email || 'N/A'}</div>
                <div><strong>Annual Income:</strong> {assessment.annual_income || 'N/A'}</div>
                <div><strong>Socio-Economic Status:</strong> {assessment.socio_economic_status || 'N/A'}</div>
                <div><strong>Family History:</strong> {assessment.family_history || 'N/A'}</div>
              </CardContent>
            </Card>

            {/* General Behaviour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">General Behaviour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Leadership Pattern:</strong> {assessment.leadership_pattern || 'N/A'}</div>
                <div><strong>Communication:</strong> {assessment.communication || 'N/A'}</div>
                <div><strong>Eating Habit:</strong> {assessment.eating_habit || 'N/A'}</div>
                <div><strong>Sleeping Habit:</strong> {assessment.sleeping_habit || 'N/A'}</div>
                <div><strong>Cleanliness Habit:</strong> {assessment.cleanliness_habit || 'N/A'}</div>
                <div><strong>Dress Sense:</strong> {assessment.dress_sense || 'N/A'}</div>
                <div><strong>Approach Towards Faculty:</strong> {assessment.approach_towards_faculty || 'N/A'}</div>
                <div><strong>Consciousness of Surroundings:</strong> {assessment.consciousness_of_surroundings || 'N/A'}</div>
                <div><strong>In Touch with Surroundings:</strong> {assessment.in_touch_with_surroundings || 'N/A'}</div>
                <div><strong>Approach of Student:</strong> {assessment.approach_of_student || 'N/A'}</div>
                <div><strong>Responsiveness:</strong> {assessment.responsiveness_of_student || 'N/A'}</div>
                <div><strong>Mannerism:</strong> {assessment.mannerism || 'N/A'}</div>
              </CardContent>
            </Card>

            {/* Speech Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-700">Speech Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Form of Utterances:</strong> {assessment.form_of_utterances || 'N/A'}</div>
                <div><strong>Spontaneous:</strong> {assessment.spontaneous || 'N/A'}</div>
                <div><strong>Speech Mannerism:</strong> {assessment.speech_mannerism || 'N/A'}</div>
                <div><strong>Tone:</strong> {assessment.tone || 'N/A'}</div>
                <div><strong>Speech:</strong> {assessment.speech || 'N/A'}</div>
                <div><strong>Reaction Time:</strong> {assessment.reaction_time || 'N/A'}</div>
                <div><strong>Relevance and Coherence:</strong> {assessment.relevance_and_coherence || 'N/A'}</div>
                <div><strong>Prosody:</strong> {assessment.prosody || 'N/A'}</div>
              </CardContent>
            </Card>

            {/* Thought Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Thought Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Flight of Ideas:</strong> {assessment.flight_of_ideas || 'N/A'}</div>
                <div><strong>Retardation of Thinking:</strong> {assessment.retardation_of_thinking || 'N/A'}</div>
                <div><strong>Circumstantial:</strong> {assessment.circumstantial || 'N/A'}</div>
                <div><strong>Preservation:</strong> {assessment.preservation || 'N/A'}</div>
                <div><strong>Thought Blocks:</strong> {assessment.thought_blocks || 'N/A'}</div>
                <div><strong>Obsession:</strong> {assessment.obsession || 'N/A'}</div>
                <div><strong>Hallucinations:</strong> {assessment.hallucinations || 'N/A'}</div>
                <div><strong>Delusions:</strong> {assessment.delusions || 'N/A'}</div>
                <div><strong>Sin and Guilt:</strong> {assessment.sin_and_guilt || 'N/A'}</div>
              </CardContent>
            </Card>

            {/* Feelings & Emotions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-700">Feelings & Emotions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Range:</strong> {assessment.range || 'N/A'}</div>
                <div><strong>Intensity of Expression:</strong> {assessment.intensity_of_expression || 'N/A'}</div>
                <div><strong>Reactivity:</strong> {assessment.reactivity || 'N/A'}</div>
                <div><strong>Mood:</strong> {assessment.mood || 'N/A'}</div>
                <div><strong>Diurnal Variations:</strong> {assessment.diurnal_variations || 'N/A'}</div>
                <div><strong>Congruity:</strong> {assessment.congruity_with || 'N/A'}</div>
                <div><strong>Appropriateness:</strong> {assessment.appropriateness || 'N/A'}</div>
                <div><strong>Liability:</strong> {assessment.liability || 'N/A'}</div>
                <div><strong>Level of Awareness:</strong> {assessment.level_of_awareness || 'N/A'}</div>
                <div><strong>Insight:</strong> {assessment.insight || 'N/A'}</div>
                <div><strong>Orientation:</strong> {assessment.orientation || 'N/A'}</div>
                <div><strong>Memory:</strong> {assessment.memory || 'N/A'}</div>
                <div><strong>Intelligence:</strong> {assessment.intelligence || 'N/A'}</div>
                <div><strong>Judgement:</strong> {assessment.judgement || 'N/A'}</div>
                <div><strong>Abstraction:</strong> {assessment.abstraction || 'N/A'}</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No counseling assessment data found for this student.</p>
            </CardContent>
          </Card>
        )}

        {/* Counselor Remarks */}
        {assessment?.counselor_remarks && (
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-700">Counselor Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{assessment.counselor_remarks}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // If viewing student analysis
  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Student Analysis</h2>
            <p className="text-gray-600">Roll: {selectedStudent.roll_number}</p>
            <p className="text-sm text-gray-500">Mentor: {selectedStudent.mentor_name}</p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            Back to Student List
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">Personality Assessment Results</CardTitle>
              <CardDescription>Big Five Personality Traits Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStudent.personality_results && selectedStudent.personality_results.length > 0 ? (
                <div className="space-y-4">
                  {[
                    { name: 'Openness', score: selectedStudent.personality_results[0].openness_score },
                    { name: 'Conscientiousness', score: selectedStudent.personality_results[0].conscientiousness_score },
                    { name: 'Extraversion', score: selectedStudent.personality_results[0].extraversion_score },
                    { name: 'Agreeableness', score: selectedStudent.personality_results[0].agreeableness_score },
                    { name: 'Neuroticism', score: selectedStudent.personality_results[0].neuroticism_score }
                  ].map(({ name, score }) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{name}</span>
                        <span className="text-sm font-bold">{Number(score).toFixed(1)}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${(Number(score) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No test results available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Test Completion Date</h4>
                <p className="text-sm text-gray-600">
                  {selectedStudent.personality_results?.[0]?.completed_at 
                    ? new Date(selectedStudent.personality_results[0].completed_at).toLocaleDateString()
                    : 'Not completed'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Student Information</h4>
                <div className="bg-emerald-50 p-3 rounded-lg mt-2 space-y-1">
                  <p className="text-sm text-gray-700">Age: {selectedStudent.age || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Gender: {selectedStudent.gender || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Education: {selectedStudent.education || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Academic Year: {selectedStudent.academic_year || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Assigned Mentor</h4>
                <p className="text-sm text-gray-600">{selectedStudent.mentor_name || 'Not assigned'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Detailed Analysis</CardTitle>
            <CardDescription>Comprehensive personality insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedStudent.personality_results?.[0]?.analysis_text?.map((analysis: string, index: number) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{analysis}</p>
                </div>
              )) || (
                <p className="text-gray-500">No analysis available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main admin dashboard view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Comprehensive overview of all students and their assessments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
            <p className="text-sm text-gray-600">Across all mentors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Tests Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedTests}</div>
            <p className="text-sm text-gray-600">Ready for analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <XCircle className="h-5 w-5 mr-2 text-red-600" />
              Tests Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{pendingTests}</div>
            <p className="text-sm text-gray-600">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{completionRate}%</div>
            <p className="text-sm text-gray-600">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Excel Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Student Data Management
          </CardTitle>
          <CardDescription>Upload student data via Excel or CSV file with mentor assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {!showUpload ? (
            <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Upload Student Data (Excel/CSV)
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="excel-upload">Upload Student Data File</Label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-blue-800 mb-2">Required File Format:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>roll_number</strong>: Student roll number (format: CS2024XXX)</li>
                    <li>• <strong>mentor_name</strong>: Name of assigned mentor</li>
                    <li>• <strong>year_of_s</strong>: Year of study (1, 2, 3, or 4)</li>
                    <li>• <strong>name</strong>: Student's full name</li>
                    <li>• Supports both Excel (.xlsx, .xls) and CSV files</li>
                  </ul>
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-700">
                      <strong>Note:</strong> All mentors must exist in the database before uploading students. 
                      If you need to add mentors, use the Credentials Management section first.
                    </p>
                  </div>
                  {availableMentors.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-xs text-green-700 mb-1">
                        <strong>Available Mentors:</strong>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {availableMentors.map((mentor, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {mentor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Create sample data for download matching the image format
                      const sampleData = [
                        { roll_number: 'CS2024001', mentor_name: 'Prof. Sunita Mehta', year_of_s: '2', name: 'Divya Gupta' },
                        { roll_number: 'CS2024002', mentor_name: 'Dr. Rajesh Sharma', year_of_s: '1', name: 'Jaya Rajput' },
                        { roll_number: 'CS2024003', mentor_name: 'Prof. Sunita Mehta', year_of_s: '2', name: 'Aditya Kumar' },
                        { roll_number: 'CS2024004', mentor_name: 'Prof. Sunita Mehta', year_of_s: '2', name: 'Abhishek Singh' }
                      ];
                      
                      const ws = XLSX.utils.json_to_sheet(sampleData);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'Student Template');
                      
                      XLSX.writeFile(wb, 'student_data_template.xlsx');
                    }}
                    className="text-xs"
                  >
                    📥 Download Sample Template
                  </Button>
                </div>
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowUpload(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Credentials Management
          </CardTitle>
          <CardDescription>Upload user credentials via Excel or CSV file</CardDescription>
        </CardHeader>
        <CardContent>
          {!showCredentialsUpload ? (
            <Button onClick={() => setShowCredentialsUpload(true)} className="flex items-center gap-2" variant="secondary">
              <FileSpreadsheet className="h-4 w-4" />
              Upload Credentials
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="credentials-upload">Upload Credentials File</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Excel or CSV file should contain columns: Gmail, Password, Role, Name (Name is optional - will use email prefix if not provided)
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-blue-800 mb-2">Role System Rules:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>Each person can only have ONE role</strong></li>
                    <li>• <strong>admin</strong>: System administrators with full access</li>
                    <li>• <strong>counselor</strong>: Student counselors who conduct assessments</li>
                    <li>• <strong>mentor</strong>: Academic mentors who guide students</li>
                    <li>• <strong>student</strong>: Students who take personality tests</li>
                    <li>• <strong>Role conflicts are not allowed</strong> - a counselor cannot also be a student</li>
                  </ul>
                </div>
                <p className="text-xs text-amber-600 mb-2">
                  Valid roles: admin, student, mentor, counselor
                </p>
                <div className="mb-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Create sample data for download
                      const sampleData = [
                        { Gmail: 'admin@mindpathways.com', Password: 'admin123', Role: 'admin', Name: 'System Admin' },
                        { Gmail: 'counselor1@mindpathways.com', Password: 'counselor123', Role: 'counselor', Name: 'Dr. Sarah Johnson' },
                        { Gmail: 'mentor1@mindpathways.com', Password: 'mentor123', Role: 'mentor', Name: 'Prof. Sunita Mehta' },
                        { Gmail: 'student1@mindpathways.com', Password: 'student123', Role: 'student', Name: 'John Doe' }
                      ];
                      
                      const ws = XLSX.utils.json_to_sheet(sampleData);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'Credentials Template');
                      
                      XLSX.writeFile(wb, 'credentials_template.xlsx');
                    }}
                    className="text-xs"
                  >
                    📥 Download Sample Template
                  </Button>
                </div>
                <Input
                  id="credentials-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleCredentialsUpload}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCredentialsUpload(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by roll number, name, or mentor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div>
              <select
                value={filterMentor}
                onChange={(e) => setFilterMentor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Mentors</option>
                {Array.from(new Set(students.map(s => s.mentor_name).filter(Boolean))).map(mentor => (
                  <option key={mentor} value={mentor}>{mentor}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                onClick={() => setFilterStatus("completed")}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          <CardDescription>Complete student roster with mentor assignments and test status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading students...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => {
                const hasResults = student.personality_results && student.personality_results.length > 0;
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Roll: {student.roll_number}</h3>
                        <p className="text-sm text-gray-600">Year: {student.academic_year || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{student.mentor_name || 'No Mentor'}</p>
                        <p className="text-xs text-gray-500">{student.education || 'N/A'}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {hasResults ? (
                          <>
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                            <Button 
                              size="sm" 
                              onClick={() => handleViewAnalysis(student)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(student)}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredStudents.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <p>No students found matching the current filters.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
