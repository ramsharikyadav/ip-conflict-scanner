import React from 'react';
import { IpInfo, ScanStatus } from '../types';
import { getMacVendor } from '../services/macVendorService';

interface IpCardProps {
    data: IpInfo;
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const statusStyles: Record<ScanStatus, { bg: string; text: string; icon: React.ReactElement }> = {
    [ScanStatus.Pending]: {
        bg: 'bg-brand-accent/20',
        text: 'text-brand-light',
        icon: <div className="h-2 w-2 rounded-full bg-brand-light animate-pulse"></div>,
    },
    [ScanStatus.Active]: {
        bg: 'bg-status-active/10',
        text: 'text-status-active',
        icon: <div className="h-2 w-2 rounded-full bg-status-active"></div>,
    },
    [ScanStatus.Inactive]: {
        bg: 'bg-status-inactive/10',
        text: 'text-status-inactive',
        icon: <div className="h-2 w-2 rounded-full bg-status-inactive"></div>,
    },
    [ScanStatus.Conflict]: {
        bg: 'bg-status-conflict/10 border border-status-conflict',
        text: 'text-status-conflict',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
};

const IpCard: React.FC<IpCardProps> = ({ data }) => {
    const { ip, status, macAddresses } = data;
    const styles = statusStyles[status];

    return (
        <div className={`rounded-lg p-3 transition-all duration-300 ${styles.bg} animate-fade-in`}>
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-mono text-brand-text">{ip}</p>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${styles.text}`}>
                    {styles.icon}
                    <span>{status}</span>
                </div>
            </div>
            {macAddresses.length > 0 && (
                <div className="text-xs font-mono text-brand-light/70 space-y-1">
                    {macAddresses.map((mac) => {
                        const vendor = getMacVendor(mac);
                        return (
                            <p key={mac}>
                                {mac}
                                {vendor !== 'Unknown Vendor' && (
                                    <span className="text-brand-light/50 ml-1">({vendor})</span>
                                )}
                            </p>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IpCard;
