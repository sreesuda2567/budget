import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PdfAnnotatorModalComponent } from './pdf-annotator-modal.component';
import { SvgIconComponent } from './svg-icon.component';
import { PdfManagerService } from './pdf-manager.service';
import { PDF_ANNOTATOR_CONFIG, PdfAnnotatorConfig } from './tokens';

// HttpClient must be provided by the host application:
//   Angular 15+:  provideHttpClient()  in app.config.ts
//   Angular 12-14: HttpClientModule    in AppModule imports
@NgModule({
  declarations: [PdfAnnotatorModalComponent, SvgIconComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [PdfAnnotatorModalComponent],
  providers: [DatePipe, PdfManagerService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PdfAnnotatorModule {
  static forRoot(config: PdfAnnotatorConfig): ModuleWithProviders<PdfAnnotatorModule> {
    return {
      ngModule: PdfAnnotatorModule,
      providers: [
        { provide: PDF_ANNOTATOR_CONFIG, useValue: config },
        PdfManagerService
      ]
    };
  }
}
