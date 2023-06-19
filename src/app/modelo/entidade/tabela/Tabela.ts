import { Coluna } from "../coluna/Coluna";
import { Operacao } from "src/app/modelo/operacao/Operacao";
import { Menu } from "src/app/modelo/menu/Menu";
import { environment } from "src/environments/environment";
import { EntidadeTipoEnum } from "../EntidadeTipoEnum";
import { Entidade } from "../Entidade";

export class Tabela implements Entidade{

    tipo = EntidadeTipoEnum.TABELA;
    nome:string;
    operacoes:Operacao[] = [];
    colunas:Coluna[];

    constructor(nome:string,registros:any[]){
        this.nome = nome;
        const regs = this.adicionarColunaId(registros,environment.linha_referencia_indice);
        let campos = Object.keys(regs[environment.linha_referencia_indice]);
        this.colunas = campos.map(
            nomeCampo => new Coluna(nomeCampo,nome,regs.map(x=>x[nomeCampo]))
        );
    }

    get numRegistros(): number {
        return this.colunas.find(c=>c.nome==environment.coluna_id_nome).numRegistros;
    }
    
    private adicionarColunaId(registros:any[],indice_linha_referencia:number):any[]{
        let campos = Object.keys(registros[indice_linha_referencia]);
        return !campos.includes(environment.coluna_id_nome) ?
            registros.map(
                (registro,i) => Object.assign({[environment.coluna_id_nome]:i+1},registro)
            ):registros;
    }

    addOperacao(operacao:Operacao){
        this.operacoes.push(operacao);
    }

    addOperacaoColuna(nome:string,operacao:Operacao){
        this.colunas.find(c=>c.nome==nome)?.adicionaOperacao(operacao);
    }

    addOperacoesColuna(nome:string,operacoes:Operacao[]){
        operacoes.forEach(opc=>this.addOperacaoColuna(nome,opc));
    }

    toMenu():Menu{
        return {
            nome:this.nome,
            submenus: this.colunas.map(c=>
                ({nome:c.nome,nomePai:this.nome,entidade:c})
            ),
            entidade:this
        };
    }
}