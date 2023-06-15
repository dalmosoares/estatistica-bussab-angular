import { Injectable } from "@angular/core";
import { Operacao } from "../modelo/operacao/Operacao";
import { OperacaoTipoEnum } from "../modelo/operacao/OperacaoTipoEnum";
import { OperacaoTipoSaidaEnum } from "../modelo/operacao/OperacaoTipoSaidaEnum";

@Injectable({
    providedIn:'root'
})
export class OperacaoRepository{

    private operacoes:Operacao[] = [
        {
            tipo:OperacaoTipoEnum.LISTA,
            tipoSaida:OperacaoTipoSaidaEnum.TABELA,
            padrao:true,
            nome:"lista"
        },
        {
            tipo:OperacaoTipoEnum.FREQDISCRETA,
            tipoSaida:OperacaoTipoSaidaEnum.TABELA,
            padrao:true,
            nome:"freqDiscr"
        },
        {
            tipo:OperacaoTipoEnum.FREQCONTINUA,
            tipoSaida:OperacaoTipoSaidaEnum.TABELA,
            padrao:false,
            nome:"freqCont"
        },
        {
            tipo:OperacaoTipoEnum.GRAFICO_BARRA,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafBarra"
        },
        {
            tipo:OperacaoTipoEnum.GRAFICO_PIZZA,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafPizza"
        },
        {
            tipo:OperacaoTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL1,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafDispUnid1"
        },
        {
            tipo:OperacaoTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL2,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafDispUnid2"
        },
        {
            tipo:OperacaoTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL3,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafDispUnid3"
        },
        {
            tipo:OperacaoTipoEnum.HISTOGRAMA,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"histograma"
        },
        {
            tipo:OperacaoTipoEnum.RAMOSFOLHAS,
            tipoSaida:OperacaoTipoSaidaEnum.RAMOSFOLHAS,
            padrao:false,
            nome:"ramosfolhas"
        },
        {
            tipo:OperacaoTipoEnum.GRAFICO_LIGADO,
            tipoSaida:OperacaoTipoSaidaEnum.GRAFICO,
            padrao:false,
            nome:"grafLigado"
        }
    ];

    get operacoesPadrao():Operacao[]{ return this.operacoes.filter(opc=>opc.padrao); }

    getByTipo(tipo:OperacaoTipoEnum):Operacao{
        // Object.create() - FUNÇÃO PURA - SEM EFEITOS COLATERAIS
        return Object.assign(this.operacoes.find(e=>e.tipo==tipo),{});
    }

}