
export enum ScanStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    Conflict = 'Conflict',
    Pending = 'Pending',
}

export interface IpInfo {
    ip: string;
    status: ScanStatus;
    macAddresses: string[];
    hostname?: string;
}
