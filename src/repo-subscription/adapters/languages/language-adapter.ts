import { Typescript } from "./typescript";
import { Javascript } from "./javascript";
import { Php } from "./php";

export interface ILanguage {
  getRepoDependenciesFileName(): string;
}

export class LanguageAdapter implements ILanguage {
  private language: string;
  private languageInstance: ILanguage;
  
  constructor(language: string) {
    this.language = language;
    this.languageInstance = this.createInstance();
  }

  private getCallableClasses(): Record<string, Function> {
    return {
      'TypeScript': () => new Typescript(),
      'Javascript': () => new Javascript(),
      'Php': () => new Php(),
    };
  }

  private createInstance() {
    return this.getCallableClasses()[this.language]();
  }

  getRepoDependenciesFileName(): string {
    return this.languageInstance.getRepoDependenciesFileName();
  }
}