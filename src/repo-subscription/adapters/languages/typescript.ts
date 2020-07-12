export interface ITypescript {
    getRepoDependenciesFileName(): string;
  }
  
export class Typescript implements ITypescript {
    public getRepoDependenciesFileName(): string {
        return 'package.json';
    }
}