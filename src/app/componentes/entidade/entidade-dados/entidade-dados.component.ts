import { Component, Input, OnInit } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';

@Component({
  selector: 'app-entidade-dados',
  templateUrl: './entidade-dados.component.html',
  styleUrls: ['./entidade-dados.component.css']
})
export class EntidadeDadosComponent implements OnInit {

  @Input() 
  public entidade:Entidade;

  constructor() { }

  ngOnInit(): void {
  }

}
