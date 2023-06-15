export class ArrayUtil{

    public static distintos(array:any[]):any[]{
        return [...new Set(array)];
    }

    public static range (start:number, stop:number, step=1){
        return Array.from(
          { length: (stop - start) / step + 1 },
          (value, index) => start + index * step
        );
    }

    public static repetidos(valor:any,repeticoes:number):any[]{
        const a = [];
        for(let i=0;i<repeticoes;i++){
            a.push(valor);
        }
        return a;
    }

    public static menorDif(a:number[]):number{
        return Math.min(...a.map((v,i)=>i>0?Math.abs(v-a[i-1]):Number.MAX_VALUE));
    }

}