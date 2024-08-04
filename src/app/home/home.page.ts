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
import { Line } from './shared/line';

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
      let circles: Circle[] = [];
      let edges: Line[] = [];
      let points: P5.Vector[] = [];
      p5.setup = () => {
        const boundingRect =
          this.container.nativeElement.getBoundingClientRect();
        const canvas = p5.createCanvas(boundingRect.width, boundingRect.height);
        canvas.parent(this.container.nativeElement);

        circles.push(
          new Circle(p5, new P5.Vector(p5.width / 2, p5.height / 2)),
        );
        circles.push(
          new Circle(p5, new P5.Vector(p5.width / 4, p5.height / 4)),
        );
        circles.push(
          new Circle(p5, new P5.Vector(3 * p5.width / 4, 2 * p5.height / 4)),
        );

        points.push(new P5.Vector(p5.width / 2, 0));
        points.push(new P5.Vector(p5.width, p5.height / 2));
        points.push(new P5.Vector(p5.width / 2, p5.height));
        points.push(new P5.Vector(0, p5.height / 2));

        for (let i = 0; i < points.length; i++) {
          const first = points[i].copy();
          const second =
            i + 1 === points.length ? points[0].copy() : points[i + 1].copy();
          edges.push(new Line(first, second));
        }
      };

      p5.draw = () => {
        p5.frameRate(60);
        console.log();
        p5.background('grey');
        p5.fill('black');

        let t = 1;
        let minDt = 0;
        let collides: (() => void)[] = [];
        do {
          collides.forEach((x) => {
            x();
          });

          collides = [];
          circles.forEach(circle => {
            circle.update(t);
          })
          minDt = 0;

          for(let i = 0; i< circles.length - 1; i++){
            for(let j = i +1; j< circles.length; j ++){
              const dt = circles[i].timeToCollide(circles[j]);
              if (dt < minDt && Math.abs(dt) <= t) {
                minDt = dt;
                collides = [() => circles[i].collide(circles[j])];
              } else if (dt === minDt) {
                collides.push(() => circles[i].collide(circles[j]));
              }
            }
          }

          edges.forEach((line) => {
            circles.forEach((circle) => {
              const dt = circle.timeToCollideWithLine(line);
              if (dt < minDt && Math.abs(dt) <= t) {
                minDt = dt;
                collides = [() => circle.collideWithLine(line)];
              } else if (dt === minDt) {
                collides.push(() => circle.collideWithLine(line));
              }
            });
          });

          circles.forEach(circle => {
            circle.update(minDt);
          })


          t += minDt;
        } while (minDt < 0);

        circles.forEach(circle => {
          circle.draw();
        })

        edges.forEach((line) => {
          p5.line(line.p1.x, line.p1.y, line.p2.x, line.p2.y);
        });

        // collidingCircles.forEach(x => x.draw());

        // console.log(c.timeToCollideWithLine(new Line(new P5.Vector(0,0), new P5.Vector(p5.width,0))))
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
