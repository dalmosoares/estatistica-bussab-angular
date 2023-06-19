import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './componentes/menu-component/menu.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { GuiaListaComponent } from './componentes/guia-lista-component/guia-lista.component';
import { RamosFolhasComponent } from './componentes/ramosfolhas/ramosfolhas-component/ramosfolhas.component';
import { RamosfolhasListaComponent } from './componentes/ramosfolhas/ramosfolhas-lista-component/ramosfolhas-lista.component';
import { HomeComponent } from './componentes/home-component/home.component';
import { CarregarJsonTabelaOpcComponent } from './teste/componentes/carregar-json-tabela-opc/carregar-json-tabela-opc.component';
import { PlanilhaComponent } from './componentes/planilha/planilha-component/planilha.component';
import { PlanilhaListaComponent } from './componentes/planilha/planilha-lista-component/planilha-lista.component';
import { GraficoListaComponent } from './componentes/grafico/grafico-lista-component/grafico-lista.component';
import { GraficoComponent } from './componentes/grafico/grafico-component/grafico.component';
import { EntidadeDadosComponent } from './componentes/entidade/entidade-dados/entidade-dados.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    GuiaListaComponent,
    PlanilhaComponent,
    PlanilhaListaComponent,
    GraficoListaComponent,
    GraficoComponent,
    RamosFolhasComponent,
    RamosfolhasListaComponent,
    HomeComponent,
    CarregarJsonTabelaOpcComponent,
    EntidadeDadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatTreeModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
