// Migration helper utility for converting Supabase data to local IndexedDB
// This helps users migrate their existing data when switching from Supabase to local database

import indexedDBService from "@/integrations/sqlite/database";

export interface MigrationData {
  counseling_assessments?: any[];
  students?: any[];
  mentors?: any[];
  counselors?: any[];
  users?: any[];
  credentials?: any[];
  valid_emails?: any[];
  upload_logs?: any[];
  admin_portal_data?: any[];
  mentor_portal_data?: any[];
  personality_questions?: any[];
  personality_responses?: any[];
  personality_results?: any[];
  profiles?: any[];
}

export class MigrationHelper {
  /**
   * Migrate data from Supabase format to local IndexedDB
   * @param supabaseData - Data exported from Supabase
   */
  static async migrateFromSupabase(supabaseData: MigrationData): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting migration from Supabase...');
      
      // Migrate each table
      const tables = Object.keys(supabaseData) as (keyof MigrationData)[];
      
      for (const table of tables) {
        const data = supabaseData[table];
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`Migrating ${table}: ${data.length} records`);
          
          // Clear existing data for this table
          await this.clearTable(table);
          
          // Insert migrated data
          for (const record of data) {
            await this.migrateRecord(table, record);
          }
          
          console.log(`Successfully migrated ${table}`);
        }
      }
      
      console.log('Migration completed successfully');
      return { success: true, message: 'Migration completed successfully' };
      
    } catch (error) {
      console.error('Migration failed:', error);
      return { success: false, message: `Migration failed: ${error}` };
    }
  }

  /**
   * Clear all data from a specific table
   */
  private static async clearTable(table: string): Promise<void> {
    try {
      // Get all records and delete them one by one
      const records = await indexedDBService.select(table);
      for (const record of records) {
        await indexedDBService.delete(table, { id: record.id });
      }
    } catch (error) {
      console.warn(`Could not clear table ${table}:`, error);
    }
  }

  /**
   * Migrate a single record, handling data type conversions
   */
  private static async migrateRecord(table: string, record: any): Promise<void> {
    try {
      // Convert Supabase-specific data types to local format
      const migratedRecord = this.convertRecordFormat(table, record);
      
      // Insert the migrated record
      await indexedDBService.insert(table, migratedRecord);
    } catch (error) {
      console.warn(`Could not migrate record in ${table}:`, error, record);
    }
  }

  /**
   * Convert Supabase data format to local IndexedDB format
   */
  private static convertRecordFormat(table: string, record: any): any {
    const converted = { ...record };

    // Handle common Supabase-specific conversions
    if (converted.created_at && typeof converted.created_at === 'string') {
      // Ensure timestamp is in ISO format
      converted.created_at = new Date(converted.created_at).toISOString();
    }
    
    if (converted.updated_at && typeof converted.updated_at === 'string') {
      converted.updated_at = new Date(converted.updated_at).toISOString();
    }

    // Handle boolean conversions (Supabase might use 0/1, convert to true/false)
    if (table === 'counseling_assessments') {
      if (converted.approved !== undefined) {
        converted.approved = Boolean(converted.approved);
      }
      if (converted.test_completed !== undefined) {
        converted.test_completed = Boolean(converted.test_completed);
      }
    }

    if (table === 'credentials') {
      if (converted.password_changed !== undefined) {
        converted.password_changed = Boolean(converted.password_changed);
      }
    }

    if (table === 'users') {
      if (converted.verified !== undefined) {
        converted.verified = Boolean(converted.verified);
      }
    }

    if (table === 'profiles') {
      if (converted.is_approved !== undefined) {
        converted.is_approved = Boolean(converted.is_approved);
      }
    }

    if (table === 'personality_questions') {
      if (converted.is_reverse_scored !== undefined) {
        converted.is_reverse_scored = Boolean(converted.is_reverse_scored);
      }
    }

    // Handle array fields that might be stored as JSON strings
    if (converted.role_of_function && typeof converted.role_of_function === 'string') {
      try {
        converted.role_of_function = JSON.parse(converted.role_of_function);
      } catch {
        converted.role_of_function = [];
      }
    }

    if (converted.personality_analysis && typeof converted.personality_analysis === 'string') {
      try {
        converted.personality_analysis = JSON.parse(converted.personality_analysis);
      } catch {
        converted.personality_analysis = [];
      }
    }

    if (converted.analysis_text && typeof converted.analysis_text === 'string') {
      try {
        converted.analysis_text = JSON.parse(converted.analysis_text);
      } catch {
        converted.analysis_text = [];
      }
    }

    if (converted.personality_scores && typeof converted.personality_scores === 'string') {
      try {
        converted.personality_scores = JSON.parse(converted.personality_scores);
      } catch {
        converted.personality_scores = {};
      }
    }

    if (converted.detailed_analysis && typeof converted.detailed_analysis === 'string') {
      try {
        converted.detailed_analysis = JSON.parse(converted.detailed_analysis);
      } catch {
        converted.detailed_analysis = {};
      }
    }

    if (converted.error_log && typeof converted.error_log === 'string') {
      try {
        converted.error_log = JSON.parse(converted.error_log);
      } catch {
        converted.error_log = {};
      }
    }

    return converted;
  }

  /**
   * Export current local database for backup
   */
  static async exportLocalDatabase(): Promise<MigrationData> {
    try {
      return await indexedDBService.exportDatabase();
    } catch (error) {
      console.error('Failed to export local database:', error);
      throw error;
    }
  }

  /**
   * Import data from backup
   */
  static async importFromBackup(backupData: MigrationData): Promise<{ success: boolean; message: string }> {
    try {
      await indexedDBService.importDatabase(backupData);
      return { success: true, message: 'Backup imported successfully' };
    } catch (error) {
      console.error('Failed to import backup:', error);
      return { success: false, message: `Import failed: ${error}` };
    }
  }

  /**
   * Get migration status and statistics
   */
  static async getMigrationStatus(): Promise<{ tableCounts: Record<string, number>; totalRecords: number }> {
    try {
      const tables = [
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

      const tableCounts: Record<string, number> = {};
      let totalRecords = 0;

      for (const table of tables) {
        const count = (await indexedDBService.select(table)).length;
        tableCounts[table] = count;
        totalRecords += count;
      }

      return { tableCounts, totalRecords };
    } catch (error) {
      console.error('Failed to get migration status:', error);
      return { tableCounts: {}, totalRecords: 0 };
    }
  }
}

export default MigrationHelper;
