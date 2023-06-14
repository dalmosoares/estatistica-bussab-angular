
import { Parametros } from "./Parametros";
import { OpcTipoEnum } from "./OpcTipoEnum";
import { OpcTipoSaidaEnum } from "./OpcTipoSaidaEnum";

export interface Opc{
    nome:string;
    tipo:OpcTipoEnum;
    tipoSaida:OpcTipoSaidaEnum;
    parametros?:Parametros;
    padrao:boolean;
}