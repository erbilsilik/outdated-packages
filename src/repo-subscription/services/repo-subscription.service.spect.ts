import { Injectable, HttpService } from '@nestjs/common';

import { RepoSubscription } from '../interfaces/repo-subscription.interface';
import { MailEventEmitter } from '../events/app.events';
import { InjectEventEmitter } from 'nest-emitter';
import { LanguageAdapter } from '../adapters/languages/language-adapter';
import { ConfigService } from '@nestjs/config';
import { SemverService } from '../semver/semver.service';
import { RepoPackage } from '../interfaces/repo-package.interface';

@Injectable()
export class RepoSubscriptionService {
    private languageAdapter: LanguageAdapter;

    constructor(
        private httpService: HttpService,
        @InjectEventEmitter() private readonly mailEmitter: MailEventEmitter,
        private configService: ConfigService,
        private semverService: SemverService,
    ) {}

    async subscribe(repoSubscription: RepoSubscription): Promise<Array<RepoPackage>> {
        this.mailEmitter.emit('mail', repoSubscription);
        return this.listOutdatedPackages(repoSubscription.url);
    }

    async listOutdatedPackages(repoUri: string): Promise<any> {
        let totalPackageFile = 0;
        const repoContentUrl = `${repoUri}/contents`;
        const { data: repoInfo } = await this.httpService.get(repoContentUrl, {
            headers: {
                'Authorization': `token ${this.configService.get<string>('GITHUB_OAUTH_TOKEN')}`,
            }
        }).toPromise();
        const packageFiles: any = Object.values(repoInfo).reduce((outDatedPackages: Array<any>, { name }) => 
            LanguageAdapter.getPackageNames().includes(name) ? [...outDatedPackages, name] : outDatedPackages, []);

        const packages = {};

        while (totalPackageFile < packageFiles.length) {
            const packageFile: string = packageFiles[totalPackageFile];
            this.languageAdapter = new LanguageAdapter(packageFile);
            const { data: repo }: any = await this.httpService.get(`${repoContentUrl}/${packageFile}`, {
                headers: {
                    'Authorization': `token ${this.configService.get<string>('GITHUB_OAUTH_TOKEN')}`,
                }
            }).toPromise();
            const content = JSON.parse(Buffer.from(repo.content, 'base64').toString('ascii'));
            const dependencies = content[this.languageAdapter.getDependencyKeys()['dependencies']];
            const devDependencies = content[this.languageAdapter.getDependencyKeys()['devDependencies']];
            const dependencyList = this.getDependencyList(dependencies, devDependencies);
            const latestVersions = await Promise.all(
                dependencyList.map(async ([key]) => await this.getLatestVersion(key))
            );
            packages[packageFiles[totalPackageFile]] =
                dependencyList.reduce((outDatedPackages: Array<any>, [name, currentVersion], index: number) => {
                    const latestVersion = latestVersions[index];
                    if (latestVersion && this.isOutDated(currentVersion, latestVersion)) {
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
            totalPackageFile++;
        }
        return packages;
    }

    private getDependencyList(dependencies, devDependencies): any {
        const dependencyList: any = {
            dependencies: dependencies ? Object.entries(dependencies) : [],
            devDependencies: devDependencies ? Object.entries(devDependencies) : []
        };
        return Object.values(dependencyList).flat();
    }

    async getLatestVersion(repoName: string) {
        const url = this.languageAdapter.getRegistryUrl(repoName);
        if (url) {
            const result = await this.httpService.get(url).toPromise().catch(() => null);
            if (result) return this.languageAdapter.getVersionFromResponse(repoName, result.data);
        }
        return null;
    }

    private isOutDated(currentVersion: string, latestVersion: any): boolean{
        const currentVersionCastedToNumber: string = this.semverService.castToNumber(currentVersion);
        const latestVersionCastedToNumber: string = this.semverService.castToNumber(latestVersion);
        const result: boolean = this.semverService.compareVersion(
            currentVersionCastedToNumber, latestVersionCastedToNumber
        );
        return result;
    }
}
