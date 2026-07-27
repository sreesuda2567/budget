import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICON_PATHS } from './icons';
/**
 * Self-contained inline-SVG icon (replaces <ion-icon>).
 * Renders ionicons artwork as pure inline SVG so the library does not depend on
 * the ion-icon web component / ionicons being registered by the host app.
 * Sizes to 1em and inherits `currentColor` just like <ion-icon>.
 */
export class SvgIconComponent {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.html = '';
    }
    set name(value) {
        const inner = (value && ICON_PATHS[value]) || '';
        // Inline sizing on the <svg> itself so it never falls back to the 300x150
        // default, regardless of view-encapsulation / ::ng-deep support.
        this.html = this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ` +
            `style="width:1em;height:1em;display:block">${inner}</svg>`);
    }
}
SvgIconComponent.decorators = [
    { type: Component, args: [{
                selector: 'svg-icon',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<span class="svg-icon__inner" [innerHTML]="html"></span>`,
                styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      line-height: 1;
      vertical-align: -0.125em;
    }
    .svg-icon__inner { display: inline-flex; width: 1em; height: 1em; }
    :host ::ng-deep svg { width: 1em; height: 1em; display: block; }
  `]
            },] }
];
SvgIconComponent.ctorParameters = () => [
    { type: DomSanitizer }
];
SvgIconComponent.propDecorators = {
    name: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLWljb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGRmLWFubm90YXRvci9zcmMvbGliL3N2Zy1pY29uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVyQzs7Ozs7R0FLRztBQW1CSCxNQUFNLE9BQU8sZ0JBQWdCO0lBYzNCLFlBQW9CLFNBQXVCO1FBQXZCLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFiM0MsU0FBSSxHQUFhLEVBQUUsQ0FBQztJQWEwQixDQUFDO0lBWC9DLElBQ0ksSUFBSSxDQUFDLEtBQWdDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRCwwRUFBMEU7UUFDMUUsaUVBQWlFO1FBQ2pFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDaEQsb0ZBQW9GO1lBQ3BGLDhDQUE4QyxLQUFLLFFBQVEsQ0FDNUQsQ0FBQztJQUNKLENBQUM7OztZQTlCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUUsMERBQTBEO3lCQUMzRDs7Ozs7Ozs7Ozs7O0dBWVI7YUFDRjs7O1lBMUJRLFlBQVk7OzttQkE4QmxCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgSUNPTl9QQVRIUyB9IGZyb20gJy4vaWNvbnMnO1xuXG4vKipcbiAqIFNlbGYtY29udGFpbmVkIGlubGluZS1TVkcgaWNvbiAocmVwbGFjZXMgPGlvbi1pY29uPikuXG4gKiBSZW5kZXJzIGlvbmljb25zIGFydHdvcmsgYXMgcHVyZSBpbmxpbmUgU1ZHIHNvIHRoZSBsaWJyYXJ5IGRvZXMgbm90IGRlcGVuZCBvblxuICogdGhlIGlvbi1pY29uIHdlYiBjb21wb25lbnQgLyBpb25pY29ucyBiZWluZyByZWdpc3RlcmVkIGJ5IHRoZSBob3N0IGFwcC5cbiAqIFNpemVzIHRvIDFlbSBhbmQgaW5oZXJpdHMgYGN1cnJlbnRDb2xvcmAganVzdCBsaWtlIDxpb24taWNvbj4uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3N2Zy1pY29uJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgPHNwYW4gY2xhc3M9XCJzdmctaWNvbl9faW5uZXJcIiBbaW5uZXJIVE1MXT1cImh0bWxcIj48L3NwYW4+YCxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0IHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgd2lkdGg6IDFlbTtcbiAgICAgIGhlaWdodDogMWVtO1xuICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogLTAuMTI1ZW07XG4gICAgfVxuICAgIC5zdmctaWNvbl9faW5uZXIgeyBkaXNwbGF5OiBpbmxpbmUtZmxleDsgd2lkdGg6IDFlbTsgaGVpZ2h0OiAxZW07IH1cbiAgICA6aG9zdCA6Om5nLWRlZXAgc3ZnIHsgd2lkdGg6IDFlbTsgaGVpZ2h0OiAxZW07IGRpc3BsYXk6IGJsb2NrOyB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBTdmdJY29uQ29tcG9uZW50IHtcbiAgaHRtbDogU2FmZUh0bWwgPSAnJztcblxuICBASW5wdXQoKVxuICBzZXQgbmFtZSh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGlubmVyID0gKHZhbHVlICYmIElDT05fUEFUSFNbdmFsdWVdKSB8fCAnJztcbiAgICAvLyBJbmxpbmUgc2l6aW5nIG9uIHRoZSA8c3ZnPiBpdHNlbGYgc28gaXQgbmV2ZXIgZmFsbHMgYmFjayB0byB0aGUgMzAweDE1MFxuICAgIC8vIGRlZmF1bHQsIHJlZ2FyZGxlc3Mgb2Ygdmlldy1lbmNhcHN1bGF0aW9uIC8gOjpuZy1kZWVwIHN1cHBvcnQuXG4gICAgdGhpcy5odG1sID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoXG4gICAgICBgPHN2ZyB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGAgK1xuICAgICAgYHN0eWxlPVwid2lkdGg6MWVtO2hlaWdodDoxZW07ZGlzcGxheTpibG9ja1wiPiR7aW5uZXJ9PC9zdmc+YFxuICAgICk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7fVxufVxuIl19