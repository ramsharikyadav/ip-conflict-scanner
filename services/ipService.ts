const ipToLong = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
};

const longToIp = (long: number): string => {
    return `${(long >>> 24)}.${(long >> 16) & 255}.${(long >> 8) & 255}.${long & 255}`;
};

export const parseCidr = (cidr: string): { ips: string[], error: string | null } => {
    try {
        const [ip, maskStr] = cidr.split('/');
        if (!ip || !maskStr) {
            return { ips: [], error: "Invalid CIDR format. Use 'ip/mask', e.g., 192.168.1.0/24." };
        }

        const mask = parseInt(maskStr, 10);
        if (isNaN(mask) || mask < 0 || mask > 32) {
            return { ips: [], error: "Invalid mask. Must be between 0 and 32." };
        }
        
        if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
             return { ips: [], error: "Invalid IP address format." };
        }

        const ipLong = ipToLong(ip);
        const networkMask = (0xFFFFFFFF << (32 - mask)) >>> 0;
        const networkAddress = ipLong & networkMask;
        const broadcastAddress = networkAddress | (~networkMask >>> 0);

        const hostCount = Math.pow(2, 32 - mask);
        if (hostCount > 65536) { // Limit scan size to prevent browser freeze
            return { ips: [], error: "CIDR range is too large. Please use a /16 or smaller range." };
        }

        const ips: string[] = [];
        for (let i = 0; i < hostCount; i++) {
            ips.push(longToIp(networkAddress + i));
        }
        return { ips, error: null };

    } catch (e) {
        return { ips: [], error: "Failed to parse CIDR. Please check the format." };
    }
};

const knownOuis = [
    '00:00:0C', '00:03:93', '00:0C:29', '00:1A:11', '00:50:56',
    '08:00:27', '0C:C4:7A', '28:C6:3F', '3C:D9:2B', 'B8:27:EB',
    'CC:46:D6', 'F8:E4:3B'
];

export const generateRandomMac = (): string => {
    let prefix: string;
    // 50% chance to use a known OUI for demonstration purposes
    if (Math.random() < 0.5) {
        prefix = knownOuis[Math.floor(Math.random() * knownOuis.length)];
    } else {
        prefix = 'XX:XX:XX'.replace(/X/g, () => '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16)));
    }

    const suffix = ':XX:XX:XX'.replace(/X/g, () => '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16)));

    return prefix + suffix;
};
