import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class Ng2SearchPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;

        searchText = searchText.toLowerCase();

        return items.filter(it => {
            return JSON.stringify(it).toLowerCase().includes(searchText);
        });
    }
}

@NgModule({
    declarations: [Ng2SearchPipe],
    exports: [Ng2SearchPipe]
})
export class Ng2SearchPipeModule { }
