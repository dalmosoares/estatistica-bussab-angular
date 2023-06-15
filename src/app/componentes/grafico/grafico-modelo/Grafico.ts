import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";
import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";


export interface Grafico{
    titulo:string;
    coluna:Coluna;
    tipo:OperacaoTipoEnum;
    excluir?:any;
}