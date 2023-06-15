import { Operacao } from "src/app/modelo/operacao/Operacao";
import { ColunaTipoDadoEnum } from "./ColunaTipoDadoEnum";

export interface Coluna{
    nome: string;
    tipoDado:ColunaTipoDadoEnum;
    nomeTabela:string;
    registros:(number|string)[];
    operacoes:Operacao[];
}