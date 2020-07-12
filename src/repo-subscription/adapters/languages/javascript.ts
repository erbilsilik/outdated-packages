export interface IJavascript {
    getRepoDependenciesFileName(): string;
}
  
export class Javascript implements IJavascript {
    public getRepoDependenciesFileName(): string {
        return 'package.json';
    }
}