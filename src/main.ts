import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import * as Sentry from '@sentry/angular';
import {Integrations} from '@sentry/tracing';

import {AppModule} from './app/app.module';
import {AppConfig} from './environments/environment';
import {HashParams} from './app/utils/hash-params';

if (typeof Bridge !== 'undefined') {
    Sentry.init({
        dsn: 'https://058287be9634438392c0f45c33aa7c05@o303737.ingest.sentry.io/5691656',
        integrations: [
            new Integrations.BrowserTracing({
                tracingOrigins: ['localhost', 'https://appassets.androidplatform.net'],
                routingInstrumentation: Sentry.routingInstrumentation,
            }),
        ],
        sampleRate: AppConfig.production ? 1.0 : 0.0,
        tracesSampleRate: AppConfig.production ? 1.0 : 0.0,
        environment: AppConfig.production ? 'production' : 'development',
        release: `pl.shadi.velin.mobile.ui@${Bridge.getAppVersion()}+${Bridge.getAppVersionCode()}`
    });
}

if (AppConfig.production) {
    enableProdMode();
}

if (window.location.hash) {
    const paramsText = window.location.hash.substring(1).split('&');
    HashParams.params = {};
    HashParams.paramsTextArray = paramsText;
    for (const param of paramsText) {
        const keyVal = param.split('=');
        HashParams.params[keyVal[0]] = keyVal[1];
    }
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
