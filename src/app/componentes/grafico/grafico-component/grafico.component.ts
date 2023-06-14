import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Opc } from 'src/app/modelo/opc/Opc';
import { OpcTipoEnum } from 'src/app/modelo/opc/OpcTipoEnum';
import { GraficoBarraService } from '../grafico-service/grafico-barra.service';
import { DispersaoUnidimensionalService } from '../grafico-service/grafico-dispersao-unidimensional.service';
import { GraficoHistogramaService } from '../grafico-service/grafico-histograma.service';
import { GraficoPizzaService } from '../grafico-service/grafico-pizza.service';
import { GraficoService } from '../grafico-service/grafico.service';
import { Grafico } from '../grafico-modelo/Grafico';


@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements AfterViewInit {

  @Input() public grafico:Grafico;
  @Input() public opc:Opc;

  @ViewChild("canvasEl", {static: false}) 
  canvasEl:ElementRef<HTMLCanvasElement>;
  graficoService:GraficoService;

  ngAfterViewInit(){
    if(this.opc.tipo == OpcTipoEnum.GRAFICO_BARRA){
      this.graficoService = new GraficoBarraService(
        this.grafico,
        this.canvasEl
      );
    }
    if(this.opc.tipo == OpcTipoEnum.GRAFICO_PIZZA){
      this.graficoService = new GraficoPizzaService(
        this.grafico,
        this.canvasEl
      );
    }
    if(this.opc.tipo == OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL1){
      this.graficoService = new DispersaoUnidimensionalService(
        this.grafico,
        this.canvasEl,
        1
      );
    }
    if(this.opc.tipo == OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL2){
      this.graficoService = new DispersaoUnidimensionalService(
        this.grafico,
        this.canvasEl,
        2
      );
    }
    if(this.opc.tipo == OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL3){
      this.graficoService = new DispersaoUnidimensionalService(
        this.grafico,
        this.canvasEl,
        3
      );
    }
    if(this.opc.tipo == OpcTipoEnum.HISTOGRAMA){
      this.graficoService = new GraficoHistogramaService(
        this.grafico,
        this.canvasEl
      );
    }
    this.graficoService.afterViewInit();
  }

}