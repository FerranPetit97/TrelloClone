import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  imports: [HeaderComponent],
  styleUrls: ['./boards.component.scss'],
  standalone: true,
})
export class BoardsComponent {}
