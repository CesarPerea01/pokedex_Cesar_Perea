import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: PokemonListComponent,
    title: 'Pokedex CesarPerea',
  },
  {
    path: 'pokemon/:id',
    component: PokemonDetailComponent,
    title: 'Detalle Pokemon',
  },
];

export default routes;
