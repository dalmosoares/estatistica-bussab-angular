import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";


export class TabelaOpcRecebe{
    nomeTabela:string;
    operacoes?:OpcRecebe[];
    colunas?:ColunaOpcRecebe[]
};

export type ColunaOpcRecebe = {
    nome:string;
    operacoes:OpcRecebe[]
};

export type OpcRecebe = {
    tipo:OperacaoTipoEnum;
    parametros:object;
};
