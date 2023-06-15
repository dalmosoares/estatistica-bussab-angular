import { Coluna } from "../entidade/coluna/Coluna";
import { OperacaoTipoEnum } from "./OperacaoTipoEnum";
import { OperacaoTipoSaidaEnum } from "./OperacaoTipoSaidaEnum";

export interface Operacao{
    nome:string;
    tipo:OperacaoTipoEnum;
    tipoSaida:OperacaoTipoSaidaEnum;
    parametros?:Parametros;
    padrao:boolean;
}

export type Parametros = {
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