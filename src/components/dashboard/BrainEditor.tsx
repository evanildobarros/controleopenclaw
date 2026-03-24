import { FileText, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BrainEditorProps {
  activeBrainFile: string;
  setActiveBrainFile: (file: any) => void;
  brainContent: string;
  setBrainContent: (val: string) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  handleSaveFile: () => Promise<void>;
  isSaving: boolean;
}

export function BrainEditor({ activeBrainFile, setActiveBrainFile, brainContent, setBrainContent, isEditing, setIsEditing, handleSaveFile, isSaving }: BrainEditorProps) {
  return (
    <div className="flex flex-col h-[70vh] border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden shadow-2xl dark:shadow-none">
        <div className="flex flex-col sm:flex-row overflow-x-auto border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
            <div className="flex">
            {(['SOUL.md', 'IDENTITY.md', 'MEMORY.md'] as const).map(file => (
                <button
                key={file}
                onClick={() => setActiveBrainFile(file)}
                className={`px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm border-r border-gray-200 dark:border-gray-800 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeBrainFile === file ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
                >
                <FileText className="w-4 h-4" />
                {file}
                </button>
            ))}
            </div>
            <div className="flex-1 flex justify-end items-center p-3 sm:px-4">
            {isEditing ? (
                <button 
                onClick={handleSaveFile}
                disabled={isSaving}
                className="flex items-center gap-2 bg-emerald-500 text-white dark:text-gray-900 px-3 py-1.5 rounded text-sm font-bold hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            ) : (
                <button 
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-medium border border-gray-300 dark:border-gray-700 px-3 py-1.5 rounded transition-colors"
                >
                Editar Arquivo
                </button>
            )}
            </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className={`flex-1 lg:border-r border-b lg:border-b-0 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black ${!isEditing && 'hidden'}`}>
            <textarea 
                className="w-full h-full bg-transparent text-gray-800 dark:text-gray-300 font-mono text-sm p-4 focus:outline-none resize-none custom-scrollbar"
                value={brainContent}
                onChange={e => setBrainContent(e.target.value)}
                spellCheck={false}
            />
            </div>
            
            <div className={`flex-1 bg-white dark:bg-gray-900 p-4 sm:p-6 overflow-y-auto custom-scrollbar prose prose-sm sm:prose-base max-w-none ${!isEditing && 'w-full flex-none'}`}>
                <ReactMarkdown>{brainContent}</ReactMarkdown>
            </div>
        </div>
    </div>
  );
}
