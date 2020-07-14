import { PACKAGE_JSON } from "./language-adapter";

export interface IJavascript {
    getRepoDependenciesFileName(): string;
    getRegistryUrl(repositoryName: string): string;
}

const NPM_REGISTRY = 'https://registry.npmjs.org';
  
export class Javascript implements IJavascript {
    public getRepoDependenciesFileName(): string {
        return PACKAGE_JSON;
    }

    public getRegistryUrl(repositoryName: string): string {
        if (repositoryName.charAt(0) === '@') {
            const [scope, scopedRepositoryName] = repositoryName.split('/');
            return `${NPM_REGISTRY}/${scope}${encodeURIComponent('/')}${scopedRepositoryName}`;
            // result.data['dist-tags'].latest;
        }
        return `${NPM_REGISTRY}/${repositoryName}/latest`; // result.data.version
    }
}