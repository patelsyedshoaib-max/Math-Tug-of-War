import React, { useState } from 'react';
import { ALL_SOURCE_FILES, CodeFile } from '../data/sourceCode';
import { X, Copy, Check, Code, FileText, Search, Folder, Terminal } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ALL_SOURCE_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredFiles = ALL_SOURCE_FILES.filter(
    (file) =>
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.filepath.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col text-slate-200 shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Source Code File Explorer
              </h2>
              <p className="text-xs text-slate-400">
                Inspect, copy, and explore all separate project code files
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-4 space-y-3 shrink-0 flex flex-col overflow-y-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* File List */}
            <div className="space-y-1 flex-1 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1">
                <Folder className="w-3 h-3" /> Project Source Files ({filteredFiles.length})
              </p>

              {filteredFiles.map((file) => {
                const isSelected = selectedFile.filepath === file.filepath;
                return (
                  <button
                    key={file.filepath}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className="truncate">{file.filename}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950/90 overflow-hidden">
            {/* File Header Bar */}
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/40 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-500">path:</span>
                <span className="text-emerald-300 font-semibold">{selectedFile.filepath}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950 select-text">
              <pre className="whitespace-pre-wrap break-all">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
