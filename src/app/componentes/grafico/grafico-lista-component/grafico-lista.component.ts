import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { Tabela } from 'src/app/modelo/entidade/tabela/Tabela';
import { Coluna } from 'src/app/modelo/entidade/coluna/Coluna';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { EntidadeAcoes } from 'src/app/modelo/entidade/EntidadeAcoes';
import { EntidadeTipoEnum } from 'src/app/modelo/entidade/EntidadeTipoEnum';
import { Grafico } from '../grafico-modelo/Grafico';
import { TabelaRepository } from 'src/app/repository/tabela.repository';


@Component({
  selector: 'app-grafico-lista',
  templateUrl: './grafico-lista.component.html',
  styleUrls: ['./grafico-lista.component.css']
})
export class GraficoListaComponent implements OnInit{

  @Input() public entidade:Entidade;
  @Input() public opc:Operacao;
  
  public graficos:Grafico[];

  constructor(
    private tabelaRepository:TabelaRepository
  ) { 
    console.log("GraficoListaComponent");
  }

  ngOnInit(): void {
    this.tabelaRepository.tabelas.subscribe(
      tabelas=>{
        if(tabelas){
          const lista:Grafico[]= [];
          const tipoTabela = new EntidadeAcoes(this.entidade).tipo==EntidadeTipoEnum.TABELA;
          const tabela = tabelas.find(
            t => t.nome == (tipoTabela?this.entidade.nome:(this.entidade as Coluna).nomeTabela)
          );
          const colunas = tipoTabela?tabela.colunas:[this.entidade as Coluna];
          colunas.filter(
            coluna=>coluna.operacoes.find(opc1=>opc1.tipo==this.opc.tipo)
          ).forEach(coluna=>{
            lista.push({'titulo':`${this.opc.tipo} coluna ${coluna.nome}`,coluna,tipo:this.opc.tipo});
          });
          this.graficos = lista;
        }

      }
    );
  }

}
