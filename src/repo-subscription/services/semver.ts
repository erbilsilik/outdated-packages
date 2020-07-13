const compareVersion = (left: string, right: string) => {
    if (typeof left + typeof right != 'stringstring')
        return false;
    
    const a = left.split('.');
    const b = right.split('.');
    let i = 0;
    const len = Math.max(a.length, b.length);
        
    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) return true; 
        if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) return false;
    }
    return false;
}

export default {
    isOutDated: (currentVersion: string, latestVersion: any): boolean => {
        if (
            /^(\*|\d+(\.\d+)*(\.\*)?)$/.exec(currentVersion) || // TODO move to another file and make constant
            /^v(\*|\d+(\.\d+)*(\.\*)?)$/.exec(currentVersion) ||
            /^~(\*|\d+(\.\d+)*(\.\*)?)$/.exec(currentVersion)
        ) {
            let currentVersionModified = currentVersion;
            let latestVersionModified = latestVersion;
            ['v', '~', '^'].forEach(char => {
                if (currentVersion.startsWith(char)) {
                    currentVersionModified = currentVersion.replace(char, '');
                }
                if (latestVersion.startsWith(char)) {
                    latestVersionModified = latestVersion.replace(char, '');
                }
            });
            return compareVersion(currentVersionModified, latestVersionModified);
        }
        return true;
    }
}
