import { Typescript } from "./typescript";
import { Javascript } from "./javascript";
import { Php } from "./php";

export const PACKAGE_JSON = 'package.json';
export const COMPOSER_JSON = 'composer.json';

export interface ILanguage {
  getRepoDependenciesFileName(): string;
  getRegistryUrl(repositoryName: string): string;
  getDependencyKeys(): any;
  getVersionFromResponse(repositoryName: string, res: any): string;
}

export class LanguageAdapter implements ILanguage {
  private packageFile: string;
  private languageInstance: ILanguage;
  
  constructor(packageFile: string) {
    this.packageFile = packageFile;
    this.languageInstance = this.createInstance();
  }

  private getCallableClasses(): Record<string, Function> {
    return {
      [PACKAGE_JSON]: () => new Typescript(),
      // 'package.json': () => new Javascript(),
      [COMPOSER_JSON]: () => new Php(),
    };
  }

  public static getPackageNames(): Array<string> {
    return [
      PACKAGE_JSON,
      COMPOSER_JSON,
    ];
  }

  private createInstance(): ILanguage {
    return this.getCallableClasses()[this.packageFile]();
  }

  public getRepoDependenciesFileName(): string {
    return this.languageInstance.getRepoDependenciesFileName();
  }

  public getRegistryUrl(repositoryName: string): string {
    return this.languageInstance.getRegistryUrl(repositoryName);
  }

  public getDependencyKeys() {
    return this.languageInstance.getDependencyKeys();
  }

  public getVersionFromResponse(repositoryName: string, res: any): string {
    return this.languageInstance.getVersionFromResponse(repositoryName, res);
  }
}