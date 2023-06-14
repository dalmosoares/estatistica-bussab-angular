import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { Tabela } from 'src/app/modelo/entidade/tabela/Tabela';
import { Coluna } from 'src/app/modelo/entidade/coluna/Coluna';
import { Opc } from 'src/app/modelo/opc/Opc';
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
  @Input() public opc:Opc;
  
  private tabelas:Tabela[];
  private tabela:Tabela;
  private colunas:Coluna[];

  constructor(
    private tabelaRepository:TabelaRepository
  ) { 

  }
  ngOnInit(): void {
    this.tabelaRepository.tabelas.subscribe(
      tabelas=>this.tabelas=tabelas
    );
  }

  get graficoLista():Grafico[]{
    if(!this.tabelas) return;
    const lista:Grafico[]= [];
    const tipoTabela = new EntidadeAcoes(this.entidade).tipo==EntidadeTipoEnum.TABELA;
    this.tabela = this.tabelas.find(
      t => t.nome == (tipoTabela?this.entidade.nome:(this.entidade as Coluna).nomeTabela)
    );
    this.colunas = tipoTabela?this.tabela.colunas:[this.entidade as Coluna];
    this.colunas.filter(
      coluna=>coluna.operacoes.find(opc1=>opc1.tipo==this.opc.tipo)
    ).forEach(coluna=>{
      lista.push({'titulo':`${this.opc.tipo} coluna ${coluna.nome}`,coluna,tipo:this.opc.tipo});
    });
    return lista;
  }

}
