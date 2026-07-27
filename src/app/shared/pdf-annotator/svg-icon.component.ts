import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICON_PATHS } from './icons';

/**
 * Self-contained inline-SVG icon (replaces <ion-icon>).
 * Renders ionicons artwork as pure inline SVG so the library does not depend on
 * the ion-icon web component / ionicons being registered by the host app.
 * Sizes to 1em and inherits `currentColor` just like <ion-icon>.
 */
@Component({
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
  `],
})
export class SvgIconComponent {
  html: SafeHtml = '';

  @Input()
  set name(value: string | null | undefined) {
    const inner = (value && ICON_PATHS[value]) || '';
    // Inline sizing on the <svg> itself so it never falls back to the 300x150
    // default, regardless of view-encapsulation / ::ng-deep support.
    this.html = this.sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ` +
      `style="width:1em;height:1em;display:block">${inner}</svg>`
    );
  }

  constructor(private sanitizer: DomSanitizer) {}
}
