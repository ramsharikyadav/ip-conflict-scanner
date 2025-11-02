
import React from 'react';
import { IpInfo } from '../types';
import IpCard from './IpCard';

interface IpGridProps {
    results: IpInfo[];
}

const IpGrid: React.FC<IpGridProps> = ({ results }) => {
    if (results.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-brand-accent rounded-lg">
                <p className="text-brand-light">Scan results will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {results.map((result) => (
                <IpCard key={result.ip} data={result} />
            ))}
        </div>
    );
};

export default IpGrid;
