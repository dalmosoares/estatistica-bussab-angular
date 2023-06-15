import { Component, Input } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { Planilha } from '../Planilha';


@Component({
  selector: 'app-planilha',
  templateUrl: './planilha.component.html',
  styleUrls: ['./planilha.component.css']
})
export class PlanilhaComponent {

  @Input() public entidade:Entidade;
  @Input() public opc:Operacao;
  @Input() public planilha:Planilha;

}
