import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var jQuery:any;
declare var $:any;
declare var iziToast: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user : any ={};
  public usuario: any = {};
  public token : any = '';
  constructor(
    private _adminService: AdminService,
    private _Router: Router
  ){
    this.token = this._adminService.getToken();
    if(this.token){
      this._Router.navigate(['/'])
    }else{
      //Mantener componente

    }
  }
  ngOnInit(): void{
    console.log(this.token);
    

  }
  login(loginForm:any){
    
    
    if(loginForm.valid){

      //console.log(this.user);
      let data={
        email: this.user.email,
        password: this.user.password

      }

      this._adminService.login_admin(data).subscribe(
        response =>{
          if(response.data == undefined){
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'taxt-danger',
              position: 'topRight',
              message: response.message
            });

          }else {
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);
            this._Router.navigate(['/']);

          }
          console.log(response);
          

        },
        error=>{
          console.log(error);

        }
      );

    }else{
        iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'taxt-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
    }
  }
   

}
