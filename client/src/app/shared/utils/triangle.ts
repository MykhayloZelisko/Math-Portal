import { arccos, arcsin, cos, sin, sqrt } from './number-functions';
import { TriangleInterface } from '../models/interfaces/triangle.interface';
import { AngleCalcInterface } from '../models/interfaces/angle-calc.interface';
import { SideCalcInterface } from '../models/interfaces/side-calc.interface';

export function areaTriangleHeron(a: number, b: number, c: number): number {
  const p = (a + b + c) / 2;
  return sqrt(p * (p - a) * (p - b) * (p - c));
}

export function angleLawCosines(a: number, b: number, c: number): number {
  return arccos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
}

export function sideLawCosines(a: number, b: number, gamma: number): number {
  return sqrt(a ** 2 + b ** 2 - 2 * a * b * cos(gamma));
}

export function angleLawSines(a: number, b: number, alpha: number): number {
  return arcsin((b / a) * sin(alpha));
}

export function sideLawSines(a: number, alpha: number, beta: number): number {
  return (a * sin(beta)) / sin(alpha);
}

export function altitudeSSS(a: number, b: number, c: number): number {
  return (2 * areaTriangleHeron(a, b, c)) / a;
}

export function medianSSS(a: number, b: number, c: number): number {
  return sqrt(2 * b ** 2 + 2 * c ** 2 - a ** 2) / 2;
}

export function sideSMS(a: number, b: number, m: number): number {
  return sqrt(2 * a ** 2 + 2 * b ** 2 - 4 * m ** 2);
}

export function sideSSM(a: number, b: number, m: number): number {
  return sqrt(0.5 * a ** 2 + 2 * m ** 2 - b ** 2);
}

export function bisectorSSS(a: number, b: number, c: number): number {
  return sqrt(b * c * (a + b + c) * (b + c - a)) / (b + c);
}

export function circumCircleRadius(a: number, b: number, c: number): number {
  return (a * b * c) / (4 * areaTriangleHeron(a, b, c));
}

export function inCircleRadius(a: number, b: number, c: number): number {
  return (2 * areaTriangleHeron(a, b, c)) / (a + b + c);
}

export function exCircleRadius(a: number, b: number, c: number): number {
  const p = (a + b + c) / 2;
  return (inCircleRadius(a, b, c) * p) / (p - a);
}

export function angleSH(a: number, h: number): number {
  return arcsin(h / a);
}

export function angleSBS(a: number, b: number, l: number): number {
  return 2 * arccos((l * (a + b)) / (2 * a * b));
}

