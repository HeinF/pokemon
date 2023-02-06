import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginPage } from './pages/login/login.page';
import { CataloguePage } from './pages/catalogue/catalogue.page';
import { TrainerPage } from './pages/trainer/trainer.page';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    CataloguePage,
    TrainerPage,
    LoginFormComponent,
    PokemonListComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
