export class NumeroUtil{

    static formatador(digitos:number):Intl.NumberFormat{
        return new Intl.NumberFormat('en-IN',{style:'decimal',minimumFractionDigits:digitos,maximumFractionDigits:digitos});
    }

    /*
        Exemplos:
            base=10,numGrupos=2 gera [[0,4],[5,9]]
            base=10,numGrupos=5 gera [[0,1],[2,3],[4,5],[6,7],[8,9]]
    */
    static geraGruposContiguos(base:number,numGrupos:number):number[][]{
        const arr:number[][] = [];
        for(let i=0;i<numGrupos;i++){
          arr.push([i*base/numGrupos,((i+1)*base/numGrupos)-1]);
        }
        return arr;
    }

    static ehNumero(valor:any):boolean{
        return !isNaN(Number(valor));
    }
}