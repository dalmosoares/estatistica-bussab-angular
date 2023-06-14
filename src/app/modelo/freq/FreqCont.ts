import { ArrayUtil } from "src/app/utils/array-util";
import { Coluna } from "../entidade/coluna/Coluna";
import { Parametros } from "../opc/Parametros";
import { FreqContItem } from "./FreqContItem";
import { FreqDiscr } from "./FreqDiscr";

type Intervalo = {
    inicio:number,
    fim:number
};

export class FreqCont{
    registros:number[];
    intervalos:Intervalo[];
    excluir?:number;

    constructor(registros:number[],extremos:number[],excluir?:number){
        this.excluir = excluir;
        this.registros = registros.filter(r=>excluir==undefined||r!=this.excluir).map(x=>Number(x));
        this.intervalos = extremos.map(
            (v,i) => ({'inicio':v,'fim':extremos[i+1]})
        ).filter(z=>z.fim!=undefined);
    }

    get freqs():FreqContItem[]{
        return this.intervalos.map(intervalo=>{
            const freq = (this.registros as number[]).filter(n=>n>=intervalo.inicio && n<intervalo.fim ).length;
            const amplitude = intervalo.fim - intervalo.inicio;
            const prop = (freq/this.registros.length)*100;
            return {
                intervaloInicio:intervalo.inicio,
                intervaloFim:intervalo.fim,
                amplitude,
                pontoMedio:(intervalo.inicio + intervalo.fim)/2,
                freq,
                densidadeFreq:freq/amplitude,
                prop,
                densidadeProp:prop/amplitude
            }
        });
    }

    toDiscreta():FreqDiscr{
        return new FreqDiscr(
            this.freqs.flatMap(
                (fci,i)=>ArrayUtil.repetidos(fci.pontoMedio,fci.freq)
            ),
            this.excluir);
    }

}