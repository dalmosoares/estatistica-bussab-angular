import { Component, OnInit } from '@angular/core';
import { Entidade } from 'src/app/modelo/entidade/Entidade';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(){
  }

  ngOnInit(): void {
  }

  title = 'estatistica';
  entidade:Entidade;

  public tratarMenu(entidade:Entidade){
    this.entidade = entidade;
  }

}
