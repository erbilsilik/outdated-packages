import { Injectable, HttpService } from '@nestjs/common';

import { RepoSubscription } from '../interfaces/repo-subscription.interface';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';
import semver from './semver';
import { MailEventEmitter } from '../events/app.events';
import { InjectEventEmitter } from 'nest-emitter';
import { LanguageAdapter } from '../adapters/languages/language-adapter';

@Injectable()
export class RepoSubscriptionService {
    private languageAdapter: LanguageAdapter;

    constructor(
        private httpService: HttpService,
        @InjectEventEmitter() private readonly mailEmitter: MailEventEmitter,
    ) {}

    async subscribe(repoSubscriptionDto: RepoSubscriptionDto): Promise<RepoSubscription> {
        // this.mailEmitter.emit('mail', repoSubscriptionDto);
        return this.listOutdatedPackages(repoSubscriptionDto.url);
    }

    async listOutdatedPackages(repoUri: string): Promise<any> {
        let totalPackageFile = 0;
        const repoContentUrl = `${repoUri}/contents`;
        const { data: repoInfo } = await this.httpService.get(repoContentUrl).toPromise();
        const packageFiles: any = Object.values(repoInfo).reduce((outDatedPackages: Array<any>, { name }) => 
            LanguageAdapter.getPackageNames().includes(name) ? [...outDatedPackages, name] : outDatedPackages, []);

        const packages = {};

        while (totalPackageFile < packageFiles.length) {
            const packageFile: string = packageFiles[totalPackageFile];
            this.languageAdapter = new LanguageAdapter(packageFile);
            const { data: repoInfo }: any = await this.httpService.get(`${repoContentUrl}/${packageFile}`).toPromise();
            const content = JSON.parse(Buffer.from(repoInfo.content, 'base64').toString('ascii'));
            const dependencies = content[this.languageAdapter.getDependencyKeys()['dependencies']];
            const devDependencies = content[this.languageAdapter.getDependencyKeys()['devDependencies']];
            const dependencyList = this.getDependencyList(dependencies, devDependencies);
            const latestVersions = await Promise.all(
                dependencyList.map(async ([key]) => await this.getLatestVersion(key))
            );
            packages[packageFiles[totalPackageFile]] =
                dependencyList.reduce((outDatedPackages: Array<any>, [name, currentVersion], index: number) => {
                    const latestVersion = latestVersions[index];
                    if (latestVersion && semver.isOutDated(currentVersion, latestVersion)) {
                        return [
                            ...outDatedPackages,
                            {
                            name,
                            currentVersion,
                            latestVersion: latestVersions[index],
                            },
                        ];
                    }
                    return outDatedPackages;
                }, []);
        }
        totalPackageFile++;
        return packages;
    }

    private getDependencyList(dependencies, devDependencies): any {
        const dependencyList: any = {
            dependencies: Object.entries(dependencies),
            devDependencies: Object.entries(devDependencies)
        };
        return Object.values(dependencyList).flat();
            // .reduce((flattenedDependencies: Array<any>, dependencies: Array<any>) => (
            //     [...flattenedDependencies, ...dependencies]), []
            // );
    }

    async getLatestVersion(repoName: string) {
        const url = this.languageAdapter.getRegistryUrl(repoName);
        if (url) {
            const result = await this.httpService.get(url).toPromise();
            if (result) return this.languageAdapter.getVersionFromResponse(repoName, result.data);
        }
        return null;
    }
}
