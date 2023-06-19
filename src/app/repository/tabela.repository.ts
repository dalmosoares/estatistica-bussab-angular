import { Injectable } from "@angular/core";
import { Operacao } from "../modelo/operacao/Operacao";
import { OperacaoRepository } from "./operacao.repository";
import { HttpClient } from "@angular/common/http";
import { Observable, combineLatest, map, onErrorResumeNext } from 'rxjs';
import { Tabela } from "../modelo/entidade/tabela/Tabela";
import { Coluna } from "../modelo/entidade/coluna/Coluna";
import { TabelaOpcRecebe } from "./recebe/TabelaOpcRecebe";
import { OpcRecebe } from "./recebe/TabelaOpcRecebe";
import { OperacaoTipoEnum } from "../modelo/operacao/OperacaoTipoEnum";
import { RxjsUtil } from "../utils/rxjs-util";

type TabelaCarregar = {
    "nome":string
};

@Injectable({
    providedIn:'root'
})
export class TabelaRepository{

    private tabelasCarregar:TabelaCarregar[] = [
        {nome:'compania-mb'},
        {nome:'cd01-brasil'},
        {nome:'cd02-populacoes-municipios-brasil'},
        {nome:'cd03-notas'},
        {nome:'cd04-saopaulo-poluicao-temperatura'},
        {nome:'exemplo2-9-dureza'},
        {nome:'exe-2-4-erros-impressao'},
        {nome:'exe-2-6-taxa-media-incremento-anual'}
    ];

    constructor(
        private http: HttpClient
    ){}

    get tabelas():Observable<Tabela[]>{

        const tabelaObs = onErrorResumeNext(this.tabelasCarregar.map(tc=>    
            this.http.get(`assets/json/tabelas/${tc.nome}.json`).pipe(
                map(json=>new Tabela(`${tc.nome}`,json as any[]))
            )   
        ));

        const tabelaOpcRecebeObs = onErrorResumeNext(this.tabelasCarregar.map(tc=>    
            this.http.get(`assets/json/operacoes/operacoes-${tc.nome}.json`).pipe(
                map(json=>json as TabelaOpcRecebe)
            )   
        ));

        const tabelaArrayObs = RxjsUtil.gerarArray(tabelaObs);
        const tabelaOpcRecebeArrayObs = RxjsUtil.gerarArray(tabelaOpcRecebeObs);

        return combineLatest([tabelaArrayObs,tabelaOpcRecebeArrayObs])
        .pipe(map(
            x => this.inserirOperacoesRecebidas(x[0],x[1])        
        ));
        
    }

    private inserirOperacoesRecebidas(tabelas:Tabela[],tabelasOpcRecebe:TabelaOpcRecebe[]):Tabela[]{
        return this.inserirOperacoesRecebidasTabelas(this.inserirOperacoesPadrao(tabelas),tabelasOpcRecebe);
    }

    private inserirOperacoesPadrao(tabelas:Tabela[]):Tabela[]{
        return tabelas.map(tabela=>{            
            OperacaoRepository.operacoesDescricaoPadrao().forEach(od=>{
                tabela.addOperacao(new Operacao(od.tipo));
                tabela.colunas.forEach(c=>c.adicionaOperacao(new Operacao(od.tipo)));
            });
            return tabela;
        });
    }

    private inserirOperacoesRecebidasTabelas(tabelas:Tabela[],tabelasOpcRecebe:TabelaOpcRecebe[]):Tabela[]{
        return tabelas.map(tabela=>{
            const c = tabelas.find(t=>t.nome=='compania-mb').colunas.find(c=>c.nome=='salarioPorSalMin');
            const opc = c.operacoes?.find(opc=>opc.descricao.tipo==OperacaoTipoEnum.FREQCONTINUA);
            let tabelaOpcRecebe = tabelasOpcRecebe.find(tabelaOpcRecebe=>tabelaOpcRecebe.nomeTabela==tabela.nome);
            if(tabelaOpcRecebe!=undefined){
                this.inserirOperacoesRecebidasTabela(tabela,tabelaOpcRecebe);
            }
            return tabela;
        });
    }   

    private inserirOperacoesRecebidasTabela(tabela:Tabela,tabelaOpcRecebe:TabelaOpcRecebe){
        if(tabelaOpcRecebe.nomeTabela!=tabela.nome) return;
        tabelaOpcRecebe.colunas?.forEach(colunaOpcRecebe=>
            tabela.addOperacoesColuna(
                colunaOpcRecebe.nome,
                colunaOpcRecebe.operacoes.map(opcRecebe=>
                    this.opcRecebeParaOpc(opcRecebe,tabela)
                )
            )
        );
        // Operações em tabela decorrentes de operações recebidas em colunas
        if(tabela.colunas.find(c=>c.operacoes.find(opc=>opc.descricao.tipo==OperacaoTipoEnum.FREQCONTINUA))){
            tabela.addOperacao(new Operacao(OperacaoTipoEnum.FREQCONTINUA));
        }
    }

    private opcRecebeParaOpc(opcRecebe:OpcRecebe,tabela:Tabela):Operacao{
        const opc = new Operacao(opcRecebe.tipo);
        if(opc===undefined){
            throw Error(`sem operação do tipo ${opcRecebe.tipo}`);
        }
        opc.parametros = opcRecebe.parametros;
        if(opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_LIGADO && opc.parametros?.dependeDe!=undefined){
            opc.parametros.dependeDeColuna = tabela.colunas.find(c=>c.nome==opc.parametros.dependeDe)
        }
        return opc;
    }

    public findTabela(nome:string):Observable<Tabela>{
        return this.tabelas.pipe(map(tabelas=>tabelas.find(t=>t.nome==nome)));
    }

    public findColuna(nomeTabela:string,nomeColuna:string):Observable<Coluna>{
        return this.findTabela(nomeTabela).pipe(
            map(t=>t.colunas.find(c=>c.nome==nomeColuna))
        );
    }


}