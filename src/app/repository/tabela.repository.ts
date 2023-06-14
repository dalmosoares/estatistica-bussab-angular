import { Injectable } from "@angular/core";
import { Opc } from "../modelo/opc/Opc";
import { OpcRepository } from "./opc.repository";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, concatMap, find, map, mergeMap, of, onErrorResumeNext } from 'rxjs';
import { Tabela } from "../modelo/entidade/tabela/Tabela";
import { TabelaAcoes } from "../modelo/entidade/tabela/TabelaAcoes";
import { Coluna } from "../modelo/entidade/coluna/Coluna";
import { TabelaOpcRecebe } from "./recebe/TabelaOpcRecebe";
import { OpcRecebe } from "./recebe/OpcRecebe";
import { OpcTipoEnum } from "../modelo/opc/OpcTipoEnum";
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
        {nome:'exemplo2-9-dureza'},
        {nome:'exe-2-4-erros-impressao'},
        {nome:'exe-2-6-taxa-media-incremento-anual'}
    ];

    private _tabelas:Observable<Tabela[]>;

    constructor(
        private opcRepository:OpcRepository,
        private http: HttpClient
    ){}

    get tabelas():Observable<Tabela[]>{

        const tabelaArrayObs = RxjsUtil.converter(this.tabelasCarregar.map(tc=>
            onErrorResumeNext(
                this.http.get(`assets/json/tabelas/${tc.nome}.json`).pipe(
                    map(json=>TabelaAcoes.criar(`${tc.nome}`,json as any[]))
                ))
            )
        );

        const tabelaOpcRecebeArrayObs = RxjsUtil.converter(this.tabelasCarregar.map(tc=>
            this.http.get(`assets/json/operacoes/operacoes-${tc.nome}.json`).pipe(
                map(json=>json as TabelaOpcRecebe),
                catchError(err=>of({nomeTabela:tc.nome,operacoesColuna:[]}))
            ))
        );

        return tabelaOpcRecebeArrayObs.pipe(mergeMap(tabelaOpcRecebeArray=>
            tabelaArrayObs.pipe(map(tabelaArray=>
                tabelaArray.map(
                    tabela => {
                        const operacoes = tabelaOpcRecebeArray.find(tabelaOpcRecebe=>tabelaOpcRecebe.nomeTabela==tabela.nome);
                        if(operacoes!=undefined){
                            this.inserirOperacoes(tabela,operacoes);
                        }
                        return tabela;
                   }
                )                
            ))
        ));
        
    }

    private inserirOperacoes(tabela:Tabela,tabelaOpcRecebe:TabelaOpcRecebe){
        const tabelaAcoes = new TabelaAcoes(tabela);
        // Operações padrão em tabelas e colunas
        this.opcRepository.operacoesPadrao.forEach(opc=>{
            tabelaAcoes.addOperacao(opc);
            tabelaAcoes.tabela.colunas.forEach(c=>tabelaAcoes.addOperacaoColuna(c,opc));
        });
        // Operações recebidas de colunas
        tabelaOpcRecebe.operacoesColuna.forEach(colunaOpcRecebe=>{
            const coluna = tabela.colunas.find(c=>c.nome==colunaOpcRecebe.nomeColuna);
            if(coluna!=undefined){
                colunaOpcRecebe.operacoes.forEach(opcRecebe=>{
                    tabelaAcoes.addOperacaoColuna(coluna,this.opcRecebeParaOpc(opcRecebe));
                });
            }
        });
        // Operações em tabela decorrentes de operações recebidas em colunas
        if(tabelaAcoes.tabela.colunas.find(c=>c.operacoes.find(opc=>opc.tipo==OpcTipoEnum.FREQCONTINUA))){
            tabelaAcoes.addOperacao(this.opcRepository.getByTipo(OpcTipoEnum.FREQCONTINUA));
        }
    }

    private opcRecebeParaOpc(opcRecebe:OpcRecebe):Opc{
        const opc = this.opcRepository.getByTipo(opcRecebe.tipo);
        if(opc===undefined){
            throw Error(`sem operação do tipo ${opcRecebe.tipo}`);
        }
        opc.tipo = opcRecebe.tipo;
        opc.parametros = opcRecebe.parametros;
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