import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Operacao } from 'src/app/modelo/operacao/Operacao';
import { OperacaoTipoEnum } from 'src/app/modelo/operacao/OperacaoTipoEnum';
import { GraficoBarraService } from '../grafico-service/grafico-barra.service';
import { DispersaoUnidimensionalService } from '../grafico-service/grafico-dispersao-unidimensional.service';
import { GraficoHistogramaService } from '../grafico-service/grafico-histograma.service';
import { GraficoPizzaService } from '../grafico-service/grafico-pizza.service';
import { GraficoService } from '../grafico-service/grafico.service';
import { Grafico } from '../grafico-modelo/Grafico';
import { GraficoLigadoService } from '../grafico-service/grafico-ligado.service';


@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements AfterViewInit {

  @Input() public grafico:Grafico;
  @Input() public opc:Operacao;

  @ViewChild("canvasEl", {static: false}) 
  canvasEl:ElementRef<HTMLCanvasElement>;
  graficoService:GraficoService;

  ngAfterViewInit(){
    try{
      if(this.opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_LIGADO){
        if(!this.opc.parametros?.dependeDeColuna){
          throw new Error(`Grafico ligado sem parâmetro 'dependeDeColunas': coluna ${this.grafico.coluna.nome}`);
        }
        this.graficoService = new GraficoLigadoService(
          this.grafico.coluna,
          this.canvasEl,
          this.opc.parametros.dependeDeColuna
        );
      }
      if(this.opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_BARRA){
        this.graficoService = new GraficoBarraService(
          this.grafico.coluna,
          this.canvasEl
        );
      }
      if(this.opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_PIZZA){
        this.graficoService = new GraficoPizzaService(
          this.grafico.coluna,
          this.canvasEl
        );
      }
      if(this.opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL1){
        this.graficoService = new DispersaoUnidimensionalService(
          this.grafico.coluna,
          this.canvasEl,
          1
        );
      }
      if(this.opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL2){
        this.graficoService = new DispersaoUnidimensionalService(
          this.grafico.coluna,
          this.canvasEl,
          2
        );
      }
      if(this.opc.descricao.tipo == OperacaoTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL3){
        this.graficoService = new DispersaoUnidimensionalService(
          this.grafico.coluna,
          this.canvasEl,
          3
        );
      }
      if(this.opc.descricao.tipo == OperacaoTipoEnum.HISTOGRAMA){
        this.graficoService = new GraficoHistogramaService(
          this.grafico.coluna,
          this.canvasEl
        );
      }
    }catch(erro){
      console.error(`ERRO: ${erro.message}`);
    }
   
  }

}