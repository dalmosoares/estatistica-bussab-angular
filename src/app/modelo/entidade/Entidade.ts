import { Menu } from "../menu/Menu";
import { Operacao } from "../operacao/Operacao";
import { EntidadeTipoEnum } from "./EntidadeTipoEnum";

export interface Entidade{
  tipo: EntidadeTipoEnum;
  nome:string;
  operacoes:Operacao[];
  numRegistros:number;
  toMenu():Menu;
}