export interface IPhp {
    getRepoDependenciesFileName(): string;
  }
  
export class Php implements IPhp {
    public getRepoDependenciesFileName(): string {
        return 'composer.json';
    }
}