import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto : any = {};
  public config : any = {};
  public imgSelect : any;
  public load_btn = false;
  public id:any;
  public token;
  public file:any=undefined;
  public url;
  public config_global : any = {};

  constructor(
    private _route : ActivatedRoute,
    private _productoService:ProductoService,
    private _adminService : AdminService,
    private _router : Router
  ) { 
    this.config = {
      height: 500
    }
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_publico().subscribe(
      response=>{
        this.config_global = response.data;
        console.log(this.config_global);
        
      }
    )

  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);

        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
           if(response.data == undefined){
            this.producto = undefined;
           }else{
             this.producto = response.data;
             this.imgSelect = this.url +'obtener_portada/'+this.producto.portada;
           }
            
          },
          error=>{
            console.log(error);
            
          }
        );
        
      }
    );
  }

  actualizar(actualizarForm:any){
      if(actualizarForm.valid){

        var data : any= {};

        if(this.file != undefined){
          data.portada = this.file;
        }

        data.titulo = this.producto.titulo;
        data.stock = this.producto.stock;
        data.precio = this.producto.precio;
        data.categoria = this.producto.categoria;
        data.descripcion = this.producto.descripcion;
        data.contenido = this.producto.contenido;

        this.load_btn = true;
        this._productoService.actualizar_producto_admin(data,this.id,this.token).subscribe(
          response=>{
            console.log(response);
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se actualizó correctamente el nuevo producto.'
            });

            this.load_btn = false;

            this._router.navigate(['/panel/productos']);
          },
          error=>{
            console.log(error);
            this.load_btn = false;
          }
        )
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Los datos del formulario no son validos'
        });
        this.load_btn = false;
      }
  }

  fileChangeEvent(event:any):void{
    var file:any;
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];

    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'No hay un imagen de envio'
      });
    }

    if(file.size <= 4000000){

      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){
    
        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        console.log(this.imgSelect);
        
        reader.readAsDataURL(file);

        $('#input-portada').text(file.name);
        this.file = file;

      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La imagen no puede superar los 4MB'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
    
    console.log(this.file);
    
  }

}
