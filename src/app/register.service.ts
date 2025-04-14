import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private registerDataService: DataService,
  ) { }

  registerUser(registerData: any): Observable<any> {
    let url = '';
    if (registerData?.userType === 'service-provider') {
      url = 'ServiceProfessional/register';
    }else{
      url = 'Client/register';
    }
    return this.registerDataService.registerUser(url, registerData as FormData);
  }

  nullCheck(value:any){
    if(value){
      return value;
    }
    else{
      return '';
    }
  
   }
}
