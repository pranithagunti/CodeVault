import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { updateSnippet, CodeSnippet } from '../utils/storage';

interface EditSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  snippet: CodeSnippet;
}

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'css', 'html', 
  'sql', 'bash', 'json', 'yaml', 'markdown', 'php', 'ruby', 'go', 'rust'
];

const CATEGORIES = [
  'javascript', 'typescript', 'python', 'react', 'css', 'html', 
  'node', 'utility', 'algorithm', 'api', 'database', 'other'
];

const EditSnippetModal: React.FC<EditSnippetModalProps> = ({ isOpen, onClose, onSave, snippet }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [category, setCategory] = useState('javascript');
  const [tags, setTags] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setDescription(snippet.description);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setCategory(snippet.category);
      setTags(snippet.tags.join(', '));
    }
  }, [snippet]);

  const handleSave = () => {
    if (!title.trim() || !code.trim()) return;

    const updatedSnippet = {
      ...snippet,
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: Date.now()
    };

    updateSnippet(updatedSnippet);
    handleClose();
    onSave();
  };

  const handleClose = () => {
    setIsPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Code Snippet</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-12rem)]">
          {/* Form */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., React Custom Hook for API calls"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Brief description of what this code does..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="react, hooks, api (comma separated)"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsPreview(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !isPreview 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsPreview(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isPreview 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor/Preview */}
          <div className="w-1/2 p-6 bg-gray-50">
            <div className="h-full flex flex-col">
              {isPreview ? (
                <div className="flex-1 overflow-hidden">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <CodeBlock code={code} language={language} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
                    placeholder="Paste your code here..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !code.trim()}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Update Snippet
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSnippetModal;