import { Component, Input, OnInit } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { EntidadeAcoes } from 'src/app/modelo/entidade/EntidadeAcoes';
import { EntidadeTipoEnum } from 'src/app/modelo/entidade/EntidadeTipoEnum';
import { Coluna } from 'src/app/modelo/entidade/coluna/Coluna';
import { Tabela } from 'src/app/modelo/entidade/tabela/Tabela';
import { TabelaAcoes } from 'src/app/modelo/entidade/tabela/TabelaAcoes';
import { FreqCont } from 'src/app/modelo/freq/FreqCont';
import { FreqDiscr } from 'src/app/modelo/freq/FreqDiscr';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { OperacaoTipoEnum } from 'src/app/modelo/operacao/OperacaoTipoEnum';
import { ArrayUtil } from 'src/app/utils/array-util';
import { Planilha } from '../Planilha';
import { TabelaRepository } from 'src/app/repository/tabela.repository';


@Component({
  selector: 'app-planilha-lista',
  templateUrl: './planilha-lista.component.html',
  styleUrls: ['./planilha-lista.component.css']
})
export class PlanilhaListaComponent implements OnInit {

  @Input() public entidade:Entidade;
  @Input() public opc:Operacao;
  planilhas:Planilha[];

  constructor(
    private tabelaRepository:TabelaRepository)
  {}

  ngOnInit(): void {

    if( !this.entidade || !this.opc) return;
    const entidadeAcoes = new EntidadeAcoes(this.entidade);
    
    if(this.opc.tipo==OperacaoTipoEnum.LISTA){  

      if(entidadeAcoes.tipo==EntidadeTipoEnum.TABELA){
        const tabela  = this.entidade as Tabela;
        this.planilhas = [{
            campos:tabela.colunas.map(c=>c.nome),
            linhas:ArrayUtil.range(0,entidadeAcoes.numRegistros-1).map(i=>
                tabela.colunas.flatMap(c=>c.registros[i])
            ),
            titulo:`${entidadeAcoes.tipo} ${this.entidade.nome}`
        }];
      }
      if(entidadeAcoes.tipo==EntidadeTipoEnum.COLUNA){
        const coluna = this.entidade as Coluna;
        this.tabelaRepository.findTabela(coluna.nomeTabela).subscribe(tabela=>{
          const campos = ArrayUtil.distintos([new TabelaAcoes(tabela).colunaControleNome,coluna.nome]);
          this.planilhas = [{
              campos,
              linhas:ArrayUtil.range(0,entidadeAcoes.numRegistros-1).map(i=>
                  tabela.colunas
                  .filter(c=>campos.includes(c.nome))
                  .flatMap(c=>c.registros[i])
              ),
              titulo:`${entidadeAcoes.tipo} ${this.entidade.nome}`
          }]
        });
      }

    }

    if(this.opc.tipo==OperacaoTipoEnum.FREQDISCRETA){ 

      if(entidadeAcoes.tipo==EntidadeTipoEnum.COLUNA){
        this.planilhas = [this.getFreqDiscrFromColuna(this.entidade as Coluna)]
      }
      if(entidadeAcoes.tipo==EntidadeTipoEnum.TABELA){
        const tabela = this.entidade as Tabela;
        this.planilhas = tabela.colunas
          .filter(
            c=>c.operacoes.map(opc=>opc.tipo).includes(this.opc.tipo)
            && (c.nome != tabela.nomeColunaControle || tabela.colunas.length==1)
          )
          .map(c=>this.getFreqDiscrFromColuna(c))
      }

    }

    if(this.opc.tipo==OperacaoTipoEnum.FREQCONTINUA){ 
      if(entidadeAcoes.tipo==EntidadeTipoEnum.COLUNA){
        this.planilhas = this.getFreqCont(this.entidade as Coluna);
      }
      if(entidadeAcoes.tipo==EntidadeTipoEnum.TABELA){
        const tabela = this.entidade as Tabela;
        this.planilhas = tabela.colunas
          .filter(
            c=>c.operacoes.map(opc=>opc.tipo).includes(this.opc.tipo)
            && c.nome != tabela.nomeColunaControle
          )
          .flatMap(c=>this.getFreqCont(c))
      }
    }
  }

