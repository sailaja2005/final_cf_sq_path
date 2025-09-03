# Migration Guide: From Supabase to Local IndexedDB

This guide explains how to migrate your Mind Pathways Assessment System from Supabase (PostgreSQL) to the new local IndexedDB database system.

## What Changed

- **Backend**: Replaced Supabase with local IndexedDB database
- **Authentication**: Simplified to credentials-based system
- **Data Storage**: All data now stored locally in the browser
- **Dependencies**: Removed external database dependencies

## Benefits of Local Database

- ✅ **No Internet Required**: Works completely offline
- ✅ **Faster Performance**: No network latency
- ✅ **Data Privacy**: All data stays on your device
- ✅ **No External Dependencies**: No need for Supabase account or API keys
- ✅ **Cost Effective**: No database hosting fees

## Migration Process

### Step 1: Backup Your Supabase Data

Before migrating, export your existing data from Supabase:

1. **Using Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to Table Editor
   - For each table, click "Export" and download as CSV or JSON

2. **Using SQL Queries**:
   ```sql
   -- Export all tables
   COPY (SELECT * FROM counseling_assessments) TO 'counseling_assessments.csv' CSV HEADER;
   COPY (SELECT * FROM students) TO 'students.csv' CSV HEADER;
   COPY (SELECT * FROM mentors) TO 'mentors.csv' CSV HEADER;
   -- ... repeat for all tables
   ```

### Step 2: Install and Run the New Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Application**:
   ```bash
   npm run dev
   ```

3. **Access the Application**: Open your browser to the local development URL

### Step 3: Migrate Your Data

The application includes a migration helper utility. You can use it in the browser console:

```javascript
// Import the migration helper
import MigrationHelper from './src/utils/migrationHelper';

// Example: Migrate from Supabase data
const supabaseData = {
  counseling_assessments: [...], // Your exported data
  students: [...],
  mentors: [...],
  // ... other tables
};

// Run migration
const result = await MigrationHelper.migrateFromSupabase(supabaseData);
console.log(result.message);
```

### Step 4: Verify Migration

Check that your data was migrated correctly:

```javascript
// Get migration status
const status = await MigrationHelper.getMigrationStatus();
console.log('Table counts:', status.tableCounts);
console.log('Total records:', status.totalRecords);
```

## Default Credentials

After migration, you can log in with these default credentials:

- **Admin**: `admin@mindpathways.com` / `admin123`
- **Change Password**: You'll be prompted to change the password on first login

## Data Structure Changes

### Boolean Fields
- Supabase: `0` or `1`
- Local: `true` or `false`

### Array Fields
- Supabase: JSON strings
- Local: Native JavaScript arrays

### Timestamps
- Supabase: Various formats
- Local: ISO 8601 strings

## Troubleshooting

### Common Issues

1. **Database Not Initializing**:
   - Check browser console for errors
   - Ensure IndexedDB is supported in your browser
   - Try clearing browser data and refreshing

2. **Migration Fails**:
   - Verify your data format matches expected structure
   - Check browser console for specific error messages
   - Ensure all required fields are present

3. **Authentication Issues**:
   - Clear browser localStorage
   - Check that credentials table was migrated correctly
   - Verify role assignments

### Browser Compatibility

- ✅ Chrome 23+
- ✅ Firefox 16+
- ✅ Safari 10+
- ✅ Edge 12+

## Backup and Restore

### Export Local Database
```javascript
const backup = await MigrationHelper.exportLocalDatabase();
const backupJson = JSON.stringify(backup, null, 2);
// Save backupJson to a file
```

### Import from Backup
```javascript
const backupData = JSON.parse(backupJson);
const result = await MigrationHelper.importFromBackup(backupData);
console.log(result.message);
```

## Security Considerations

- **Local Storage**: Data is stored in your browser's IndexedDB
- **No Encryption**: Data is not encrypted by default
- **Browser Access**: Anyone with access to your browser can see the data
- **Backup**: Regularly export your data for safekeeping

## Support

If you encounter issues during migration:

1. Check the browser console for error messages
2. Verify your data format matches the expected structure
3. Ensure all required dependencies are installed
4. Try clearing browser data and starting fresh

## Rollback Plan

If you need to revert to Supabase:

1. Keep your original Supabase project active
2. Export your local data before making changes
3. Use the migration helper to export local data
4. Convert the data back to Supabase format
5. Re-import to your Supabase project

## Performance Notes

- **Initial Load**: First load may be slower due to database initialization
- **Data Size**: Large datasets may impact browser performance
- **Memory Usage**: All data is loaded into memory
- **Offline Capability**: Works completely offline after initial load

---

**Note**: This migration is a one-way process. Once you switch to the local database, you'll need to manually sync any changes back to Supabase if you want to maintain both systems.
