import indexedDBService from "@/integrations/sqlite/database";

export interface LoginCredentials {
  gmail: string;
  password: string;
  role: 'counselor' | 'mentor' | 'admin' | 'student';
}

export interface AuthResult {
  success: boolean;
  requiresPasswordChange?: boolean;
  error?: string;
  user?: {
    id: string;
    gmail: string;
    role: string;
  };
}

export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
  try {
    // Use local IndexedDB authentication
    const result = await indexedDBService.authenticateUser(
      credentials.gmail.trim(),
      credentials.password,
      credentials.role
    );

    if (result.success) {
      return {
        success: true,
        requiresPasswordChange: result.requiresPasswordChange,
        user: result.user
      };
    } else {
      return {
        success: false,
        error: result.error || 'Invalid credentials. Please check your email and role.'
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.'
    };
  }
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Use local IndexedDB password change
    const result = await indexedDBService.changeUserPassword(userId, currentPassword, newPassword);

    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update password.'
      };
    }
  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      error: 'Failed to change password.'
    };
  }
};

// Store user session in localStorage
export const storeUserSession = (user: { id: string; gmail: string; role: string }) => {
  localStorage.setItem('credentialsAuth', JSON.stringify(user));
};

// Get user session from localStorage
export const getUserSession = (): { id: string; gmail: string; role: string } | null => {
  try {
    const stored = localStorage.getItem('credentialsAuth');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Clear user session
export const clearUserSession = () => {
  localStorage.removeItem('credentialsAuth');
};