import { Component, Input } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { Opc } from 'src/app/modelo/opc/Opc';
import { Planilha } from '../Planilha';


@Component({
  selector: 'app-planilha',
  templateUrl: './planilha.component.html',
  styleUrls: ['./planilha.component.css']
})
export class PlanilhaComponent {

  @Input() public entidade:Entidade;
  @Input() public opc:Opc;
  @Input() public planilha:Planilha;

}
