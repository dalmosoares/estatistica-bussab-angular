import { ArrayUtil } from "src/app/utils/array-util";
import { FreqDiscrItem } from "./FreqDiscrItem";
import { FreqCont } from "./FreqCont";
import { NumeroUtil } from "src/app/utils/numero-util";

export class FreqDiscr{

  registros:(string|number)[];
  marcarAusentes?:boolean;
  excluir?:any;

  constructor(registros:(string|number)[],excluir?:any,marcarAusentes?:boolean){
    this.registros = registros.filter(r=>excluir==undefined || r!=excluir);
    this.marcarAusentes = marcarAusentes;
    this.excluir = excluir;
  }

  executarMarcarAusentes(dados:FreqDiscrItem[]):FreqDiscrItem[]{
    const vMin = Math.min(...dados.map(d=>d.valor));
    const vMax = Math.max(...dados.map(d=>d.valor));
    const excluidos:FreqDiscrItem[] = [];
    for(let i=vMin;i<=vMax;i++){
        if(!dados.find(d=>d.valor==i)){
            excluidos.push({valor:i,freq:0,prop:0,porcent:0});
        }
    }
    return dados.concat(excluidos).sort((a,b)=>a.valor-b.valor);
  }

  get freqs():FreqDiscrItem[]{
    const saida = ArrayUtil.distintos(this.registros).sort((v1,v2)=>
      NumeroUtil.ehNumero(v1) && NumeroUtil.ehNumero(v2) ?
      (v1 as number) - (v2 as number) :
      v1.toString().localeCompare(v2.toString())
    ).map(valor=>{
      const freq = this.registros.filter(u=>u==valor).length;
      const prop = freq/this.registros.length;
      return {valor,freq,prop,porcent:prop*100};
    });
    return this.marcarAusentes?this.executarMarcarAusentes(saida):saida;
  }

  toCont(extremos:number[]):FreqCont{
    return new FreqCont(this.registros as number[],extremos);
  }

}