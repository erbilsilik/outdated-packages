import { Injectable, HttpService } from '@nestjs/common';

import { RepoSubscription } from '../interfaces/repo-subscription.interface';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';
import semver from './semver';
import { MailEventEmitter } from '../events/app.events';
import { InjectEventEmitter } from 'nest-emitter';
import { LanguageAdapter } from '../adapters/languages/language-adapter';

@Injectable()
export class RepoSubscriptionService {

    constructor(
        private httpService: HttpService,
        @InjectEventEmitter() private readonly mailEmitter: MailEventEmitter,
    ) {}

    async subscribe(repoSubscriptionDto: RepoSubscriptionDto, language): Promise<RepoSubscription> {
        this.mailEmitter.emit('mail', repoSubscriptionDto);
        return this.listOutdatedPackages(repoSubscriptionDto.url, language);
    }

    // list outdated packages use-case
    async listOutdatedPackages(repoUri: string, language: string): Promise<any> {
        const languageAdapter = new LanguageAdapter(language);
        const repoDependenciesFileName = languageAdapter.getRepoDependenciesFileName();
        const packageContentUrl = `${repoUri}/contents/${repoDependenciesFileName}`;
        const { data: repoInfo } = await this.httpService.get(packageContentUrl).toPromise();
        const { dependencies, devDependencies } = JSON.parse(this.decode(repoInfo.content));
        const dependencyList = this.getDependencyList(dependencies, devDependencies);
        const latestVersions = await Promise.all(
            dependencyList.map(async ([key]) => await this.getLatestVersion(key))
        );
        return dependencyList.reduce((outDatedPackages, [name, currentVersion], index) => {
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

    private decode(content): string {
        return Buffer.from(content, 'base64').toString('ascii');
    }

    private getDependencyList(dependencies, devDependencies): any {
        const dependencyList: any = {
            dependencies: Object.entries(dependencies),
            devDependencies: Object.entries(devDependencies)
        };
        return Object.values(dependencyList)
            .reduce((flattenedDependencies: Array<any>, dependencies: Array<any>) => (
                [...flattenedDependencies, ...dependencies]), []
            );
    }

    async getLatestVersion(packageName: string) {
        if (this.isScopedPackage(packageName)) {
            return this.callScopedPackageProvider(packageName);
        }
        return this.callPackageProvider(packageName);
    }

    private isScopedPackage(packageName: string) {
        return packageName.charAt(0) === '@';
    }

    async callScopedPackageProvider(packageName) {
        const [scope, scopedPackageName] = packageName.split('/');
        const url = `https://registry.npmjs.org/${scope}${encodeURIComponent('/')}${scopedPackageName}`;
        const result = await this.httpService.get(url).toPromise();
        if (result) return result.data['dist-tags'].latest;
        return null;
    }

    async callPackageProvider(packageName) {
        const url = `https://registry.npmjs.org/${packageName}/latest`;
        const result = await this.httpService.get(url).toPromise();
        if (result) return result.data.version;
        return null;
    }
}
