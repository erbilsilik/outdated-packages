const NR = '(?:0|[1-9])[0-9]*';
const BUILD = NR;
const PRE = `[0-9a-zA-Z\\-]+(?:\\.${NR})?`;
const QUALIFIER = `-(?:${PRE})?(?:\\+${BUILD})?`;
const XR = `(?:[xX\\*]|${NR})`;
const PARTIAL = `${XR}(?:\\.${XR}(?:\\.${XR}(?:${QUALIFIER})?)?)?`;
const CARET = `\\^\\s*${PARTIAL}`;
const TILDE = `~\\s*${PARTIAL}`;
const PRIMITIVE = `(?:<|>|<=|>=)\\s*${PARTIAL}`;
const SIMPLE = `(?:${PRIMITIVE}|${PARTIAL}|${TILDE}|${CARET})`;
const HYPHEN = `${PARTIAL}\\s-\\s${PARTIAL}`;
const RANGE = `(?:${HYPHEN}|${SIMPLE}(?:\\s+${SIMPLE})*)`;
const LOGICAL_OR = `\\s*\\|\\|\\s*`;
const RANGE_SET = `${RANGE}(?:${LOGICAL_OR}${RANGE})+`;
const STRICT = `(?:=\\s*)?${NR}\\.${NR}\\.${NR}(?:${QUALIFIER})?`;
const WILDCARD = `(?:[xX\\*]|${NR}\\.[xX\\*]|${NR}\\.${NR}\\.[xX\\*])`;
// const PESSIMISTIC = `~>\\s*${PARTIAL}`;

export default {
    isOutDated: (currentVersion, latestVersion) => {
        if (new RegExp(`^${CARET}$`).exec(currentVersion)) {
            // check for major zero
            const latestVersionNumericValue = Number(latestVersion.replace(/\./g, ''))
            const currentVersionNumericValue = Number(currentVersion.replace(/^\^/, '').replace(/\./g, ''))
            return latestVersionNumericValue > currentVersionNumericValue
        }
        if (new RegExp(`^${TILDE}$`).exec(currentVersion)) {
            const latestVersionNumericValue = Number(latestVersion.replace(/\./g, ''))
            const currentVersionNumericValue = Number(currentVersion.replace(/^\~/, '').replace(/\./g, ''))
            return latestVersionNumericValue > currentVersionNumericValue
        }
        return true;
    }
}
