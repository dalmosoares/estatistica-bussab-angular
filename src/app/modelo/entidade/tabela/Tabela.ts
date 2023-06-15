import { Operacao } from "src/app/modelo/operacao/Operacao";
import { Coluna } from "../coluna/Coluna";


export interface Tabela{
    nome:string;
    nomeColunaControle:string;
    colunas:Coluna[];
    operacoes:Operacao[];
}