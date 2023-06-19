import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { EntidadeTipoEnum } from 'src/app/modelo/entidade/EntidadeTipoEnum';
import { Coluna } from 'src/app/modelo/entidade/coluna/Coluna';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { RamosFolhas } from '../ramosfolhas-modelo/RamosFolhas';
import { Ramo } from '../ramosfolhas-modelo/Ramo';
import { TabelaRepository } from 'src/app/repository/tabela.repository';
import { NumeroUtil } from 'src/app/utils/numero-util';

@Component({
  selector: 'app-ramosfolhas-lista',
  templateUrl: './ramosfolhas-lista.component.html',
  styleUrls: ['./ramosfolhas-lista.component.css']
})
export class RamosfolhasListaComponent implements OnChanges {

  @Input() public entidade:Entidade;
  @Input() public opc:Operacao;

  ramosFolhasLista:RamosFolhas[] = [];
  private digitosFolhaPadrao = 2;
  private pontoDecimal = ".";

  constructor(
    private tabelaRepository:TabelaRepository
  ) { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getRamosFolhasLista();
  }

  get entidadeTipoTabela():boolean{
    return this.entidade.tipo == EntidadeTipoEnum.TABELA;
  }

  getRamosFolhasLista(){
    this.tabelaRepository.tabelas.subscribe(tabelas=>{
      const tabela = tabelas.find(
        t => t.nome == (this.entidadeTipoTabela?this.entidade.nome:(this.entidade as Coluna).nomeTabela)
      );
      const colunas = this.entidadeTipoTabela?tabela.colunas:[(this.entidade as Coluna)];
      colunas.filter(
        coluna=>coluna.operacoes.find(opc1=>opc1.descricao.tipo==this.opc.descricao.tipo)
      ).forEach(coluna=>{
        const opc = coluna.operacoes.find(opc1=>opc1.descricao.tipo==this.opc.descricao.tipo);
        this.ramosFolhasLista.push(
          this.ramosFolhas(
            coluna,
            opc.parametros?.truncar,
            opc.parametros?.digitosFolha,
            opc.parametros?.dividirPor,
            opc.parametros?.multiplosRamos
          )
        );
      });
    });
  }

  ramosFolhas(coluna:Coluna,truncar?:boolean,digitosFolha?:number,dividirPor?:number,multiplosRamos?:number):RamosFolhas{
    const formatador = NumeroUtil.formatador(digitosFolha===undefined?this.digitosFolhaPadrao:digitosFolha);
    let registros = coluna.registros as number[];
    if(truncar){
      registros = registros.map(num=>Math.floor(num));
    }
    if(dividirPor!=undefined){
      registros = registros.map(num=>num/dividirPor);
    }

    const ramosFolhas = {
      ramos:
        registros
        .sort((x,y)=>x-y)
        .map(num => {
          const arr = formatador.format(num).split(this.pontoDecimal)
          return [{valor:arr[0],folhas:[{valor:arr[1]}]} as Ramo];
        })
        .reduce(
          (prev,curr)=>{
            const ultimo = prev[prev.length-1];
            if(prev.length==0 || (prev.length>0 && curr[0].valor!=ultimo.valor)){
              if(prev.length!=0){
                //preenche valores ausentes
                for(let i=parseInt(ultimo.valor)+1;i<=parseInt(curr[0].valor)-1;i++){
                  prev = prev.concat([{valor:i.toString(),folhas:[]}]);
                }
              }
              prev = prev.concat(curr);
            }
            else{
              ultimo.folhas = ultimo.folhas.concat(curr[0].folhas);
            }
            return prev;
          },
          []
      )
    };

    if(multiplosRamos!=undefined){
      const sinais = ['a','b','c','d','e'];
      const grupos = NumeroUtil.geraGruposContiguos(10,multiplosRamos);
      ramosFolhas.ramos = ramosFolhas.ramos.flatMap( ramo =>
        grupos.map((g,i)=>({
          valor: `${ramo.valor} ${sinais[i]}`,
          folhas:ramo.folhas.filter(
            f=>parseInt(f.valor)>=g[0] && parseInt(f.valor)<=g[1]
          )
        }))
      );
    }

    return ramosFolhas;
  }

}
