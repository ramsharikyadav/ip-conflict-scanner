
import React from 'react';

interface GeminiAnalysisProps {
    analysis: string;
    isAnalyzing: boolean;
    hasConflicts: boolean;
    onAnalyze: () => void;
}

// Simple markdown-to-HTML renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .split('\n')
        .map(line => {
            line = line.trim();
            if (line.startsWith('- ')) {
                return `<li>${line.substring(2)}</li>`;
            }
            if (line === '') {
                 return '<br />';
            }
            return `<p>${line}</p>`;
        })
        .join('')
        .replace(/<\/li><li>/g, '</li><li>')
        .replace(/<br \/><li>/g, '<ul><li>')
        .replace(/<\/li><br \/>/g, '</li></ul>')
        .replace(/(<\/li>)(?!<ul>)/g, '$1</ul>')
        .replace(/<li>/g, '<ul><li>');

    return (
        <div className="prose prose-invert text-brand-light" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
};


const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ analysis, isAnalyzing, hasConflicts, onAnalyze }) => {
    const renderContent = () => {
        if (isAnalyzing) {
            return (
                <div className="flex flex-col items-center justify-center p-8">
                    <svg className="animate-spin h-8 w-8 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-brand-light">Gemini is analyzing the conflicts...</p>
                </div>
            );
        }
        if (analysis) {
            return <MarkdownRenderer content={analysis} />;
        }
        return (
            <div className="text-center text-brand-light">
                <p>Click the button to get an AI-powered analysis and resolution steps for the detected conflicts.</p>
            </div>
        );
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-brand-text">Gemini Analysis</h2>
                <button
                    onClick={onAnalyze}
                    disabled={!hasConflicts || isAnalyzing}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-brand-accent disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Analyze Conflicts</span>
                </button>
            </div>
            <div className="bg-brand-secondary p-6 rounded-lg min-h-[10rem]">
                {renderContent()}
            </div>
        </div>
    );
};

export default GeminiAnalysis;
