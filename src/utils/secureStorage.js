import secureLocalStorage from 'react-secure-storage';

export const STORAGE_KEYS = {
  USER: 'todoApp_user',
  AUTH_STATE: 'todoApp_authenticated',
  TODOS: 'todos',
  USER_PREFERENCES: 'todoApp_preferences'
};

export const storeUser = (user, todos = null) => {
  try {
    if (user) {
      secureLocalStorage.setItem(STORAGE_KEYS.USER, user);
      secureLocalStorage.setItem(STORAGE_KEYS.AUTH_STATE, true);
      
      if (todos !== null) {
        localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
      }
    } else {
      secureLocalStorage.removeItem(STORAGE_KEYS.USER);
      secureLocalStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      localStorage.removeItem(STORAGE_KEYS.TODOS);
    }
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUser = () => {
  try {
    return secureLocalStorage.getItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};


export const isAuthenticated = () => {
  try {
    const authState = secureLocalStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    return authState === true;
  } catch (error) {
    console.error('Error checking auth state:', error);
    return false;
  }
};


export const storeTodos = (todos) => {
  try {
    secureLocalStorage.setItem(STORAGE_KEYS.TODOS, todos);
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  } catch (error) {
    console.error('Error storing todos:', error);
  }
};

export const getTodos = () => {
  try {
    let todos = secureLocalStorage.getItem(STORAGE_KEYS.TODOS);
    if (!todos) {
      const localTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
      todos = localTodos ? JSON.parse(localTodos) : [];
    }
    return todos || [];
  } catch (error) {
    console.error('Error retrieving todos:', error);
    return [];
  }
};

export const storeUserPreferences = (preferences) => {
  try {
    secureLocalStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  } catch (error) {
    console.error('Error storing user preferences:', error);
  }
};


export const getUserPreferences = () => {
  try {
    const preferences = secureLocalStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferences || {};
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return {};
  }
};


export const clearAllSecureData = () => {
  try {
    secureLocalStorage.clear();
    localStorage.removeItem(STORAGE_KEYS.TODOS);
  } catch (error) {
    console.error('Error clearing secure data:', error);
  }
};


export const getStorageInfo = () => {
  try {
    const user = getUser();
    const authenticated = isAuthenticated();
    const todos = getTodos();
    const preferences = getUserPreferences();
    
    return {
      hasUser: !!user,
      userName: user?.name || 'N/A',
      userEmail: user?.email || 'N/A',
      isAuthenticated: authenticated,
      todosCount: todos.length,
      hasPreferences: Object.keys(preferences).length > 0,
      storageKeys: STORAGE_KEYS
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {};
  }
};

const secureStorageUtils = {
  storeUser,
  getUser,
  isAuthenticated,
  storeTodos,
  getTodos,
  storeUserPreferences,
  getUserPreferences,
  clearAllSecureData,
  getStorageInfo,
  STORAGE_KEYS
};

export default secureStorageUtils;
