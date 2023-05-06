import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _clienteService: ClienteService,
    private _Router : Router
  ){

  }
  canActivate():any {
      if(!this._clienteService.isAuthenticated()){
          this._Router.navigate(['/login'])  
          return false;
        }
        return true;   
  }
  
}
