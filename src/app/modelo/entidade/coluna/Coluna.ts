import { Opc } from "src/app/modelo/opc/Opc";
import { ColunaTipoDadoEnum } from "./ColunaTipoDadoEnum";

export interface Coluna{
    nome: string;
    tipoDado:ColunaTipoDadoEnum;
    nomeTabela:string;
    registros:(number|string)[];
    operacoes:Opc[];
}