import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PdfAnnotatorModalComponent } from './pdf-annotator-modal.component';
import { SvgIconComponent } from './svg-icon.component';
import { PdfManagerService } from './pdf-manager.service';
import { PDF_ANNOTATOR_CONFIG } from './tokens';
// HttpClient must be provided by the host application:
//   Angular 15+:  provideHttpClient()  in app.config.ts
//   Angular 12-14: HttpClientModule    in AppModule imports
export class PdfAnnotatorModule {
    static forRoot(config) {
        return {
            ngModule: PdfAnnotatorModule,
            providers: [
                { provide: PDF_ANNOTATOR_CONFIG, useValue: config },
                PdfManagerService
            ]
        };
    }
}
PdfAnnotatorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PdfAnnotatorModalComponent, SvgIconComponent],
                imports: [CommonModule, FormsModule, IonicModule],
                exports: [PdfAnnotatorModalComponent],
                providers: [DatePipe, PdfManagerService],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWFubm90YXRvci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wZGYtYW5ub3RhdG9yL3NyYy9saWIvcGRmLWFubm90YXRvci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsc0JBQXNCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEYsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxvQkFBb0IsRUFBc0IsTUFBTSxVQUFVLENBQUM7QUFFcEUsdURBQXVEO0FBQ3ZELHdEQUF3RDtBQUN4RCw0REFBNEQ7QUFRNUQsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTBCO1FBQ3ZDLE9BQU87WUFDTCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUNuRCxpQkFBaUI7YUFDbEI7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBaEJGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDNUQsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUM7Z0JBQ2pELE9BQU8sRUFBRSxDQUFDLDBCQUEwQixDQUFDO2dCQUNyQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUM7Z0JBQ3hDLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgRGF0ZVBpcGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBJb25pY01vZHVsZSB9IGZyb20gJ0Bpb25pYy9hbmd1bGFyJztcbmltcG9ydCB7IFBkZkFubm90YXRvck1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi9wZGYtYW5ub3RhdG9yLW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdmdJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9zdmctaWNvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGRmTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3BkZi1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUERGX0FOTk9UQVRPUl9DT05GSUcsIFBkZkFubm90YXRvckNvbmZpZyB9IGZyb20gJy4vdG9rZW5zJztcblxuLy8gSHR0cENsaWVudCBtdXN0IGJlIHByb3ZpZGVkIGJ5IHRoZSBob3N0IGFwcGxpY2F0aW9uOlxuLy8gICBBbmd1bGFyIDE1KzogIHByb3ZpZGVIdHRwQ2xpZW50KCkgIGluIGFwcC5jb25maWcudHNcbi8vICAgQW5ndWxhciAxMi0xNDogSHR0cENsaWVudE1vZHVsZSAgICBpbiBBcHBNb2R1bGUgaW1wb3J0c1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbUGRmQW5ub3RhdG9yTW9kYWxDb21wb25lbnQsIFN2Z0ljb25Db21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgSW9uaWNNb2R1bGVdLFxuICBleHBvcnRzOiBbUGRmQW5ub3RhdG9yTW9kYWxDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtEYXRlUGlwZSwgUGRmTWFuYWdlclNlcnZpY2VdLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cbn0pXG5leHBvcnQgY2xhc3MgUGRmQW5ub3RhdG9yTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBQZGZBbm5vdGF0b3JDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFBkZkFubm90YXRvck1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUGRmQW5ub3RhdG9yTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogUERGX0FOTk9UQVRPUl9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcbiAgICAgICAgUGRmTWFuYWdlclNlcnZpY2VcbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=