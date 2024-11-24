import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, pt_BR } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuardInterceptor } from './core/interceptors/guard.interceptor';
import { NgZorroModule } from './shared/ng-zorro.module';
import { NotFoundComponent } from './modules/not-found/not-found.component';

registerLocaleData(pt);

@NgModule({
	declarations: [AppComponent, NotFoundComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, NgZorroModule],
	providers: [
		{ provide: NZ_I18N, useValue: pt_BR },
		{ provide: LOCALE_ID, useValue: 'pt-BR' },
		{ provide: HTTP_INTERCEPTORS, useClass: GuardInterceptor, multi: true },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
