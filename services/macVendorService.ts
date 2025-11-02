// A simplified OUI to Vendor mapping. In a real-world app, this would be a much larger database
// or an API call.
const ouiVendorMap: Record<string, string> = {
    '00:00:0C': 'Cisco Systems',
    '00:03:93': 'Apple, Inc.',
    '00:0C:29': 'VMware, Inc.',
    '00:1A:11': 'Google, Inc.',
    '00:50:56': 'VMware, Inc.',
    '08:00:27': 'Oracle Corp.', // VirtualBox
    '0C:C4:7A': 'Raspberry Pi',
    '28:C6:3F': 'Amazon Technologies',
    '3C:D9:2B': 'Hewlett Packard',
    'B8:27:EB': 'Raspberry Pi',
    'CC:46:D6': 'Cisco Systems',
    'F8:E4:3B': 'Intel Corp.',
};

/**
 * Looks up the vendor of a given MAC address based on its OUI.
 * @param macAddress The MAC address string.
 * @returns The vendor name or 'Unknown Vendor' if not found.
 */
export const getMacVendor = (macAddress: string): string => {
    if (!macAddress) return 'Unknown Vendor';
    
    // OUI is the first 6 hex digits (3 octets), which is 8 characters long (e.g., '00:00:0C')
    const oui = macAddress.substring(0, 8).toUpperCase();

    return ouiVendorMap[oui] || 'Unknown Vendor';
};
