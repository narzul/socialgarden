import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';


import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { StreamviewComponent } from './streamview/streamview.component';
import { AgmCoreModule } from '@agm/core';





const appRoutes: Routes = [
  { path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    AppComponent,
    StreamviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATbJTe7EUekz4op28PKbbr8UpoXhLt4c8'
    }),
    RouterModule.forRoot(
    appRoutes,
   { enableTracing: true } // <-- debugging purposes only
  )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
