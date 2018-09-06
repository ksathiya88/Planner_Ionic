import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

 
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { DragulaModule } from 'ng2-dragula';
import { IonicStorageModule } from '@ionic/storage';
 
import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from './../providers/firebase/firebase';
import { DatePicker } from '@ionic-native/date-picker';
import { AuthService } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
 
const firebaseConfig = {
    apiKey: "AIzaSyCiQpcwhlRwc4p_V--111o-2PexiraT--4",
    authDomain: "planningapp-331cb.firebaseapp.com",
    databaseURL: "https://planningapp-331cb.firebaseio.com",
    projectId: "planningapp-331cb",
    storageBucket: "planningapp-331cb.appspot.com",
    messagingSenderId: "229712215807"
  };
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    DragulaModule.forRoot(),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseProvider,
    DatePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    AngularFireAuth,
    UserServiceProvider,
  ]
})

export class AppModule {}