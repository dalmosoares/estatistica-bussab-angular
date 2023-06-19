import { Operacao, OperacaoDescricao } from "../modelo/operacao/Operacao";
import { OperacaoTipoEnum } from "../modelo/operacao/OperacaoTipoEnum";
import { OperacaoTipoSaidaEnum } from "../modelo/operacao/OperacaoTipoSaidaEnum";

export class OperacaoRepository{

    public static operacoesDescricao:OperacaoDescricao[] = [
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

    public static operacaoDescricaoPorTipo(tipo:OperacaoTipoEnum):OperacaoDescricao{
        return this.operacoesDescricao.find(od=>od.tipo===tipo);
    }

    public static operacoesDescricaoPadrao():OperacaoDescricao[]{
        return this.operacoesDescricao.filter(od=>od.padrao===true);
    }

}