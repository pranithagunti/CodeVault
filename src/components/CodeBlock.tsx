import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  showCopyButton?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, showCopyButton = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting for common patterns
  const highlightCode = (code: string, language: string) => {
    if (language === 'javascript' || language === 'typescript') {
      return code
        .replace(/(\/\/.*$)/gm, '<span class="text-green-600">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-600">$1</span>')
        .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|finally)\b/g, '<span class="text-purple-600 font-semibold">$1</span>')
        .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-700">$1$2$3</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-blue-600">$1</span>');
    }
    
    if (language === 'python') {
      return code
        .replace(/(#.*$)/gm, '<span class="text-green-600">$1</span>')
        .replace(/\b(def|class|if|elif|else|for|while|return|import|from|try|except|finally|with|as|lambda|yield|global|nonlocal)\b/g, '<span class="text-purple-600 font-semibold">$1</span>')
        .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-700">$1$2$3</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-blue-600">$1</span>');
    }
    
    if (language === 'css') {
      return code
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-600">$1</span>')
        .replace(/([.#]?[a-zA-Z-]+)(\s*{)/g, '<span class="text-blue-600">$1</span>$2')
        .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="text-purple-600">$1</span>$2')
        .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-700">$1$2$3</span>');
    }
    
    if (language === 'html') {
      return code
        .replace(/(&lt;\/?)([a-zA-Z0-9-]+)(.*?&gt;)/g, '<span class="text-blue-600">$1</span><span class="text-purple-600">$2</span><span class="text-green-600">$3</span>')
        .replace(/([a-zA-Z-]+)(=)/g, '<span class="text-orange-600">$1</span>$2')
        .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-700">$1$2$3</span>');
    }
    
    return code;
  };

  const displayCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const highlightedCode = highlightCode(displayCode, language);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {showCopyButton && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-sm text-gray-400 font-medium">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-300 font-mono leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;