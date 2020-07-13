const castToNumber = (version: string): string => {
    try {
        const firstChar = Number(version.charAt(0));
        if (isNaN(firstChar)) {
            version = version.replace(version.charAt(0), '');
        }
    }
    catch (e) {
        return version;
    }
    return version;
}

const compareVersion = (left: string, right: string) => {
    const a = left.split('.');
    const b = right.split('.');
    let i = 0;
    const len = Math.max(a.length, b.length);
        
    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) return false; 
        if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) return true;
    }
    return false;
}

export default {
    isOutDated: (currentVersion: string, latestVersion: any): boolean => {
        const currentVersionCastedToNumber = castToNumber(currentVersion);
        const latestVersionCastedToNumber = castToNumber(latestVersion);
        const result = compareVersion(currentVersionCastedToNumber, latestVersionCastedToNumber);
        return result;
    }
}
