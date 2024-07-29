import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import * as P5 from 'p5';
import 'p5/lib/p5.js';
import { Circle } from './shared/circle';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements AfterViewInit {
  public title = 'Bouncing ball';
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  private p5Instance!: P5;

  constructor() {}

  ngAfterViewInit(): void {
    const sketch = (p5: P5) => {
      let c: Circle;
      let c2: Circle;
      p5.setup = () => {
        const boundingRect =
          this.container.nativeElement.getBoundingClientRect();
        const canvas = p5.createCanvas(boundingRect.width, boundingRect.height);
        canvas.parent(this.container.nativeElement);

        c = new Circle(p5, new P5.Vector(p5.width / 2, p5.height / 2));
        c2 = new Circle(p5, new P5.Vector(p5.width / 4, p5.height / 4));
      };

      p5.draw = () => {
        p5.background('grey');
        p5.fill("black");
        c.update();
        c2.update();
        c.checkCollide(c2);
        c.draw();
        c2.draw();
        
      };
    };
    this.p5Instance = new P5(sketch);
  }

  @HostListener('window:resize')
  onResize() {
    const boundingRect = this.container.nativeElement.getBoundingClientRect();
    this.p5Instance.resizeCanvas(boundingRect.width, boundingRect.height);
  }
}
