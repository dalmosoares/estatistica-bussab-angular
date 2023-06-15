import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Menu } from 'src/app/modelo/menu/Menu';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { EntidadeAcoes } from 'src/app/modelo/entidade/EntidadeAcoes';
import { TabelaRepository } from 'src/app/repository/tabela.repository';
import { environment } from 'src/environments/environment';

type MenuMat = {
  nome: string;
  nomePai: string | undefined;
  expansivel: boolean;
  nivel: number;
  entidade:Entidade;
};

type MenuApp = {
  nome: string;
  nomePai: string | undefined;
  expansivel: boolean;
  nivel: number;
  entidade:Entidade;
};

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  private _transformer:((node: Menu, nivel: number) => MenuMat);
  treeControl: FlatTreeControl<MenuApp>;
  private treeFlattener: MatTreeFlattener<Menu,MenuMat,MenuMat>
  dataSource:MatTreeFlatDataSource<Menu,MenuMat,MenuMat>;
  hasChild:((_: number, node: MenuApp) => boolean);

  @Output() public menuAcionadoEvt = new EventEmitter<Entidade>();
  padding = 20;
  activeNode:any;

  constructor(private tabelaRepository:TabelaRepository) {
      this.iniciarMenu();
  }

  ngOnInit(): void {
    this.tabelaRepository.tabelas.subscribe(tabelas=>{
      this.dataSource.data = tabelas.map(t=>new EntidadeAcoes(t).toMenu());
      this.ativarPadrao();
    });
  }

  iniciarMenu(){
     this._transformer = (node: Menu, nivel: number) => {
      return {
        nome: node.nome,
        nomePai: node.nomePai,
        expansivel: !!node.submenus && node.submenus.length > 0,
        nivel: nivel,
        entidade:node.entidade
      };
    };
  
    this.treeControl = new FlatTreeControl<MenuApp>(
      node => node.nivel,
      node => node.expansivel
    );

    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.nivel,
      node => node.expansivel,
      node => node.submenus
    );

    this.hasChild = (_: number, node: MenuApp) => node.expansivel;
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ativarPadrao(){
    const noPadraoPai = this.treeControl.dataNodes.find(data=>data.nomePai==undefined && data.nome==environment.menu_padrao.pai);
    const noPadraoFilho = this.treeControl.dataNodes.find(data=>data.nomePai==environment.menu_padrao.pai && data.nome==environment.menu_padrao.filho);
    this.treeControl.expand(noPadraoPai); 
    if(noPadraoFilho!=undefined){
      this.ativar(noPadraoFilho);
    }else if(noPadraoPai!=undefined){
      this.ativar(noPadraoPai);
    }
  }

  ativar(node:Menu){
    this.menuAcionadoEvt.emit(node.entidade);
    this.activeNode = node;
  } 

}
