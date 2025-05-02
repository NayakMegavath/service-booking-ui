// src/app/shared/services/user-context.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserContext {
  clientId: number;
  userType: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private userContextSubject = new BehaviorSubject<UserContext | null>(null);

  setUserContext(context: UserContext): void {
    this.userContextSubject.next(context);
  }

  getUserContext$() {
    return this.userContextSubject.asObservable();
  }

  getCurrentUserContext(): UserContext | null {
    return this.userContextSubject.value;
  }
}
