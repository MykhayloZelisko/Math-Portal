import { abs, roundN } from '../../utils/number-functions';

export class Matrix extends Array<number[]> {
  public size: [number, number] = [0, 0];

  public constructor(m: number, n: number) {
    // m - number of rows, n - number of columns
    super();
    if (m < 1 || m !== roundN(m, 0) || n < 1 || n !== roundN(n, 0)) {
      throw new TypeError('The dimensions of the matrix are incorrect');
    }
    this.size = [m, n];
    this.length = m;
    Object.defineProperty(this, 'length', { writable: false });
    for (let i = 0; i < m; i++) {
      this[i] = new Array(n);
      Object.defineProperty(this[i], 'length', { writable: false });
      Object.defineProperty(this, 'size', { writable: false });
    }
  }

  public static sum(a: Matrix, b: Matrix): Matrix {
    if (a.size[0] !== b.size[0] || a.size[1] !== b.size[1]) {
      throw new TypeError('The dimensions of the matrices are not the same');
    }
    const sum = new Matrix(a.size[0], a.size[1]);
    for (let i = 0; i < a.size[0]; i++) {
      for (let j = 0; j < a.size[1]; j++) {
        sum[i][j] = a[i][j] + b[i][j];
      }
    }
    return sum;
  }

  public static difference(a: Matrix, b: Matrix): Matrix {
    return this.sum(a, b.lambda(-1));
  }

  public static product(a: Matrix, b: Matrix): Matrix {
    if (a.size[1] !== b.size[0]) {
      throw new TypeError('Matrices are not concerted');
    }
    const result = new Matrix(a.size[0], b.size[1]);
    for (let i = 0; i < a.size[0]; i++) {
      for (let j = 0; j < b.size[1]; j++) {
        result[i][j] = 0;
        for (let k = 0; k < a.size[1]; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  public lambda(n: number): Matrix {
    const result = new Matrix(this.size[0], this.size[1]);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        result[i][j] = this[i][j] * n;
      }
    }
    return result;
  }

  public getRow(n: number): Matrix {
    if (n >= this.size[0]) {
      throw new TypeError('Row index is incorrect');
    }
    const row = new Matrix(1, this.size[1]);
    for (let j = 0; j < this.size[1]; j++) {
      row[0][j] = this[n][j];
    }
    return row;
  }

  public getColumn(n: number): Matrix {
    if (n >= this.size[1]) {
      throw new TypeError('Column index is incorrect');
    }
    const column = new Matrix(this.size[0], 1);
    for (let i = 0; i < this.size[0]; i++) {
      column[i][0] = this[i][n];
    }
    return column;
  }

  public getCell(row: number, col: number): number {
    if (row >= this.size[0] || col >= this.size[1]) {
      throw new TypeError(`Index (${row}, ${col}) is incorrect`);
    }
    return this[row][col];
  }

  public minor(row: number, col: number): number {
    const result = new Matrix(this.size[0] - 1, this.size[1] - 1);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        const m = i < row ? i : i + 1;
        const n = j < col ? j : j + 1;
        result[i][j] = this[m][n];
      }
    }
    return result.det();
  }

  public det(): number {
    if (this.size[0] !== this.size[1]) {
      throw new TypeError('The matrix is not square');
    }
    if (this.size[0] === 1) {
      return this[0][0];
    }
    let result = 0;
    for (let i = 0; i < this.length; i++) {
      result += this[0][i] * this.cofactor(0, i);
    }
    return result;
  }

  public replaceColumn(n: number, colMatrix: Matrix): Matrix {
    if (colMatrix.size[0] !== this.size[0] || colMatrix.size[1] !== 1) {
      throw new TypeError('The size of the new column is incorrect');
    }
    const result = new Matrix(this.size[0], this.size[1]);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        result[i][j] = j === n ? colMatrix[i][0] : this[i][j];
      }
    }
    return result;
  }

  public replaceRow(n: number, rowMatrix: Matrix): Matrix {
    if (rowMatrix.size[1] !== this.size[1] || rowMatrix.size[0] !== 1) {
      throw new TypeError('The size of the new row is incorrect');
    }
    const result = new Matrix(this.size[0], this.size[1]);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        result[i][j] = i === n ? rowMatrix[0][j] : this[i][j];
      }
    }
    return result;
  }

  public cofactor(row: number, col: number): number {
    return (-1) ** (row + col) * this.minor(row, col);
  }

  public transpose(): Matrix {
    const result = new Matrix(this.size[0], this.size[1]);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        result[i][j] = this[j][i];
      }
    }
    return result;
  }

  public inverse(): Matrix {
    const det = this.det();
    if (!det) {
      throw new TypeError('The matrix is not invertible');
    }
    const result = new Matrix(this.size[0], this.size[1]);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        result[i][j] = this.cofactor(i, j);
      }
    }
    return result.transpose().lambda(1 / det);
  }

  public echelon(): Matrix {
    let result = this.copy();
    let pRow = 0;
    let pCol = 0;
    while (pRow < this.size[0] && pCol < this.size[1]) {
      let max = 0;
      let iMax = pRow;
      for (let i = pRow; i < this.size[0]; i++) {
        if (abs(result[i][pCol]) > max) {
          max = abs(result[i][pCol]);
          iMax = i;
        }
      }
      if (!result[iMax][pCol]) {
        pCol += 1;
      } else {
        result = result.swapRaws(pRow, iMax);
        for (let i = pRow + 1; i < this.size[0]; i++) {
          const lambda = -result[i][pCol] / result[pRow][pCol];
          result = result.rowsLinearCombination(i, lambda, pRow);
        }
        pRow += 1;
        pCol += 1;
      }
    }
    return result;
  }

  public swapRaws(m: number, n: number): Matrix {
    const rowOne = this.getRow(m);
    const rowTwo = this.getRow(n);
    return this.replaceRow(m, rowTwo).replaceRow(n, rowOne);
  }

  public swapColumns(m: number, n: number): Matrix {
    const columnOne = this.getColumn(m);
    const columnTwo = this.getColumn(n);
    return this.replaceColumn(m, columnTwo).replaceColumn(n, columnOne);
  }

  public copy(): Matrix {
    const result = new Matrix(this.size[0], this.size[1]);
    for (let i = 0; i < result.size[0]; i++) {
      for (let j = 0; j < result.size[1]; j++) {
        result[i][j] = this[i][j];
      }
    }
    return result;
  }

  public rang(): number {
    const matrix = this.echelon();
    let rg = 0;
    for (let i = 0; i < matrix.size[0]; i++) {
      let squaresSum = 0;
      for (let j = 0; j < matrix.size[1]; j++) {
        squaresSum += matrix[i][j] ** 2;
      }
      rg = squaresSum ? rg + 1 : rg;
    }
    return rg;
  }

  public rowsLinearCombination(m: number, lambda: number, n: number): Matrix {
    // row_m = row_m + lambda * row_n
    const rowOne = this.getRow(m);
    const rowTwo = this.getRow(n);
    const rowCombination = Matrix.sum(rowOne, rowTwo.lambda(lambda));
    rowCombination[0] = rowCombination[0].map((cell: number) => {
      return abs(cell) > 1e-10 ? roundN(cell, 10) : 0;
    });
    return this.replaceRow(m, rowCombination);
  }

  public columnsTransposition(...indexes: number[]): Matrix {
    let result = this.copy();
    indexes.forEach((item: number, index: number) => {
      result = result.replaceColumn(index, this.getColumn(item));
    });
    return result;
  }
}
