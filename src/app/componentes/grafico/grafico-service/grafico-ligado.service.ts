import { ElementRef, Optional } from "@angular/core";
import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";
import { GraficoService } from "./grafico.service";
import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";
import { TabelaRepository } from "src/app/repository/tabela.repository";

type GraficoItem = {
    x:number,
    y:number
};

export class GraficoLigadoService extends GraficoService{

    protected override operacaoTipo = OperacaoTipoEnum.GRAFICO_LIGADO;

    override borda = 30;

    marcaTamanho = 8;
    xMaxVirtual:number;
    xMaxVirtualTolerancia = 5;
    xEscala:number;
    xUnidade=20;
    textoAltura=6;
    yEscala:number;

    rotuloDistancia=5;
    items:GraficoItem[];
    rotuloDesloc = 15;

    altura=50;
    raio=4;

    valorMin:number; 
    valorMax:number;

    constructor(
        coluna:Coluna,
        canvasEl: ElementRef<HTMLCanvasElement>,
        dependeDe:Coluna
    ){
        super(canvasEl,coluna,dependeDe);
    }

    iniciarLocal(){        
    }

    gerarItems(): void {
        console.log("GraficoLigadoService gerarItems",this.dependeDe);

    }

    override eixoX(): void {

    }

    override eixoY(): void {

    }

    override xMarcarRotular(): void {

    }

    xMarcar(item:GraficoItem){

    }

    xRotular(item:GraficoItem){

    }

    yMarcarRotular(): void {
    }

    override desenharItems(){

    }

    private desenharItem1(item:GraficoItem){

    }

    private desenharItemRotulo(item:GraficoItem){

    }

    yRotular(num:number){

    }

}