import { Component, Input } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';
import { Opc } from 'src/app/modelo/opc/Opc';
import { RamosFolhas } from '../ramosfolhas-modelo/RamosFolhas';


@Component({
  selector: 'app-ramosfolhas',
  templateUrl: './ramosfolhas.component.html',
  styleUrls: ['./ramosfolhas.component.css']
})
export class RamosFolhasComponent {

  @Input() public entidade:Entidade;
  @Input() public opc:Opc;
  @Input() public ramosFolhas:RamosFolhas;
  titulo:string;

}
