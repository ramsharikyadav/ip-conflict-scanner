
import React from 'react';
import IpScanner from './components/IpScanner';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-brand-primary font-sans">
            <header className="bg-brand-secondary/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-brand-text tracking-wider">
                        Gemini IP Conflict Scanner
                    </h1>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <IpScanner />
            </main>
            <footer className="text-center p-4 text-brand-light/50 text-sm">
                <p>&copy; 2024 Gemini IP Tools. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
