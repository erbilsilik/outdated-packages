import { Typescript } from "./typescript";
import { Javascript } from "./javascript";
import { Php } from "./php";

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
      'package.json': () => new Typescript(),
      // 'package.json': () => new Javascript(),
      'composer.json': () => new Php(),
    };
  }

  public static getPackageNames() {
    return [
      'package.json',
      'composer.json',
    ];
  }

  private createInstance() {
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

  public getVersionFromResponse(repositoryName: string, res): string {
    return this.languageInstance.getVersionFromResponse(repositoryName, res);
  }
}