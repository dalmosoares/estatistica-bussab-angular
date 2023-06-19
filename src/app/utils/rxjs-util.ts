import { Observable, last, map, mergeMap, mergeScan, of } from "rxjs";

export class RxjsUtil {

    public static converter<T>(tObs: Observable<T>[]): Observable<T[]> {
        return tObs.map(x=>x.pipe(map(y=>[y]))).reduce((prev,curr)=>
            prev.pipe(mergeMap(
                x=>curr.pipe(map(y=>x.concat(y)))
            ))
        );
    }

    public static gerarArray<T>(tObs: Observable<T>):Observable<T[]>{
        return tObs.pipe(mergeScan(
            (acc,value) => {
              acc.push(value);
              return of(acc);
            },[]
          )
        )
        .pipe(last());
    }

}