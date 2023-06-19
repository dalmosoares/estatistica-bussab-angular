import { Component, OnInit } from '@angular/core';
import { Observable, onErrorResumeNext, map, combineLatest, of } from 'rxjs';
import { Tabela } from 'src/app/modelo/entidade/tabela/Tabela';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { OperacaoTipoEnum } from 'src/app/modelo/operacao/OperacaoTipoEnum';
import { OperacaoRepository } from 'src/app/repository/operacao.repository';
import { TabelaOpcRecebe, OpcRecebe } from 'src/app/repository/recebe/TabelaOpcRecebe';

@Component({
  selector: 'app-carregar-json-tabela-opc',
  templateUrl: './carregar-json-tabela-opc.component.html',
  styleUrls: ['./carregar-json-tabela-opc.component.css']
})
export class CarregarJsonTabelaOpcComponent implements OnInit {

  tabelas:Tabela[];
  tabelasOpcRecebe:TabelaOpcRecebe[]

  constructor(){
    this.gerarTabelasObs();
  }

  ngOnInit(): void {
/*     this.tabelasObs.subscribe(tabelas=>{
        this.tabelas = tabelas;
        console.log("ngOnInit",this.testar(this.tabelas));
      }
    ) */
  }

  gerarTabelasObs(){

      const tabelaArrayObs:Observable<Tabela[]> = of([
        new Tabela('tabela1',[{coluna1tabela1:0}]),
        new Tabela('tabela2',[{coluna1tabela2:0}])
      ]);

      const tabelaOpcRecebeArrayObs:Observable<TabelaOpcRecebe[]> = of([
        { 
          nomeTabela:'tabela1',
          colunas:[{
            nome:'coluna1tabela1',
            operacoes:[{
              tipo:OperacaoTipoEnum.FREQCONTINUA,
              parametros:{
                intervalos:[20,25,30,35,40,45,50]
              }
            }]
          }]
        },
        { 
          nomeTabela:'tabela2',
          colunas:[{
            nome:'coluna1tabela2',
            operacoes:[{
              tipo:OperacaoTipoEnum.FREQCONTINUA,
              parametros:{
                intervalos:[0,1,2,3,4,5,6,7,8,9]
              }
            }]
          }]
        }
      ]);

      combineLatest([tabelaArrayObs,tabelaOpcRecebeArrayObs])
      .subscribe(x => {
            this.tabelas = x[0];
            this.tabelasOpcRecebe = x[1];
            this.inserirOperacoesRecebidas();
      });      
  }

  private inserirOperacoesRecebidas(){
    this.tabelas.forEach(tabela=>{
      let tabelaOpcRecebe = this.tabelasOpcRecebe.find(tabelaOpcRecebe=>tabelaOpcRecebe.nomeTabela==tabela.nome);
      if(tabelaOpcRecebe!=undefined){
        tabelaOpcRecebe.colunas?.forEach(colunaOpcRecebe=>{
          let coluna = tabela.colunas.find(c=>c.nome==colunaOpcRecebe.nome);
          if(coluna){
            colunaOpcRecebe.operacoes.forEach(opcRecebe=>{
              let operacao = new Operacao(opcRecebe.tipo);
              operacao.parametros = opcRecebe.parametros;
              coluna.adicionaOperacao(operacao);
            });
          }
        });
      }
      console.log("inserirOperacoesRecebidas",this.testar(this.tabelas));
    });
  }

  testar(tabelas:Tabela[]):boolean{
    const tabela = tabelas.find(t=>t.nome=='tabela1');
    const coluna = tabela.colunas?.find(c=>c.nome=='coluna1tabela1');
    const opc = coluna?.operacoes?.find(opc=>opc.descricao.tipo==OperacaoTipoEnum.FREQCONTINUA);
    if(opc){
        return opc.parametros?.intervalos.includes(20);
    }else{
      return false;
    }
  }

}
