import { Observable, map, mergeMap } from "rxjs";

export class RxjsUtil {

    public static converter<T>(arg: Observable<T>[]): Observable<T[]> {
        return arg.map(x=>x.pipe(map(y=>[y]))).reduce((prev,curr)=>
            prev.pipe(mergeMap(
                x=>curr.pipe(map(y=>x.concat(y)))
            ))
        );
    }

}