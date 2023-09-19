import { SolvingTriangleInterface } from '../interfaces/solving-triangle.interface';
import { SolvingTriangleEnum } from '../enums/solving-triangle.enum';

export const SOLVING_TRIANGLE: SolvingTriangleInterface[] = [
  {
    title: 'Три сторони',
    value: SolvingTriangleEnum.SideSideSide,
    labels: ['Сторона $a$', 'Сторона $b$', 'Сторона $c$'],
  },
  {
    title: 'Дві сторони і кут навпроти однієї з них',
    value: SolvingTriangleEnum.SideSideAngle,
    labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\alpha$'],
  },
  {
    title: 'Дві сторони і кут між ними',
    value: SolvingTriangleEnum.SideAngleSide,
    labels: ['Сторона $a$', 'Сторона $b$', 'Кут $\\gamma$'],
  },
  {
    title: 'Сторона, протилежний кут і один з прилеглих кутів',
    value: SolvingTriangleEnum.SideAngleAngle,
    labels: ['Сторона $a$', 'Кут $\\alpha$', 'Кут $\\beta$'],
  },
  {
    title: 'Сторона і два прилеглі кути',
    value: SolvingTriangleEnum.AngleSideAngle,
    labels: ['Сторона $a$', 'Кут $\\beta$', 'Кут $\\gamma$'],
  },
  {
    title: 'Дві сторони і висота, опущена на третю сторону',
    value: SolvingTriangleEnum.SideAltitudeSide,
    labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_c$'],
  },
  {
    title: 'Дві сторони і висота, опущена на одну з них',
    value: SolvingTriangleEnum.SideSideAltitude,
    labels: ['Сторона $a$', 'Сторона $b$', 'Висота $h_a$'],
  },
  {
    title: 'Дві сторони і медіана, проведена до третьої сторони',
    value: SolvingTriangleEnum.SideMedianSide,
    labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_c$'],
  },
  {
    title: 'Дві сторони і медіана, проведена до однієї з них',
    value: SolvingTriangleEnum.SideSideMedian,
    labels: ['Сторона $a$', 'Сторона $b$', 'Медіана $m_a$'],
  },
  {
    title: 'Дві сторони і бісектриса кута між ними',
    value: SolvingTriangleEnum.SideBisectorSide,
    labels: ['Сторона $a$', 'Сторона $b$', 'Бісектриса $l_c$'],
  },
  {
    title: 'Дві сторони і бісектриса кута, протилежного одній із них',
    value: SolvingTriangleEnum.SideSideBisector,
    labels: ['Сторона $a$', 'Сторона $b$', 'Бісектриса $l_a$'],
  },
];
