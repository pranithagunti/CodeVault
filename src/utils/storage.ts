export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'codevault_snippets';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getSnippets = (): CodeSnippet[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading snippets:', error);
    return [];
  }
};

export const saveSnippet = (snippetData: Omit<CodeSnippet, 'id'>): void => {
  try {
    const snippets = getSnippets();
    const newSnippet: CodeSnippet = {
      ...snippetData,
      id: generateId()
    };
    snippets.unshift(newSnippet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  } catch (error) {
    console.error('Error saving snippet:', error);
  }
};

export const updateSnippet = (updatedSnippet: CodeSnippet): void => {
  try {
    const snippets = getSnippets();
    const index = snippets.findIndex(s => s.id === updatedSnippet.id);
    if (index !== -1) {
      snippets[index] = updatedSnippet;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    }
  } catch (error) {
    console.error('Error updating snippet:', error);
  }
};

export const deleteSnippet = (id: string): void => {
  try {
    const snippets = getSnippets();
    const filtered = snippets.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting snippet:', error);
  }
};

export const exportSnippets = (): void => {
  try {
    const snippets = getSnippets();
    const dataStr = JSON.stringify(snippets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `codevault-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error exporting snippets:', error);
  }
};

export const importSnippets = (file: File, onSuccess: () => void): void => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target?.result as string);
      
      if (Array.isArray(importedData)) {
        const existingSnippets = getSnippets();
        const validSnippets = importedData.filter(item => 
          item.id && item.title && item.code && item.language && item.category
        );
        
        // Merge with existing snippets, avoiding duplicates by ID
        const existingIds = new Set(existingSnippets.map(s => s.id));
        const newSnippets = validSnippets.filter(s => !existingIds.has(s.id));
        
        const allSnippets = [...existingSnippets, ...newSnippets];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSnippets));
        
        onSuccess();
      } else {
        throw new Error('Invalid file format');
      }
    } catch (error) {
      console.error('Error importing snippets:', error);
      alert('Error importing file. Please check the file format.');
    }
  };
  
  reader.readAsText(file);
};