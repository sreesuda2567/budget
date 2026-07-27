import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
/**
 * Self-contained inline-SVG icon (replaces <ion-icon>).
 * Renders ionicons artwork as pure inline SVG so the library does not depend on
 * the ion-icon web component / ionicons being registered by the host app.
 * Sizes to 1em and inherits `currentColor` just like <ion-icon>.
 */
export declare class SvgIconComponent {
    private sanitizer;
    html: SafeHtml;
    set name(value: string | null | undefined);
    constructor(sanitizer: DomSanitizer);
}
