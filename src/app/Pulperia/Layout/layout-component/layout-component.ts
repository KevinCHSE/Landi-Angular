import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '../../nav-bar/nav-bar';

@Component({
  selector: 'app-layout-component',
  imports: [RouterOutlet, NavBar],
  templateUrl: './layout-component.html',
})
export class LayoutComponent {}
