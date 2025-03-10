import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  show() {
    this.isLoading.next(true);
    document.body.style.overflow = 'hidden'; // Bloquea el scroll
  }

  hide() {
    this.isLoading.next(false);
    document.body.style.overflow = '';
  }
}
