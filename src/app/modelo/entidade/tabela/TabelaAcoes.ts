import { Tabela } from "./Tabela";
import { ColunaTipoDadoEnum } from "../coluna/ColunaTipoDadoEnum";
import { Coluna } from "../coluna/Coluna";
import { Operacao } from "src/app/modelo/operacao/Operacao";
import { Menu } from "src/app/modelo/menu/Menu";
import { environment } from "src/environments/environment";

export class TabelaAcoes{

    public static criar(nome:string,registros:any[]):Tabela{

        const LINHA_REFERENCIA_INDICE = 0;
        const COLUNA_CONTROLE_INDICE = 0;
        const linhaReferencia = registros[LINHA_REFERENCIA_INDICE];
        const regs = this.adicionarColunaId(registros,LINHA_REFERENCIA_INDICE,environment.coluna_id_nome);
        let campos = Object.keys(regs[LINHA_REFERENCIA_INDICE]);
        let nomeColunaControle = campos[COLUNA_CONTROLE_INDICE];

        return {
            nome,
            nomeColunaControle,
            colunas:campos.map(
                nomeCampo => ({
                    nome:nomeCampo,
                    tipoDado:isNaN(linhaReferencia[nomeCampo])?ColunaTipoDadoEnum.TEXTO:ColunaTipoDadoEnum.NUMERO,
                    nomeTabela:nome,
                    registros:regs.map(x=>x[nomeCampo]),
                    operacoes:[]
                })    
            ),
            operacoes:[]
        };
    }
    
    tabela:Tabela;
    colunaControleNome:string;
    private COLUNA_CONTROLE_INDICE = 0;
    private numRegistros:number;

    constructor(tabela:Tabela){
        this.tabela = tabela;
        this.numRegistros = this.tabela.colunas[this.COLUNA_CONTROLE_INDICE].registros.length;
        this.colunaControleNome = this.tabela.colunas[this.COLUNA_CONTROLE_INDICE].nome;
    }
    
    private static adicionarColunaId(registros:any[],indice_linha_referencia:number,colunaIdNome:string):any[]{
        let campos = Object.keys(registros[indice_linha_referencia]);
        return (campos.length==1 || !campos.includes(colunaIdNome)) ?
            registros.map(
                (registro,i) => Object.assign({[colunaIdNome]:i+1},registro)
            ):registros;
    }

    addOperacao(operacao:Operacao){
        if(!this.tabela.operacoes.find(op=>op.tipo==operacao.tipo)){
            this.tabela.operacoes.push(operacao);
        }
    }

    addOperacaoColuna(coluna:Coluna,operacao:Operacao){
        if(coluna==undefined||operacao==undefined){
            throw Error("addOperacaoColuna com coluna ou operacao undefined");
        }
        let c = this.tabela.colunas.find(c1=>c1.nome==coluna.nome);
        const iOpc = c.operacoes.findIndex(op=>op.tipo==operacao.tipo);
        if(iOpc!=-1 && operacao.parametros!=undefined){
            c.operacoes[iOpc]=operacao;
        }else{
            c.operacoes.push(operacao);
        }
    }

    toMenu():Menu{
        const menu:Menu = {nome:this.tabela.nome,nomePai:undefined,submenus:[],entidade:this.tabela};
        this.tabela.colunas.forEach(c=>{
            menu.submenus.push({nome:c.nome,nomePai:c.nomeTabela,entidade:c})
        });
        return menu;
    }
}