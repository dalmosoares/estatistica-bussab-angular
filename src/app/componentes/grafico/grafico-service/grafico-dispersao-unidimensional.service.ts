import { ElementRef } from "@angular/core";
import { FreqDiscr } from "src/app/modelo/freq/FreqDiscr";
import { FreqDiscrItem } from "src/app/modelo/freq/FreqDiscrItem";
import { GraficoService } from "./grafico.service";
import { OpcTipoEnum } from "src/app/modelo/opc/OpcTipoEnum";
import { Grafico } from "../grafico-modelo/Grafico";
import { FreqCont } from "src/app/modelo/freq/FreqCont";

type GraficoItem = {
    freq:FreqDiscrItem,
    x:number
};

export class DispersaoUnidimensionalService extends GraficoService{

    override borda = 30;

    marcaTamanho = 8;
    xMaxVirtual:number;
    xMaxVirtualTolerancia = 5;
    xEscala:number;
    xUnidade=20;
    textoAltura=6;
    yEscala:number;

    rotuloDistancia=5;
    dados:FreqDiscrItem[];
    items:GraficoItem[];
    rotuloDesloc = 15;

    altura=50;
    raio=4;

    valorMin:number; 
    valorMax:number;
    freqMax:number;
    subTipo:number;

    constructor(
        grafico:Grafico,
        canvasEl: ElementRef<HTMLCanvasElement>,
        subTipo:number
    ){
        super(
            (subTipo==1)?OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL1:
                ((subTipo==2)?OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL2:OpcTipoEnum.GRAFICO_DISPERSAO_UNIDIMENSIONAL3),
            canvasEl,
            grafico
        );
        this.subTipo = subTipo;
    }

    iniciarLocal(){
        if(this.parametros?.continua){
            this.dados = new FreqCont(
                this.grafico.coluna.registros as number[],this.parametros.intervalos,this.parametros.excluir
            )
            .toDiscreta().freqs;
        }
        else {
            this.dados = new FreqDiscr(this.grafico.coluna.registros,this.parametros?.excluir,this.parametros?.marcarAusentes).freqs;
        }
        this.valorMin = Math.min(...this.dados.map(d=>d.valor));
        this.valorMax = Math.max(...this.dados.map(d=>d.valor));
        this.freqMax =  Math.max(...this.dados.map(d=>d.freq));
        this.xMaxVirtual = this.valorMax - this.valorMin;
        this.xEscala = this.xMaxVirtual/(this.widthUtil-2*this.borda);
        this.yEscala = this.freqMax/this.heightUtil;
    }

    gerarItems(): void {
        this.items = this.dados.map(f=>
            ({x:(f.valor/this.xEscala),freq:f})
        );
    }

    override eixoX(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.widthUtil, 0);
        this.ctx.stroke();
    }

    override eixoY(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0,this.heightUtil);
        this.ctx.stroke();
    }

    override xMarcarRotular(): void {
        this.items.forEach(item=>{
            this.xMarcar(item);
            this.xRotular(item);
        });
    }

    xMarcar(item:GraficoItem){
        this.ctx.beginPath();
        this.ctx.moveTo(item.x,-this.marcaTamanho/2);
        this.ctx.lineTo(item.x,this.marcaTamanho/2);
        this.ctx.stroke();
    }

    xRotular(item:GraficoItem){
        this.ctx.save();
        const tamanho = this.ctx.measureText(item.freq.valor).width;
        this.ctx.translate(item.x,0);
        this.ctx.scale(-1,1);
        this.ctx.rotate(-1*Math.PI);
        const x = -tamanho/2;
        const y = this.rotuloDesloc;
        this.ctx.fillText(item.freq.valor,x,y);
        this.ctx.restore();
    }

    yMarcarRotular(): void {
        if(this.subTipo==3){
            for(let i=1;i<=this.freqMax;i++){
                this.ctx.beginPath();
                this.ctx.moveTo(-this.marcaTamanho/2,i/this.yEscala);
                this.ctx.lineTo(this.marcaTamanho/2,i/this.yEscala);
                this.ctx.stroke();
            }
        }
    }

    override desenharItems(){
        this.ctx.font = this.fonte;
        this.ctx.fillStyle=this.corRepository.preto;

        this.items
        .filter(i=>i.freq.freq!=0)
        .forEach(item=>{
            if(this.subTipo==1){
                this.desenharItem1(item);
                this.desenharItemRotulo(item);
            }
            if(this.subTipo==2){
                for(let j=1;j<=item.freq.freq;j++){
                    this.desenharItem2(item,j);
                }
            }
            if(this.subTipo==3){
                this.desenharItem3(item)
            }
        });
        if(this.subTipo==3){
            for(let i=1;i<=this.freqMax;i++){
                this.yRotular(i);
            }
        }

        this.ctx.fillStyle = "black";
    }

    private desenharItem1(item:GraficoItem){
        this.ctx.moveTo(0,0);
        this.ctx.arc(item.x,this.altura,this.raio,0,2*Math.PI);
        this.ctx.fill();
    }

    private desenharItem2(item:GraficoItem,j:number){
        this.ctx.moveTo(0,0);
        this.ctx.arc(item.x,j/this.yEscala,this.raio,0,2*Math.PI);
        this.ctx.fill();
    }

    private desenharItem3(item:GraficoItem){
        this.ctx.moveTo(0,0);
        this.ctx.arc(item.x,item.freq.freq/this.yEscala,this.raio,0,2*Math.PI);
        this.ctx.fill();
    }

    private desenharItemRotulo(item:GraficoItem){
        this.ctx.save();
        const tamanho = this.ctx.measureText(item.freq.freq.toString()).width;
        this.ctx.translate(item.x,0);
        this.ctx.scale(-1,1);
        this.ctx.rotate(-1*Math.PI);
        const x = -tamanho/2;
        const y = -(this.altura + this.rotuloDesloc);
        this.ctx.fillText(item.freq.freq.toString(),x,y);
        this.ctx.restore();
    }

    yRotular(num:number){
        this.ctx.save();
        const largura = this.ctx.measureText(num.toString()).width;
        this.ctx.translate(0,num/this.yEscala);
        this.ctx.scale(-1,1);
        this.ctx.rotate(-1*Math.PI);
        const x = -largura/2-this.rotuloDesloc;
        const y = this.textoAltura/2;
        this.ctx.fillText(num.toString(),x,y);
        this.ctx.restore();
    }

}