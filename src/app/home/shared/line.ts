import * as P5 from 'p5';
import 'p5/lib/p5.js';

export class Line {
  public p1: P5.Vector;
  public p2: P5.Vector;

  constructor(p1: P5.Vector, p2: P5.Vector){
    this.p1 = p1;
    this.p2 = p2;
  }

  
}