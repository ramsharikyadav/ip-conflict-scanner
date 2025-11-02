
import React, { useState, useCallback, useRef } from 'react';
import { IpInfo, ScanStatus } from '../types';
import { parseCidr, generateRandomMac } from '../services/ipService';
import { generateConflictAnalysis } from '../services/geminiService';
import IpGrid from './IpGrid';
import GeminiAnalysis from './GeminiAnalysis';

const IpScanner: React.FC = () => {
    const [cidr, setCidr] = useState<string>('192.168.1.0/24');
    const [scanResults, setScanResults] = useState<IpInfo[]>([]);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scanProgress, setScanProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [geminiAnalysis, setGeminiAnalysis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    
    const scanTimeoutRef = useRef<number | null>(null);

    const hasConflicts = scanResults.some(r => r.status === ScanStatus.Conflict);
    const hasResults = scanResults.length > 0 && !isScanning;

    const stopScan = useCallback(() => {
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }
        setIsScanning(false);
    }, []);

    const handleStartScan = () => {
        setError(null);
        setGeminiAnalysis('');
        setScanResults([]);

        const { ips, error: parseError } = parseCidr(cidr);
        if (parseError) {
            setError(parseError);
            return;
        }

        setIsScanning(true);
        setScanProgress(0);

        const initialResults: IpInfo[] = ips.map(ip => ({ ip, status: ScanStatus.Pending, macAddresses: [] }));
        setScanResults(initialResults);

        const scanIpAtIndex = (index: number) => {
            if (index >= ips.length) {
                setIsScanning(false);
                return;
            }

            setScanResults(prev => {
                const newResults = [...prev];
                const rand = Math.random();
                let status: ScanStatus;
                const macAddresses: string[] = [];
                
                if (rand < 0.03) { // 3% chance of conflict
                    status = ScanStatus.Conflict;
                    macAddresses.push(generateRandomMac());
                    macAddresses.push(generateRandomMac());
                } else if (rand < 0.6) { // ~57% chance of being active
                    status = ScanStatus.Active;
                    macAddresses.push(generateRandomMac());
                } else { // ~40% chance of being inactive
                    status = ScanStatus.Inactive;
                }
                newResults[index] = { ...newResults[index], status, macAddresses };
                return newResults;
            });

            setScanProgress(Math.round(((index + 1) / ips.length) * 100));

            // Use a small delay for a real-time feel
            scanTimeoutRef.current = window.setTimeout(() => {
                scanIpAtIndex(index + 1);
            }, 10); // 10ms delay between each IP scan
        };
        
        scanIpAtIndex(0);
    };

    const handleAnalyze = async () => {
        const conflicts = scanResults.filter(r => r.status === ScanStatus.Conflict);
        if (conflicts.length === 0) return;

        setIsAnalyzing(true);
        setGeminiAnalysis('');
        const analysis = await generateConflictAnalysis(conflicts);
        setGeminiAnalysis(analysis);
        setIsAnalyzing(false);
    };

    const handleExportCsv = () => {
        const resultsToExport = scanResults.filter(
            r => r.status === ScanStatus.Active || r.status === ScanStatus.Conflict
        );
        if (resultsToExport.length === 0) {
            alert("No active or conflict IPs to export.");
            return;
        }
    
        const headers = ['IP Address', 'Status', 'MAC Addresses'];
        const csvRows = [headers.join(',')];
    
        resultsToExport.forEach(result => {
            const macs = `"${result.macAddresses.join('; ')}"`;
            csvRows.push([result.ip, result.status, macs].join(','));
        });
    
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `ip_scan_results_${date}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <div className="bg-brand-secondary p-6 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-grow w-full">
                        <label htmlFor="cidr-input" className="block text-sm font-medium text-brand-light mb-2">
                            IP Range (CIDR Notation)
                        </label>
                        <input
                            id="cidr-input"
                            type="text"
                            value={cidr}
                            onChange={(e) => setCidr(e.target.value)}
                            placeholder="e.g., 192.168.1.0/24"
                            className="w-full bg-brand-primary border border-brand-accent text-brand-text font-mono rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            disabled={isScanning}
                        />
                    </div>
                    {!isScanning ? (
                        <button
                            onClick={handleStartScan}
                            className="w-full md:w-auto bg-green-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>Start Scan</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopScan}
                            className="w-full md:w-auto bg-red-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            <span>Stop Scan</span>
                        </button>
                    )}
                    {hasResults && (
                         <button
                            onClick={handleExportCsv}
                            className="w-full md:w-auto bg-gray-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>Export CSV</span>
                        </button>
                    )}
                </div>
                {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
                {isScanning && (
                    <div className="mt-4">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                        Scan in Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-400">
                                        {scanProgress}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-brand-accent">
                                <div style={{ width: `${scanProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div>
                <IpGrid results={scanResults} />
            </div>

            {(hasConflicts || geminiAnalysis) && (
                 <GeminiAnalysis 
                    analysis={geminiAnalysis}
                    isAnalyzing={isAnalyzing}
                    hasConflicts={hasConflicts}
                    onAnalyze={handleAnalyze}
                />
            )}
        </div>
    );
};

export default IpScanner;
