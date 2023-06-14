import { Component, OnInit } from '@angular/core';
import { Tabela } from 'src/app/modelo/entidade/tabela/Tabela';
import { TabelaRepository } from 'src/app/repository/tabela.repository';

@Component({
  selector: 'app-carregar-json-tabela-opc',
  templateUrl: './carregar-json-tabela-opc.component.html',
  styleUrls: ['./carregar-json-tabela-opc.component.css']
})
export class CarregarJsonTabelaOpcComponent implements OnInit {

  tabelas:Tabela[];

  constructor(private tabelaRepository:TabelaRepository) { }

  ngOnInit(): void {
    this.tabelaRepository.tabelas.subscribe(tabelas=>{
      this.tabelas=tabelas;
      const nomeTabela = 'compania-mb';
      const nomeColuna = 'salarioPorSalMin';
      const tabela = this.tabelas.find(t=>t.nome==nomeTabela);
      const coluna = tabela.colunas.find(c=>c.nome==nomeColuna);
      console.log(coluna.operacoes);
    });
  }

}
