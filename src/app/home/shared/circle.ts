import * as P5 from 'p5';
import 'p5/lib/p5.js';

export class Circle {
  private p5: P5;
  private pos: P5.Vector;
  private radius: number = 40;
  private velocity: P5.Vector;

  constructor(p5: P5, initalPosition: P5.Vector) {
    this.p5 = p5;
    this.pos = initalPosition;
    this.velocity = new P5.Vector(p5.random(5, 10), p5.random(5, 10));
  }

  public update() {
    this.pos.add(this.velocity);
    this.checkEdges();
  }

  public draw() {
    this.p5.circle(this.pos.x, this.pos.y, this.radius * 2);
  }

  public checkCollide(other: Circle) {
    const dist = P5.Vector.dist(this.pos, other.pos);
    if(dist <= this.radius + other.radius){
      const C = this.radius + other.radius;
      const a = this.pos.x - other.pos.x;
      const b = this.velocity.x - other.velocity.x;
      const d = this.pos.y - other.pos.y;
      const e = this.velocity.y - other.velocity.y;


      // only get the possitive value
      const t = ((a*b + d*e) + Math.sqrt((a*b + d*e)**2-(b**2 + e**2)*(a**2 + d**2 - C**2)))/(b**2 + e**2);

      this.pos.sub(this.velocity.copy().mult(t));
      other.pos.sub(other.velocity.copy().mult(t));

      const v1 = this.velocity.copy();
      const v2 = other.velocity.copy();

      const unitVector1 = P5.Vector.sub(other.pos, this.pos).normalize();
      const unitVector2 = unitVector1.copy().mult(-1);

      this.velocity = v1.copy().add((unitVector1.copy().mult(unitVector1.copy().dot(v2.copy().sub(v1.copy())))));
      other.velocity = v2.copy().add((unitVector2.copy().mult(unitVector2.copy().dot(v1.copy().sub(v2.copy())))));
    

      this.pos.add(this.velocity.copy().mult(t))
      other.pos.add(other.velocity.copy().mult(t))
    }

    console.log(this.velocity.mag()**2 + other.velocity.mag()**2)
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
}
