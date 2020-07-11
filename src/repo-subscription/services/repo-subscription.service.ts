import { Inject, Injectable, HttpService } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { Model } from 'mongoose';

import { RepoSubscription } from '../interfaces/repo-subscription.interface';
import { RepoSubscriptionDto } from '../dto/repo-subscription.dto';
import semver from './semver';

@Injectable()
export class RepoSubscriptionService {

    constructor(
        @Inject('REPO_SUBSCRIPTION_MODEL') private readonly repoSubscriptionModel: Model<RepoSubscription>,
        @InjectQueue('mail') private mailQueue: Queue,
        private httpService: HttpService,
    ) {}

    async create(repoSubscriptionDto: RepoSubscriptionDto): Promise<RepoSubscription> {
        const createdRepoSubscription = new this.repoSubscriptionModel(repoSubscriptionDto);
        // const repoSubscription = await createdRepoSubscription.save();
        await this.mailQueue.add(
            {
              repoUri: 'https://api.github.com/repos/erbilsilik/todo-app-nest',
              emails: ["erbil.silik@yandex.com", "silik.erbil@gmail.com"]
            },
            { 
                // delay: 3000,
                removeOnFail: false,
                repeat: {
                    startDate: new Date(),
                    cron: '* * * * *', // every minute
                },
            }, // 3 seconds delayed
        );
        this.mailQueue.getJobCounts().then((res) => console.log(res));
        this.mailQueue.getWorkers().then(res => console.log(res));
        return this.listOutdatedPackages(repoSubscriptionDto.url);
    }

    // list outdated packages use-case
    async listOutdatedPackages(repoUri: string): Promise<any> {
        const { data: repoInfo } = await this.httpService.get(repoUri + '/contents/package.json').toPromise();
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
