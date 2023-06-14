export class TempoUtil{

  public static sleep(milisegundos:number=3000):void{
    for(let n = new Date().getTime() + milisegundos;n-new Date().getTime()>0;){}
  }

  public static time():number{
    return new Date().getTime();
  }

}