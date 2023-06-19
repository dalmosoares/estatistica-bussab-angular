import { environment } from "src/environments/environment";
import { Menu } from "../../menu/Menu";
import { Entidade } from "../Entidade";
import { EntidadeTipoEnum } from "../EntidadeTipoEnum";
import { ColunaTipoDadoEnum } from "./ColunaTipoDadoEnum";
import { Operacao } from "../../operacao/Operacao";

export class Coluna implements Entidade{
    tipo = EntidadeTipoEnum.COLUNA;
    nome:string;
    nomeTabela:string;
    registros:any[];
    private _operacoes:Operacao[] = [];

    constructor(nome:string,nomeTabela:string,registros:any){
        this.nome = nome;
        this.nomeTabela = nomeTabela;
        this.registros = registros;
    }

    get numRegistros(): number {
        return this.registros.length;
    }

    get operacoes():Operacao[]{
        return Object.assign(this._operacoes);
    }

    adicionaOperacao(operacao:Operacao){
        if(!this._operacoes.find(opc=>opc.descricao.tipo==operacao.descricao.tipo)){
            this._operacoes.push(operacao);
        }
    }

    toMenu(): Menu {
        return {
            nome:this.nome,
            nomePai:this.nomeTabela,
            entidade:this
        };
    }

    get tipoDado():ColunaTipoDadoEnum{
        return isNaN(environment.linha_referencia_indice)?ColunaTipoDadoEnum.TEXTO:ColunaTipoDadoEnum.NUMERO;
    }
}