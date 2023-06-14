import { OpcTipoEnum } from "src/app/modelo/opc/OpcTipoEnum";

export interface OpcRecebe{
    tipo:OpcTipoEnum;
    parametros:object;
}