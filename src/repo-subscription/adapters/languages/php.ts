export interface IPhp {
    getRepoDependenciesFileName(): string;
    getRegistryUrl(repositoryName: string): string;
}

const PACKGAIST_REGISTRY = 'https://repo.packagist.org/p';
  
export class Php implements IPhp {
    public getRepoDependenciesFileName(): string {
        return 'composer.json';
    }

    public getRegistryUrl(repositoryName: string): string {
        const [scope, scopedRepositoryName] = repositoryName.split('/');
        if (scopedRepositoryName) {
            return `${PACKGAIST_REGISTRY}/${scope}${encodeURIComponent('/')}${scopedRepositoryName}.json`
        };
    }

    public getVersionFromResponse(repositoryName: string, data: any) {
        return this.resolveLatestRelease(Object.keys(data['packages'][repositoryName]));
    }

    private resolveLatestRelease(releases) {
        let latestVersion = null;
        for (let i = releases.length - 1; i > 0; i--) {
            const release = releases[i];
            if (
                /^(\*|\d+(\.\d+)*(\.\*)?)$/.exec(release) || // TODO move to another file and make constant
                /^v(\*|\d+(\.\d+)*(\.\*)?)$/.exec(release) ||
                /^~(\*|\d+(\.\d+)*(\.\*)?)$/.exec(release)
            ) {
                latestVersion = releases[i];
                break;
            }
        }
        return latestVersion;
    }

    public getDependencyKeys() {
        return {
            dependencies: 'require',
            devDependencies: 'require-dev',
        };
    }
}