export function mediansSSS(
  triangle: TriangleInterface,
  calcMA: boolean,
  calcMB: boolean,
  calcMC: boolean,
): void {
  triangle.median_a = calcMA
    ? medianSSS(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.median_a;
  triangle.median_b = calcMB
    ? medianSSS(triangle.side_b, triangle.side_c, triangle.side_a)
    : triangle.median_b;
  triangle.median_c = calcMC
    ? medianSSS(triangle.side_c, triangle.side_a, triangle.side_b)
    : triangle.median_c;
}

export function bisectorsSSS(
  triangle: TriangleInterface,
  calcBA: boolean,
  calcBB: boolean,
  calcBC: boolean,
): void {
  triangle.bisector_a = calcBA
    ? bisectorSSS(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.bisector_a;
  triangle.bisector_b = calcBB
    ? bisectorSSS(triangle.side_b, triangle.side_c, triangle.side_a)
    : triangle.bisector_b;
  triangle.bisector_c = calcBC
    ? bisectorSSS(triangle.side_c, triangle.side_a, triangle.side_b)
    : triangle.bisector_c;
}

export function altitudesSSS(
  triangle: TriangleInterface,
  calcAA: boolean,
  calcAB: boolean,
  calcAC: boolean,
): void {
  triangle.altitude_a = calcAA
    ? altitudeSSS(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.altitude_a;
  triangle.altitude_b = calcAB
    ? altitudeSSS(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.altitude_b;
  triangle.altitude_c = calcAC
    ? altitudeSSS(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.altitude_c;
}

export function radiusSSS(
  triangle: TriangleInterface,
  calcRR: boolean,
  calcRr: boolean,
  calcRra: boolean,
  calcRrb: boolean,
  calcRrc: boolean,
): void {
  triangle.radius_R = calcRR
    ? circumCircleRadius(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.radius_R;
  triangle.radius_r = calcRr
    ? inCircleRadius(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.radius_r;
  triangle.radius_ra = calcRra
    ? exCircleRadius(triangle.side_a, triangle.side_b, triangle.side_c)
    : triangle.radius_ra;
  triangle.radius_rb = calcRrb
    ? exCircleRadius(triangle.side_b, triangle.side_c, triangle.side_a)
    : triangle.radius_rb;
  triangle.radius_rc = calcRrc
    ? exCircleRadius(triangle.side_c, triangle.side_a, triangle.side_b)
    : triangle.radius_rc;
}

export function calcAngle(
  triangle: TriangleInterface,
  angle: AngleCalcInterface,
): void {
  switch (angle.angle) {
    case 'a':
      switch (angle.calculate) {
        case 'cos':
          triangle.angle_a = angleLawCosines(
            triangle.side_a,
            triangle.side_b,
            triangle.side_c,
          );
          break;
        case 'sinAB':
          triangle.angle_a = angleLawSines(
            triangle.side_b,
            triangle.side_a,
            triangle.angle_b,
          );
          break;
        case 'sinAC':
          triangle.angle_a = angleLawSines(
            triangle.side_c,
            triangle.side_a,
            triangle.angle_c,
          );
          break;
        case 'BH':
          triangle.angle_a = angleSH(triangle.side_b, triangle.altitude_c);
          break;
        case 'CH':
          triangle.angle_a = angleSH(triangle.side_c, triangle.altitude_b);
          break;
        case 'sum':
          triangle.angle_a = Math.PI - triangle.angle_b - triangle.angle_c;
          break;
        case 'SBS':
          triangle.angle_a = angleSBS(
            triangle.side_b,
            triangle.side_c,
            triangle.bisector_a,
          );
          break;
        default:
          break;
      }
      break;
    case 'b':
      switch (angle.calculate) {
        case 'cos':
          triangle.angle_b = angleLawCosines(
            triangle.side_b,
            triangle.side_c,
            triangle.side_a,
          );
          break;
        case 'sinAB':
          triangle.angle_b = angleLawSines(
            triangle.side_a,
            triangle.side_b,
            triangle.angle_a,
          );
          break;
        case 'sinBC':
          triangle.angle_b = angleLawSines(
            triangle.side_c,
            triangle.side_b,
            triangle.angle_c,
          );
          break;
        case 'AH':
          triangle.angle_b = angleSH(triangle.side_a, triangle.altitude_c);
          break;
        case 'CH':
          triangle.angle_b = angleSH(triangle.side_c, triangle.altitude_a);
          break;
        case 'sum':
          triangle.angle_b = Math.PI - triangle.angle_a - triangle.angle_c;
          break;
        case 'SBS':
          triangle.angle_b = angleSBS(
            triangle.side_a,
            triangle.side_c,
            triangle.bisector_b,
          );
          break;
        default:
          break;
      }
      break;
    case 'c':
      switch (angle.calculate) {
        case 'cos':
          triangle.angle_c = angleLawCosines(
            triangle.side_c,
            triangle.side_a,
            triangle.side_b,
          );
          break;
        case 'sinAC':
          triangle.angle_c = angleLawSines(
            triangle.side_a,
            triangle.side_c,
            triangle.angle_a,
          );
          break;
        case 'sinBC':
          triangle.angle_c = angleLawSines(
            triangle.side_b,
            triangle.side_c,
            triangle.angle_b,
          );
          break;
        case 'AH':
          triangle.angle_c = angleSH(triangle.side_a, triangle.altitude_b);
          break;
        case 'BH':
          triangle.angle_c = angleSH(triangle.side_b, triangle.altitude_a);
          break;
        case 'sum':
          triangle.angle_c = Math.PI - triangle.angle_a - triangle.angle_b;
          break;
        case 'SBS':
          triangle.angle_c = angleSBS(
            triangle.side_a,
            triangle.side_b,
            triangle.bisector_c,
          );
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

export function calcSide(
  triangle: TriangleInterface,
  side: SideCalcInterface,
): void {
  switch (side.side) {
    case 'a':
      switch (side.calculate) {
        case 'cos':
          triangle.side_a = sideLawCosines(
            triangle.side_b,
            triangle.side_c,
            triangle.angle_a,
          );
          break;
        case 'sinAB':
          triangle.side_a = sideLawSines(
            triangle.side_b,
            triangle.angle_b,
            triangle.angle_a,
          );
          break;
        case 'sinAC':
          triangle.side_a = sideLawSines(
            triangle.side_c,
            triangle.angle_c,
            triangle.angle_a,
          );
          break;
        case 'SMS':
          triangle.side_a = sideSMS(
            triangle.side_b,
            triangle.side_c,
            triangle.median_a,
          );
          break;
        case 'SSMB':
          triangle.side_a = sideSSM(
            triangle.side_b,
            triangle.side_c,
            triangle.median_b,
          );
          break;
        case 'SSMC':
          triangle.side_a = sideSSM(
            triangle.side_c,
            triangle.side_b,
            triangle.median_c,
          );
          break;
        default:
          break;
      }
      break;
    case 'b':
      switch (side.calculate) {
        case 'cos':
          triangle.side_b = sideLawCosines(
            triangle.side_a,
            triangle.side_c,
            triangle.angle_b,
          );
          break;
        case 'sinAB':
          triangle.side_b = sideLawSines(
            triangle.side_a,
            triangle.angle_a,
            triangle.angle_b,
          );
          break;
        case 'sinBC':
          triangle.side_b = sideLawSines(
            triangle.side_c,
            triangle.angle_c,
            triangle.angle_b,
          );
          break;
        case 'SMS':
          triangle.side_b = sideSMS(
            triangle.side_a,
            triangle.side_c,
            triangle.median_b,
          );
          break;
        case 'SSMA':
          triangle.side_b = sideSSM(
            triangle.side_a,
            triangle.side_c,
            triangle.median_a,
          );
          break;
        case 'SSMC':
          triangle.side_b = sideSSM(
            triangle.side_c,
            triangle.side_a,
            triangle.median_c,
          );
          break;
        default:
          break;
      }
      break;
    case 'c':
      switch (side.calculate) {
        case 'cos':
          triangle.side_c = sideLawCosines(
            triangle.side_a,
            triangle.side_b,
            triangle.angle_c,
          );
          break;
        case 'sinAC':
          triangle.side_c = sideLawSines(
            triangle.side_a,
            triangle.angle_a,
            triangle.angle_c,
          );
          break;
        case 'sinBC':
          triangle.side_c = sideLawSines(
            triangle.side_b,
            triangle.angle_b,
            triangle.angle_c,
          );
          break;
        case 'SMS':
          triangle.side_c = sideSMS(
            triangle.side_a,
            triangle.side_b,
            triangle.median_c,
          );
          break;
        case 'SSMA':
          triangle.side_c = sideSSM(
            triangle.side_a,
            triangle.side_b,
            triangle.median_a,
          );
          break;
        case 'SSMB':
          triangle.side_c = sideSSM(
            triangle.side_b,
            triangle.side_a,
            triangle.median_b,
          );
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}
