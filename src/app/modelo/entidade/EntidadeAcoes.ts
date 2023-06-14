import { Menu } from "../menu/Menu";
import { Entidade } from "./Entidade";
import { EntidadeTipoEnum } from "./EntidadeTipoEnum";
import { Coluna } from "./coluna/Coluna";
import { Tabela } from "./tabela/Tabela";

export class EntidadeAcoes{

  private COLUNA_CONTROLE_INDICE = 0;
  entidade:Entidade;

  constructor(entidade:Entidade){
    this.entidade = entidade;
  }

  get tipo(): EntidadeTipoEnum{
    return Object.prototype.hasOwnProperty.call(this.entidade, "colunas")?EntidadeTipoEnum.TABELA:EntidadeTipoEnum.COLUNA;
  }

  get numRegistros(){
    return (this.tipo==EntidadeTipoEnum.TABELA ? 
      (this.entidade as Tabela).colunas[this.COLUNA_CONTROLE_INDICE] :
      (this.entidade as Coluna)).registros.length;
  }

  toMenu():Menu{
    if(this.tipo==EntidadeTipoEnum.TABELA){
      return {
        nome:this.entidade.nome,
        submenus: (this.entidade as Tabela).colunas.map(c=>
            ({nome:c.nome,nomePai:this.entidade.nome,entidade:c})
        ),
        entidade:this.entidade
      };
    }
    else{
      return {
        nome:this.entidade.nome,
        nomePai:(this.entidade as Coluna).nomeTabela,
        entidade:this.entidade
      };
    }
  }

}