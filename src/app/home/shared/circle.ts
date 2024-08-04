import * as P5 from 'p5';
import 'p5/lib/p5.js';
import { Line } from './line';

export class Circle {
  private p5: P5;
  public pos: P5.Vector;
  private radius: number = 20;
  private velocity: P5.Vector;

  constructor(p5: P5, initalPosition: P5.Vector) {
    this.p5 = p5;
    this.pos = initalPosition;
    this.velocity = new P5.Vector(p5.random(5, 10), p5.random(5, 10)).mult(1.1);
  }

  public update(t: number = 1) {
    const changeOfPosition = this.velocity.copy().mult(t);
    this.pos.add(changeOfPosition);
  }

  public draw() {
    this.p5.circle(this.pos.x, this.pos.y, this.radius * 2);
  }

  // perform the collide assuming 2 circle is at contact point
  public collide(other: Circle) {
    const dist = P5.Vector.dist(this.pos, other.pos);
    const de = Math.abs(dist - this.radius*2);
    if(de > 0.01){
      console.log(de);
      debugger
    }

    const v1 = this.velocity.copy();
    const v2 = other.velocity.copy();

    const unitVector1 = P5.Vector.sub(other.pos, this.pos).normalize();
    const unitVector2 = unitVector1.copy().mult(-1);

    this.velocity = v1
      .copy()
      .add(
        unitVector1
          .copy()
          .mult(unitVector1.copy().dot(v2.copy().sub(v1.copy()))),
      );
    other.velocity = v2
      .copy()
      .add(
        unitVector2
          .copy()
          .mult(unitVector2.copy().dot(v1.copy().sub(v2.copy()))),
      );
  }

  public collideWithLine(line: Line) {
    const n = P5.Vector.sub(line.p2, line.p1).normalize();

    const x= P5.Vector.sub(line.p1, this.pos);
    const dist = P5.Vector.sub(x, n.copy().mult(P5.Vector.dot(n, x))).mag();
    const de = Math.abs(dist - this.radius);
    if(de > 0.01){
      console.log(de);
      debugger
    }
    const vx = n.copy().mult(P5.Vector.dot(n, this.velocity));
    const vy = P5.Vector.sub(this.velocity, vx);
    vy.mult(-1);
    this.velocity = P5.Vector.add(vx, vy);
  }

  public checkEdges() {
    if (this.pos.x - this.radius <= 0) {
      const dx = this.pos.x - this.radius;
      const dt = dx / this.velocity.x;
      this.pos.x -= dx;
      this.velocity.x *= -1;
      this.pos.x += this.velocity.x * dt;
    }

    if (this.pos.x + this.radius >= this.p5.width) {
      const dx = this.pos.x + this.radius - this.p5.width;
      const dt = dx / this.velocity.x;
      this.pos.x -= dx;
      this.velocity.x *= -1;
      this.pos.x += this.velocity.x * dt;
    }

    if (this.pos.y - this.radius <= 0) {
      const dy = this.pos.y - this.radius;
      const dt = dy / this.velocity.y;
      this.pos.y -= dy;
      this.velocity.y *= -1;
      this.pos.y += this.velocity.y * dt;
    }

    if (this.pos.y + this.radius >= this.p5.height) {
      const dy = this.pos.y + this.radius - this.p5.height;
      const dt = dy / this.velocity.y;
      this.pos.y -= dy;
      this.velocity.y *= -1;
      this.pos.y += this.velocity.y * dt;
    }
  }

  private timePassedCollideWithScalar(other: Circle) {
    const C = this.radius + other.radius;
    const a = this.pos.x - other.pos.x;
    const b = this.velocity.x - other.velocity.x;
    const d = this.pos.y - other.pos.y;
    const e = this.velocity.y - other.velocity.y;

    // only get the possitive value
    const t =
      (a * b +
        d * e +
        Math.sqrt(
          (a * b + d * e) ** 2 - (b ** 2 + e ** 2) * (a ** 2 + d ** 2 - C ** 2),
        )) /
      (b ** 2 + e ** 2);

    return t;
  }

  // negative if collide in the pass
  public timeToCollide(other: Circle): number {

    const d = this.radius + other.radius;
    const a = P5.Vector.sub(other.velocity, this.velocity);
    const b = P5.Vector.sub(other.pos, this.pos);

    const A = P5.Vector.dot(a, a);
    const B = 2 * P5.Vector.dot(a, b);
    const C = P5.Vector.dot(b, b) - d ** 2;

    const D = B ** 2 - 4 * A * C;

    if (D < 0) {
      return Number.POSITIVE_INFINITY;
    }
    const t = (-B - Math.sqrt(D)) / (2 * A);

    return t;
  }

  public timeToCollideWithLine(line: Line): number {
    const u = P5.Vector.sub(line.p1, this.pos);
    const n = P5.Vector.sub(line.p2, line.p1).normalize();
    const ux = P5.Vector.sub(u, n.copy().mult(P5.Vector.dot(u,n)));
    const vx = P5.Vector.sub(this.velocity, n.copy().mult(P5.Vector.dot(this.velocity,n)));
    
    const A = P5.Vector.dot(vx, vx);
    const B = 2 * P5.Vector.dot(vx, ux);
    const C = P5.Vector.dot(ux, ux) - this.radius ** 2;

    const D = B ** 2 - 4 * A * C;

    if (D < 0) {
      return Number.POSITIVE_INFINITY;
    }
    const t = (B - Math.sqrt(D)) / (2 * A);
    return t;
  }
}
