import React, { useState, useEffect } from 'react';
import { Search, Plus, Code2, Download, Upload, Trash2, Edit3, Copy, Tag, Calendar } from 'lucide-react';
import AddSnippetModal from './components/AddSnippetModal';
import EditSnippetModal from './components/EditSnippetModal';
import CodeBlock from './components/CodeBlock';
import { CodeSnippet, getSnippets, deleteSnippet, exportSnippets, importSnippets } from './utils/storage';

function App() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSnippets(getSnippets());
  }, []);

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(snippets.map(s => s.category)))];

  const handleDeleteSnippet = (id: string) => {
    deleteSnippet(id);
    setSnippets(getSnippets());
  };

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    setSnippets(getSnippets());
  };

  const handleExport = () => {
    exportSnippets();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importSnippets(file, () => {
        setSnippets(getSnippets());
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'javascript': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'typescript': 'bg-blue-100 text-blue-800 border-blue-200',
      'python': 'bg-green-100 text-green-800 border-green-200',
      'react': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'css': 'bg-pink-100 text-pink-800 border-pink-200',
      'html': 'bg-orange-100 text-orange-800 border-orange-200',
      'node': 'bg-lime-100 text-lime-800 border-lime-200',
      'utility': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category as keyof typeof colors] || 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CodeVault
                </h1>
                <p className="text-sm text-gray-500">Your Personal Code Repository</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <label className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Add Code</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search snippets, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-indigo-600 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Code2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{snippets.length}</p>
                <p className="text-sm text-gray-500">Total Snippets</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredSnippets.length}</p>
                <p className="text-sm text-gray-500">Filtered Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Code2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {snippets.length === 0 ? 'No code snippets yet' : 'No matching snippets'}
            </h3>
            <p className="text-gray-500 mb-4">
              {snippets.length === 0 
                ? 'Start building your code library by adding your first snippet'
                : 'Try adjusting your search terms or category filter'
              }
            </p>
            {snippets.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Your First Snippet
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {snippet.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{snippet.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(snippet.category)}`}>
                          {snippet.category}
                        </span>
                        {snippet.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyCode(snippet.code, snippet.id)}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Copy code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingSnippet(snippet)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit snippet"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSnippet(snippet.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete snippet"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <CodeBlock
                    code={snippet.code}
                    language={snippet.language}
                    showCopyButton={false}
                  />
                  
                  {copiedId === snippet.id && (
                    <div className="mt-3 text-center">
                      <span className="text-sm text-emerald-600 font-medium">Code copied to clipboard!</span>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Created {new Date(snippet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddSnippetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleRefresh}
      />
      
      {editingSnippet && (
        <EditSnippetModal
          isOpen={!!editingSnippet}
          onClose={() => setEditingSnippet(null)}
          onSave={handleRefresh}
          snippet={editingSnippet}
        />
      )}
    </div>
  );
}

export default App;