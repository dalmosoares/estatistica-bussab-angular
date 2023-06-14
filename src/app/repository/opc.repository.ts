import { Injectable } from "@angular/core";
import { Opc } from "../modelo/opc/Opc";
import { OpcTipoEnum } from "../modelo/opc/OpcTipoEnum";
import { OpcTipoSaidaEnum } from "../modelo/opc/OpcTipoSaidaEnum";

@Injectable({
    providedIn:'root'
})
export class OpcRepository{

    private _lista:Opc[] = [
        {
            tipo:OpcTipoEnum.LISTA,
            tipoSaida:OpcTipoSaidaEnum.TABELA,
            padrao:true,
            nome:"lista"
        },
        {
            tipo:OpcTipoEnum.FREQDISCRETA,
            tipoSaida:OpcTipoSaidaEnum.TABELA,
            padrao:true,
            nome:"freqDiscr"
        },
        {
            tipo:OpcTipoEnum.FREQCONTINUA,
            tipoSaida:OpcTipoSaidaEnum.TABELA,
            padrao:false,
            nome:"freqCont"
        },
        {
            tipo:OpcTipoEnum.GRAFICO_BARRA,
            tipoSaida:OpcTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafBarra"
        },
        {
            tipo:OpcTipoEnum.GRAFICO_PIZZA,
            tipoSaida:OpcTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafPizza"
        },
        {
            tipo:OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL1,
            tipoSaida:OpcTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafDispUnid1"
        },
        {
            tipo:OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL2,
            tipoSaida:OpcTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafDispUnid2"
        },
        {
            tipo:OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL3,
            tipoSaida:OpcTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafDispUnid3"
        },
        {
            tipo:OpcTipoEnum.HISTOGRAMA,
            tipoSaida:OpcTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"histograma"
        },
        {
            tipo:OpcTipoEnum.RAMOSFOLHAS,
            tipoSaida:OpcTipoSaidaEnum.RAMOSFOLHAS,
            padrao:false,
            nome:"ramosfolhas"
        }
    ];

    get operacoes():Opc[]{ return this._lista; }

    get operacoesPadrao():Opc[]{ return this.operacoes.filter(opc=>opc.padrao); }

    getByTipo(tipo:OpcTipoEnum):Opc{
        // Object.create() - FUNÇÃO PURA - SEM EFEITOS COLATERAIS
        return Object.create(this.operacoes.find(e=>e.tipo==tipo));
    }

}