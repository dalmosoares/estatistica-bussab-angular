import { Entidade } from "../entidade/Entidade";

export interface Menu{
  nome: string;
  nomePai?: string;
  submenus?: Menu[];
  entidade:Entidade;
}