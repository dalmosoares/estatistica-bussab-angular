import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";
import { OpcTipoEnum } from "src/app/modelo/opc/OpcTipoEnum";


export interface Grafico{
    titulo:string;
    coluna:Coluna;
    tipo:OpcTipoEnum;
    excluir?:any;
}