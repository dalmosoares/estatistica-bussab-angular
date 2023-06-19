import { ElementRef, Optional } from "@angular/core";
import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";
import { GraficoService } from "./grafico.service";
import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";
import { TabelaRepository } from "src/app/repository/tabela.repository";
import { ArrayUtil } from "src/app/utils/array-util";
import { environment } from "src/environments/environment";

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

    override gerarItems(): void {
        console.log("GraficoLigadoService gerarItems inicio");
        const ay = this.coluna.registros as number[];
        const ax = this.dependeDe.registros as number[];
        this.items = ArrayUtil.range(0,ay.length-1).map(i=>({x:ax[i],y:ay[i]}));
        this.gerarEscalaX();
        this.gerarEscalaY();
        console.log(this.items[0]);
        console.log("GraficoLigadoService gerarItems fim");
    }

    private gerarEscalaX(){
        const max = Math.max(...this.items.map(item=>item.x));
        const min = 0;
        this.xEscala = (max-min)/this.widthUtil;
    }

    private gerarEscalaY(){
        const max = Math.max(...this.items.map(item=>item.y));
        const min = Math.min(...this.items.map(item=>item.y));
        this.yEscala = (max-min)/this.heightUtil;
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

    override desenhar(){
        super.desenhar();
    }
    
    override desenharItems(){
        this.items.forEach(item=>{
            this.desenharItem(item);
        });
    }

    private desenharItem(item:GraficoItem){
        this.ctx.beginPath();
        this.ctx.arc(item.x/this.xEscala,item.y/this.yEscala,environment.pontoRaio/this.xEscala,0,2*Math.PI);
        this.ctx.fill();
    }


    yRotular(num:number){

    }

}