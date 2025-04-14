// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'your-app-name';

  constructor() {
    console.log('AppComponent constructed');
  }

  ngOnInit(): void {
    console.log('AppComponent initialized');
    // Any initial loading logic here?
  }
}