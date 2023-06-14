import { Component, DoCheck, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { EntidadeAcoes } from 'src/app/modelo/entidade/EntidadeAcoes';
import { EntidadeTipoEnum } from 'src/app/modelo/entidade/EntidadeTipoEnum';
import { Opc } from 'src/app/modelo/opc/Opc';
import { OpcTipoSaidaEnum } from 'src/app/modelo/opc/OpcTipoSaidaEnum';
import { environment } from 'src/environments/environment';

type Tab = {
  'opc':Opc,
  'indice':number,
  'label':string
};

@Component({
  selector: 'app-guia-lista',
  templateUrl: './guia-lista.component.html',
  styleUrls: ['./guia-lista.component.css']
})
export class GuiaListaComponent implements OnChanges,DoCheck {

  @Input() 
  public entidade:Entidade;

  @ViewChild(MatTabGroup) 
  public tabGroup: MatTabGroup;

  public tabs:Tab[];

  public saidaTabela = OpcTipoSaidaEnum.TABELA;
  public saidaGrafico = OpcTipoSaidaEnum.GRAFICO;
  public saidaRamosfolhas = OpcTipoSaidaEnum.RAMOSFOLHAS;
  public entidadeTipo: EntidadeTipoEnum;
  private inicio = true;

  ngDoCheck() {
    if(this.tabGroup!=undefined && this.inicio){
      this.tabGroup.selectedIndex = environment.guias_indice_padrao;
      this.inicio = false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.entidade!=undefined){
      this.entidadeTipo = new EntidadeAcoes(this.entidade).tipo;
      this.tabs = this.entidade.operacoes.map((opc,idx) => ({
        'opc':opc,
        'indice':idx,
        'label':`${opc.nome}`
      }));
    }
  }

}
