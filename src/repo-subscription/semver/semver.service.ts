/*
    TODO Implement 3rd Party support for better results
        - https://github.com/npm/node-semver
        - https://www.npmjs.com/package/@types/semver
*/

import { Injectable } from "@nestjs/common";

@Injectable()
export class SemverService {
    public castToNumber(version: string): string {
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

    public compareVersion(left: string, right: string): boolean {
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
}