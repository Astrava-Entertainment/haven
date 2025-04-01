export class HavenVector3 {
  constructor(public x: number, public y: number, public z: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  static fromArray(arr: number[]): HavenVector3 {
    return new HavenVector3(arr[0], arr[1], arr[2]);
  }
  static fromUnitVector(): HavenVector3 {
    return new HavenVector3(1, 1, 1);
  }
  static fromVectorZero(): HavenVector3 {
    return new HavenVector3(0, 0, 0);
  }
  toArray(): number[] {
    return [this.x, this.y, this.z];
  }
  unitVector(): HavenVector3 {
    return new HavenVector3(1,1,1);
  }
  add(other: HavenVector3): HavenVector3 {
    return new HavenVector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  subtract(other: HavenVector3): HavenVector3 {
    return new HavenVector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  multiply(scalar: number): HavenVector3 {
    return new HavenVector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  divide(scalar: number): HavenVector3 {
    return new HavenVector3(this.x / scalar, this.y / scalar, this.z / scalar);
  }
  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  normalize(): HavenVector3 {
    const length = this.length();
    return new HavenVector3(this.x / length, this.y / length, this.z / length);
  }
  dot(other: HavenVector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  cross(other: HavenVector3): HavenVector3 {
    return new HavenVector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  rotateX(angle: number): HavenVector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new HavenVector3(
      this.x,
      this.y * cos - this.z * sin,
      this.y * sin + this.z * cos
    );
  }
  rotateY(angle: number): HavenVector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new HavenVector3(
      this.x * cos + this.z * sin,
      this.y,
      -this.x * sin + this.z * cos
    );
  }
  rotateZ(angle: number): HavenVector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new HavenVector3(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
      this.z
    );
  }
}
