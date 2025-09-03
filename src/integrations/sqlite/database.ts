// Browser-compatible database service using IndexedDB
// This replaces Supabase with a local database solution

interface DatabaseSchema {
  counseling_assessments: any[];
  students: any[];
  mentors: any[];
  counselors: any[];
  users: any[];
  credentials: any[];
  valid_emails: any[];
  upload_logs: any[];
  admin_portal_data: any[];
  mentor_portal_data: any[];
  personality_questions: any[];
  personality_responses: any[];
  personality_results: any[];
  profiles: any[];
}

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'MindPathwaysAssessment';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open database');
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.insertInitialData();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createObjectStores(db);
      };
    });
  }

  private createObjectStores(db: IDBDatabase): void {
    // Create object stores for each table
    const stores = [
      'counseling_assessments',
      'students',
      'mentors',
      'counselors',
      'users',
      'credentials',
      'valid_emails',
      'upload_logs',
      'admin_portal_data',
      'mentor_portal_data',
      'personality_questions',
      'personality_responses',
      'personality_results',
      'profiles'
    ];

    stores.forEach(storeName => {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id' });
        
        // Create indexes for better performance
        if (storeName === 'counseling_assessments') {
          store.createIndex('student_name_roll', ['student_name', 'roll_number'], { unique: true });
          store.createIndex('status', 'status', { unique: false });
        } else if (storeName === 'students') {
          store.createIndex('roll_number', 'roll_number', { unique: true });
          store.createIndex('mentor_name', 'mentor_name', { unique: false });
        } else if (storeName === 'credentials') {
          store.createIndex('gmail', 'gmail', { unique: true });
          store.createIndex('role', 'role', { unique: false });
        } else if (storeName === 'valid_emails') {
          store.createIndex('email', 'email', { unique: true });
        }
      }
    });
  }

  private async insertInitialData(): Promise<void> {
    // Insert default admin credentials if they don't exist
    const adminExists = await this.select('credentials', { role: 'admin' });
    if (adminExists.length === 0) {
      await this.insert('credentials', {
        id: this.generateId(),
        gmail: 'admin@mindpathways.com',
        password: 'admin123', // This should be hashed in production
        role: 'admin',
        password_changed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert sample personality questions if they don't exist
    const questionsExist = await this.select('personality_questions', {});
    if (questionsExist.length === 0) {
      const sampleQuestions = [
        { text: 'I am the life of the party', category: 'extraversion', order: 1, reverse: false },
        { text: 'I sympathize with others\' feelings', category: 'agreeableness', order: 2, reverse: false },
        { text: 'I get chores done right away', category: 'conscientiousness', order: 3, reverse: false },
        { text: 'I have frequent mood swings', category: 'neuroticism', order: 4, reverse: false },
        { text: 'I have a vivid imagination', category: 'openness', order: 5, reverse: false },
      ];

      for (const q of sampleQuestions) {
        await this.insert('personality_questions', {
          id: this.generateId(),
          question_text: q.text,
          trait_category: q.category,
          question_order: q.order,
          is_reverse_scored: q.reverse,
          created_at: new Date().toISOString()
        });
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Generic query methods
  async select(table: string, where?: any, orderBy?: string): Promise<any[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readonly');
      const store = transaction.objectStore(table);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result || [];

        // Apply WHERE filtering
        if (where) {
          results = results.filter(item => {
            return Object.keys(where).every(key => {
              if (where[key] === null || where[key] === undefined) {
                return item[key] === null || item[key] === undefined;
              }
              return item[key] === where[key];
            });
          });
        }

        // Apply ORDER BY
        if (orderBy) {
          results.sort((a, b) => {
            if (orderBy.includes('DESC')) {
              const field = orderBy.replace(' DESC', '');
              return new Date(b[field]).getTime() - new Date(a[field]).getTime();
            } else {
              const field = orderBy.replace(' ASC', '');
              return new Date(a[field]).getTime() - new Date(b[field]).getTime();
            }
          });
        }

        resolve(results);
      };

      request.onerror = () => {
        reject(new Error(`Failed to select from ${table}`));
      };
    });
  }

  async insert(table: string, data: any): Promise<any> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      
      // Ensure id exists
      if (!data.id) {
        data.id = this.generateId();
      }
      
      // Ensure timestamps exist
      if (!data.created_at) {
        data.created_at = new Date().toISOString();
      }
      if (!data.updated_at) {
        data.updated_at = new Date().toISOString();
      }

      const request = store.add(data);

      request.onsuccess = () => {
        resolve({ ...data, id: data.id });
      };

      request.onerror = () => {
        reject(new Error(`Failed to insert into ${table}`));
      };
    });
  }

  async update(table: string, data: any, where: any): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      
      // Update timestamp
      data.updated_at = new Date().toISOString();

      // Find the record to update
      const getRequest = store.get(where.id);
      
      getRequest.onsuccess = () => {
        const existingRecord = getRequest.result;
        if (!existingRecord) {
          reject(new Error('Record not found'));
          return;
        }

        const updatedRecord = { ...existingRecord, ...data };
        const putRequest = store.put(updatedRecord);
        
        putRequest.onsuccess = () => {
          resolve(true);
        };
        
        putRequest.onerror = () => {
          reject(new Error(`Failed to update ${table}`));
        };
      };

      getRequest.onerror = () => {
        reject(new Error(`Failed to get record from ${table}`));
      };
    });
  }

  async delete(table: string, where: any): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      
      const request = store.delete(where.id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete from ${table}`));
      };
    });
  }

  // Specific table methods
  async getStudents(): Promise<any[]> {
    return this.select('students', {}, 'created_at DESC');
  }

  async insertStudents(students: any[]): Promise<{ error?: any }> {
    try {
      for (const student of students) {
        await this.insert('students', student);
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async insertMentors(mentors: any[]): Promise<{ error?: any }> {
    try {
      for (const mentor of mentors) {
        await this.insert('mentors', mentor);
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async getMentors(): Promise<any[]> {
    return this.select('mentors', {}, 'created_at DESC');
  }

  async getCounselingAssessments(): Promise<any[]> {
    return this.select('counseling_assessments', {}, 'created_at DESC');
  }

  async getPersonalityResults(): Promise<any[]> {
    return this.select('personality_results', {}, 'created_at DESC');
  }

  async getAdminPortalData(): Promise<any[]> {
    return this.select('admin_portal_data', {}, 'created_at DESC');
  }

  async getMentorPortalData(): Promise<any[]> {
    return this.select('mentor_portal_data', {}, 'created_at DESC');
  }

  async getCredentials(): Promise<any[]> {
    return this.select('credentials', {}, 'created_at DESC');
  }

  async insertCredentials(credentials: any[]): Promise<{ error?: any }> {
    try {
      for (const credential of credentials) {
        await this.insert('credentials', credential);
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async getValidEmails(): Promise<any[]> {
    return this.select('valid_emails', {}, 'created_at DESC');
  }

  async getUploadLogs(): Promise<any[]> {
    return this.select('upload_logs', {}, 'created_at DESC');
  }

  async getPersonalityQuestions(): Promise<any[]> {
    return this.select('personality_questions', {}, 'question_order ASC');
  }

  async getPersonalityResponses(testSessionId: string): Promise<any[]> {
    return this.select('personality_responses', { test_session_id: testSessionId });
  }

  // Authentication methods
  async authenticateUser(email: string, password: string, role: string): Promise<any> {
    const credentials = await this.select('credentials', { gmail: email, role });
    
    if (credentials.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const user = credentials[0];
    if (user.password === password) { // In production, use proper password hashing
      return {
        success: true,
        requiresPasswordChange: !user.password_changed,
        user: {
          id: user.id,
          gmail: user.gmail,
          role: user.role
        }
      };
    }
    
    return { success: false, error: 'Invalid password' };
  }

  async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
    const credentials = await this.select('credentials', { id: userId });
    
    if (credentials.length === 0) {
      return { success: false, error: 'User not found' };
    }
    
    const user = credentials[0];
    if (user.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    const success = await this.update('credentials', 
      { password: newPassword, password_changed: true },
      { id: userId }
    );
    
    return { success };
  }

  // Data migration from Supabase (if needed)
  async migrateFromSupabase(supabaseData: any): Promise<void> {
    // This method can be used to migrate existing data from Supabase
    // Implementation depends on the data structure
    console.log('Migration from Supabase not implemented yet');
  }

  // Export database for backup
  async exportDatabase(): Promise<DatabaseSchema> {
    const exportData: DatabaseSchema = {
      counseling_assessments: await this.select('counseling_assessments'),
      students: await this.select('students'),
      mentors: await this.select('mentors'),
      counselors: await this.select('counselors'),
      users: await this.select('users'),
      credentials: await this.select('credentials'),
      valid_emails: await this.select('valid_emails'),
      upload_logs: await this.select('upload_logs'),
      admin_portal_data: await this.select('admin_portal_data'),
      mentor_portal_data: await this.select('mentor_portal_data'),
      personality_questions: await this.select('personality_questions'),
      personality_responses: await this.select('personality_responses'),
      personality_results: await this.select('personality_results'),
      profiles: await this.select('profiles')
    };

    return exportData;
  }

  // Import database from backup
  async importDatabase(data: DatabaseSchema): Promise<void> {
    // Clear existing data
    const tables = Object.keys(data) as (keyof DatabaseSchema)[];
    
    for (const table of tables) {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      store.clear();
    }

    // Import new data
    for (const table of tables) {
      const records = data[table];
      for (const record of records) {
        await this.insert(table, record);
      }
    }
  }
}

// Create singleton instance
const indexedDBService = new IndexedDBService();

export default indexedDBService;
