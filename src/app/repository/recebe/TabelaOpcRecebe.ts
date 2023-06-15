import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";


export class TabelaOpcRecebe{
    nomeTabela:string;
    operacoesColuna:ColunaOpcRecebe[]
};

export type ColunaOpcRecebe = {
    nomeColuna:string;
    operacoes:OpcRecebe[]
};

export type OpcRecebe = {
    tipo:OperacaoTipoEnum;
    parametros:object;
};
