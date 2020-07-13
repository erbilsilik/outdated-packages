export interface ITypescript {
    getRepoDependenciesFileName(): string;
    getRegistryUrl(repositoryName: string): string;
    getDependencyKeys(): any;
    getVersionFromResponse(repositoryName: string, res: any): string;
}

const NPM_REGISTRY = 'https://registry.npmjs.org';
  
export class Typescript implements ITypescript {
    public getRepoDependenciesFileName(): string {
        return 'package.json';
    }

    public getRegistryUrl(repositoryName: string): string {
        if (repositoryName.charAt(0) === '@') {
            const [scope, scopedRepositoryName] = repositoryName.split('/');
            return `${NPM_REGISTRY}/${scope}${encodeURIComponent('/')}${scopedRepositoryName}`;
        }
        return `${NPM_REGISTRY}/${repositoryName}/latest`;
    }

    public getVersionFromResponse(repositoryName: string, data: any) {
        if (repositoryName.charAt(0) === '@') {
            return data['dist-tags'].latest;
        }
        return data.version;
    }

    public getDependencyKeys() {
        return {
            dependencies: 'dependencies',
            devDependencies: 'devDependencies',
        };
    }
}