import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule, MatInputModule, MatCardModule, MatExpansionModule, MatProgressSpinnerModule, MatButtonModule, MatToolbarModule, MatDialogModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatTabsModule, MatTabGroup, MatTabGroupBase, MatButtonToggleModule, MatTooltipModule, MatCheckboxModule } from "@angular/material";


@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatListModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatGridListModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSidenavModule
  ],
  declarations: [

  ],
  exports: [
    CommonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSidenavModule,
    MatGridListModule
  ]
})
export class MaterialModule { }
