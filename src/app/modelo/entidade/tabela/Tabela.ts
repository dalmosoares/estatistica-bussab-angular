import { Opc } from "src/app/modelo/opc/Opc";
import { Coluna } from "../coluna/Coluna";


export interface Tabela{
    nome:string;
    nomeColunaControle:string;
    colunas:Coluna[];
    operacoes:Opc[];
}