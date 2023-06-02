import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { SidebarModule } from 'primeng/sidebar';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PasswordModule } from 'primeng/password';

@NgModule({
    declarations: [
    ],
    imports: [
        
    ],
    exports : [
        ButtonModule,
        CardModule,
        TableModule,
        ScrollPanelModule,
        SplitButtonModule,
        TooltipModule,
        CheckboxModule,
        DropdownModule,
        InputTextModule,
        CalendarModule,
        RadioButtonModule,
        ToastModule,
        InputTextareaModule,
        AccordionModule,
        TabViewModule,
        TreeModule,
        BadgeModule,
        ProgressBarModule,
        PaginatorModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        ChipModule,
        SidebarModule,
        TagModule,
        PanelModule,
        BlockUIModule,
        InputSwitchModule,
        DividerModule,
        BreadcrumbModule,
        PasswordModule
    ],
    providers: [MessageService],
    bootstrap: []
})

export class PrimeNGModule {

}