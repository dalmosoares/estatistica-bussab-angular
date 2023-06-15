import { ElementRef } from "@angular/core";
import { FreqDiscr } from "src/app/modelo/freq/FreqDiscr";
import { FreqDiscrItem } from "src/app/modelo/freq/FreqDiscrItem";
import { GraficoService } from "./grafico.service";
import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";
import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";

type GraficoPizzaItem = {
    rotulo: string,
    cor:string,
    xRotulo: number,
    yRotulo: number,
    angulo1: number,
    angulo2: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
};

export class GraficoPizzaService extends GraficoService{

    protected override operacaoTipo = OperacaoTipoEnum.GRAFICO_PIZZA;
    dados:FreqDiscrItem[];
    graficoItems:GraficoPizzaItem[];
    escala:number;
    override borda=10;
    cx:number;
    cy:number;
    raio:number;
    rotuloDistancia:number;

    constructor(
        coluna:Coluna,
        canvasEl: ElementRef<HTMLCanvasElement>
    ){
        super(canvasEl,coluna);
    }

    iniciarLocal(): void {
        
    }

    gerarItems() {
        this.raio = Math.min(this.width,this.height)/2 - 2*this.borda;
        this.cx=0;
        this.cy=0;
        this.rotuloDistancia=5;
        const format2Dec = new Intl.NumberFormat('pt-BR',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2});
        this.dados = new FreqDiscr(this.coluna.registros).freqs;
        const totalFreq = this.dados.map(d=>d.freq).reduce((prev,curr)=>prev+curr,0);
        this.escala = (2*Math.PI)/totalFreq;
        const x0 = this.cx;
        const y0 = this.cy;
        this.graficoItems = this.dados.reduce((prev,curr,i)=>{
            const cor = this.corRepository.corPorIndice(i);
            const angulo1 = i==0 ? 0 : prev[i-1].angulo2;
            const rotulo = `${curr.valor} (${curr.freq}; ${format2Dec.format(curr.porcent)})`;
            const angulo2 = angulo1 + curr.freq*this.escala;
            const x1 = this.raio*Math.cos(angulo1);
            const y1 = this.raio*Math.sin(angulo1);
            const x2 = this.raio*Math.cos(angulo2);
            const y2 = this.raio*Math.sin(angulo2);
            const xRotulo = (this.raio+this.rotuloDistancia)*Math.cos((angulo1+angulo2)/2);
            const yRotulo = (this.raio+this.rotuloDistancia)*Math.sin((angulo1+angulo2)/2);
          prev.push({cor,rotulo,angulo1,angulo2,x0,y0,x1,y1,x2,y2,xRotulo,yRotulo});
          return prev;
        },[]);
    }

    override converterCoordenadas(): void {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(1,-1);
        this.ctx.translate(this.width/2,-this.height/2);
    }

    override eixoX(): void {
    }

    override eixoY(): void {
    }
    
    override xMarcarRotular(): void {
    }

    override yMarcarRotular(): void {
    }

    override desenhar(){
        super.desenhar();
        this.desenharItemRotulos();
    }
    
    override desenharItems(){
        this.graficoItems.forEach(item=>{
            this.desenharItem(item);
        });
    }

    private desenharItem(item:GraficoPizzaItem){
        this.ctx.beginPath();
        this.ctx.lineTo(item.x2,item.y2);
        this.ctx.moveTo(item.x1,item.y1);
        this.ctx.moveTo(item.x0,item.y0);
        this.ctx.fillStyle = item.cor;
        this.ctx.fill();
        this.ctx.arc(item.x0,item.y0,this.raio,item.angulo1,item.angulo2);
        this.ctx.fill();
    }

    private desenharItemRotulos(){
        this.ctx.save();
        this.ctx.scale(-1,1);
        this.ctx.fillStyle = "black";
        this.ctx.font = this.fonte;
        this.ctx.rotate(-1*Math.PI);
        this.graficoItems.forEach(item=>
            this.desenharItemRotulo(item)
        );
        this.ctx.restore();
    }
    
    private desenharItemRotulo(item:GraficoPizzaItem){
        this.ctx.fillText(item.rotulo,item.xRotulo,-item.yRotulo);
    }
    
}