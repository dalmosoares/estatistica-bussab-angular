import { OperacaoRepository } from "src/app/repository/operacao.repository";
import { Coluna } from "../entidade/coluna/Coluna";
import { OperacaoTipoEnum } from "./OperacaoTipoEnum";
import { OperacaoTipoSaidaEnum } from "./OperacaoTipoSaidaEnum";

export class Operacao{
    descricao:OperacaoDescricao;
    parametros?:OperacaoParametros;

    constructor(tipo:OperacaoTipoEnum){
        this.descricao = OperacaoRepository.operacaoDescricaoPorTipo(tipo);
    }
}

export type OperacaoDescricao = {
    nome:string;
    tipo:OperacaoTipoEnum;
    tipoSaida:OperacaoTipoSaidaEnum;
    padrao:boolean;
}

export type OperacaoParametros = {
    intervalos?:number[];
    excluir?:any;
    marcarAusentes?:boolean;
    xCoordDiv?:number;
    xCoordMarca?:number;
    yCoordDiv?:number;
    yCoordMarca?:number;
    discreta?:boolean;
    continua?:boolean;
    truncar?:boolean;
    digitosFolha?:number;
    dividirPor?:number;
    multiplosRamos?:number;
    areaNaoUnitaria?:boolean;
    dependeDe?:string;
    // DependeDeColunas não entra como parâmetro através de arquivo json de operações
    // Ele é criado com base nos parâmetros dependeDe que tem os nomes das colunas 
    dependeDeColuna?:Coluna; 
}