  private somarArray(arr:number[]):number{
      return arr.reduce((i,v)=>v+i,0);
  }

  private getFreqDiscrFromColuna(coluna:Coluna):Planilha{
    const format2Dec = new Intl.NumberFormat('pt-BR',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2});
    const format4Dec = new Intl.NumberFormat('pt-BR',{style:'decimal',minimumFractionDigits:4,maximumFractionDigits:4});
    const opc = coluna.operacoes.find(op=>op.tipo==OperacaoTipoEnum.FREQDISCRETA);
    const freqArray = new FreqDiscr(coluna.registros,opc.parametros?.excluir).freqs;
    const titulo = `Freq Discreta de ${coluna.nome}`;
    const tabelaView:Planilha = {campos:["Valor","Frequência","Proporção","Porcentagem"],linhas:[],titulo};
      let freqstr:string,propStr:string,porcentStr:string;
      freqArray.forEach(f=>{
        freqstr = f.freq.toString();
        propStr = format4Dec.format(f.prop);
        porcentStr = format2Dec.format(f.porcent);
        tabelaView.linhas.push([f.valor,freqstr,propStr,porcentStr]);
      });
      freqstr = this.somarArray(freqArray.map(f=>f.freq)).toString();
      propStr = format4Dec.format(this.somarArray(freqArray.map(f=>f.prop)));
      porcentStr = format2Dec.format(this.somarArray(freqArray.map(f=>f.porcent)));
      tabelaView.linhas.push(["Total",freqstr,propStr,porcentStr]);
      return tabelaView;
  }

  private getFreqCont(coluna:Coluna):Planilha[]{  
    const tabelasView:Planilha[] = [];     
    const format2Dec = new Intl.NumberFormat('pt-BR',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2});
    const titulo = `Freq Contínua de ${coluna.nome}`; 
    const tabelaView:Planilha = {
          campos:[coluna.nome,"Amplitude","Ponto Médio","Freq","Densidade Freq","Prop","Densidade Prop"],
          linhas:[],titulo
      };
      coluna.operacoes
          .filter(opc=>opc.tipo==OperacaoTipoEnum.FREQCONTINUA)
          .forEach(opc=>{
            const fc = new FreqCont(coluna.registros as number[],opc.parametros.intervalos,opc.parametros.excluir);
              fc.freqs.forEach(fci=>{
                const inicioStr = format2Dec.format(fci.intervaloInicio);
                const fimStr = format2Dec.format(fci.intervaloFim);
                const intervaloStr = `${inicioStr} |- ${fimStr}`;
                const pontoMedioStr = format2Dec.format(fci.pontoMedio);
                const densidadeFreqStr = format2Dec.format(fci.densidadeFreq);
                const propStr = format2Dec.format(fci.prop);
                const densidadePropStr = format2Dec.format(fci.densidadeProp)
                  tabelaView.linhas.push([intervaloStr,fci.amplitude,pontoMedioStr,fci.freq,densidadeFreqStr,propStr,densidadePropStr]);
              });
              const freqTotalStr = this.somarArray(fc.freqs.map(f=>f.freq));
              const densidadeFreqTotalStr = format2Dec.format(this.somarArray(fc.freqs.map(f=>f.densidadeFreq)))
              const propTotalStr = format2Dec.format(this.somarArray(fc.freqs.map(f=>f.prop)));
              const densidadePropTotalStr = format2Dec.format(this.somarArray(fc.freqs.map(f=>f.densidadeProp)));
              tabelaView.linhas.push(["Total","","",freqTotalStr,densidadeFreqTotalStr,propTotalStr,densidadePropTotalStr]);
              tabelasView.push(tabelaView);
          });
      return tabelasView;
  }

}
