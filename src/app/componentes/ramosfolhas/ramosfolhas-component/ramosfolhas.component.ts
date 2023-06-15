import { Component, Input } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { RamosFolhas } from '../ramosfolhas-modelo/RamosFolhas';


@Component({
  selector: 'app-ramosfolhas',
  templateUrl: './ramosfolhas.component.html',
  styleUrls: ['./ramosfolhas.component.css']
})
export class RamosFolhasComponent {

  @Input() public entidade:Entidade;
  @Input() public opc:Operacao;
  @Input() public ramosFolhas:RamosFolhas;
  titulo:string;

}
