import { Matrix } from './matrix';

describe('Matrix', () => {
  const matrixA = new Matrix(2, 2);
  matrixA[0] = [1, 2];
  matrixA[1] = [1, 3];
  const matrixB = new Matrix(2, 2);
  matrixB[0] = [3, -2];
  matrixB[1] = [-1, 1];

  it('should create an instance', () => {
    expect(new Matrix(1, 1)).toBeTruthy();
  });

  it('should throw an error', () => {
    expect(() => new Matrix(0, 0)).toThrowError(
      'The dimensions of the matrix are incorrect',
    );
  });

  describe('sum', () => {
    it('should return sum of two matrices', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [4, 0];
      matrixC[1] = [0, 4];
      const sum = Matrix.sum(matrixA, matrixB);

      expect(sum).toEqual(matrixC);
    });

    it('should throw an error', () => {
      const matrixC = new Matrix(3, 3);

      expect(() => Matrix.sum(matrixA, matrixC)).toThrowError(
        'The dimensions of the matrices are not the same',
      );
    });
  });

  describe('difference', () => {
    it('should return difference of two matrices', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [-2, 4];
      matrixC[1] = [2, 2];
      const diff = Matrix.difference(matrixA, matrixB);

      expect(diff).toEqual(matrixC);
    });
  });

  describe('product', () => {
    it('should return product of two matrices', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [1, 0];
      matrixC[1] = [0, 1];
      const prod = Matrix.product(matrixA, matrixB);

      expect(prod).toEqual(matrixC);
    });

    it('should throw an error', () => {
      const matrixC = new Matrix(3, 3);

      expect(() => Matrix.product(matrixA, matrixC)).toThrowError(
        'Matrices are not concerted',
      );
    });
  });

  describe('lambda', () => {
    it('should return product of two matrices', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [1.5, 3];
      matrixC[1] = [1.5, 4.5];
      const lambda = matrixA.lambda(1.5);

      expect(lambda).toEqual(matrixC);
    });
  });

  describe('getRow', () => {
    it('should return one row of matrix', () => {
      const matrixC = new Matrix(1, 2);
      matrixC[0] = matrixA[0];
      const row = matrixA.getRow(0);

      expect(row).toEqual(matrixC);
    });

    it('should throw an error', () => {
      expect(() => matrixA.getRow(5)).toThrowError('Row index is incorrect');
    });
  });

  describe('getColumn', () => {
    it('should return one column of matrix', () => {
      const matrixC = new Matrix(2, 1);
      matrixC[0] = [2];
      matrixC[1] = [3];
      const column = matrixA.getColumn(1);

      expect(column).toEqual(matrixC);
    });

    it('should throw an error', () => {
      expect(() => matrixA.getColumn(5)).toThrowError(
        'Column index is incorrect',
      );
    });
  });

  describe('getCell', () => {
    it('should return 3', () => {
      const cell = matrixA.getCell(1, 1);

      expect(cell).toBe(3);
    });

    it('should throw an error', () => {
      expect(() => matrixA.getCell(5, 10)).toThrowError(
        'Index (5, 10) is incorrect',
      );
    });
  });

  describe('det', () => {
    it('should return 1', () => {
      const det = matrixA.det();

      expect(det).toBe(1);
    });

    it('should throw an error', () => {
      const matrixC = new Matrix(2, 4);
      expect(() => matrixC.det()).toThrowError('The matrix is not square');
    });
  });

  describe('minor', () => {
    it('should return 3', () => {
      const minor = matrixA.minor(0, 0);

      expect(minor).toBe(3);
    });
  });

  describe('replaceColumn', () => {
    it('should return matrix with new column', () => {
      const matrixC = new Matrix(2, 1);
      matrixC[0] = [-3];
      matrixC[1] = [-5];
      const matrixD = new Matrix(2, 2);
      matrixD[0] = [1, -3];
      matrixD[1] = [1, -5];
      const matrix = matrixA.replaceColumn(1, matrixC);

      expect(matrix).toEqual(matrixD);
    });

    it('should throw an error', () => {
      const matrixC = new Matrix(3, 1);

      expect(() => matrixA.replaceColumn(1, matrixC)).toThrowError(
        'The size of the new column is incorrect',
      );
    });
  });

  describe('replaceRow', () => {
    it('should return matrix with new row', () => {
      const matrixC = new Matrix(1, 2);
      matrixC[0] = [-3, -5];
      const matrixD = new Matrix(2, 2);
      matrixD[0] = matrixA[0];
      matrixD[1] = matrixC[0];

      const matrix = matrixA.replaceRow(1, matrixC);

      expect(matrix).toEqual(matrixD);
    });

    it('should throw an error', () => {
      const matrixC = new Matrix(1, 3);

      expect(() => matrixA.replaceRow(1, matrixC)).toThrowError(
        'The size of the new row is incorrect',
      );
    });
  });

  describe('cofactor', () => {
    it('should return -2', () => {
      const cofactor = matrixA.cofactor(1, 0);

      expect(cofactor).toBe(-2);
    });
  });

  describe('inverse', () => {
    it('should return inverse matrix', () => {
      const inverse = matrixA.inverse();

      expect(inverse).toEqual(matrixB);
    });

    it('should throw an error', () => {
      const matrixC = new Matrix(3, 3);

      expect(() => matrixC.inverse()).toThrowError(
        'The matrix is not invertible',
      );
    });
  });

  describe('echelon', () => {
    it('should return echelon matrix', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [1, 2];
      matrixC[1] = [0, 1];
      const echelon = matrixA.echelon();

      expect(echelon).toEqual(matrixC);
    });
  });

  describe('swapRows', () => {
    it('should return matrix with new rows order', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [1, 3];
      matrixC[1] = [1, 2];
      const swap = matrixA.swapRaws(0, 1);

      expect(swap).toEqual(matrixC);
    });
  });

  describe('swapColumns', () => {
    it('should return matrix with new columns order', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [2, 1];
      matrixC[1] = [3, 1];
      const swap = matrixA.swapColumns(0, 1);

      expect(swap).toEqual(matrixC);
    });
  });

  describe('copy', () => {
    it('should return copy of matrix', () => {
      const copy = matrixA.copy();

      expect(copy).toEqual(matrixA);
    });
  });

  describe('rang', () => {
    it('should return 1', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [2, 1];
      matrixC[1] = [4, 2];
      const rang = matrixC.rang();

      expect(rang).toBe(1);
    });
  });

  describe('rowsLinearCombination', () => {
    it('should return matrix with new rows', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [3, 8];
      matrixC[1] = [1, 3];
      const matrix = matrixA.rowsLinearCombination(0, 2, 1);

      expect(matrix).toEqual(matrixC);
    });
  });

  describe('columnsTransposition', () => {
    it('should return matrix with new columns order', () => {
      const matrixC = new Matrix(2, 2);
      matrixC[0] = [2, 1];
      matrixC[1] = [3, 1];
      const matrix = matrixA.columnsTransposition(1, 0);

      expect(matrix).toEqual(matrixC);
    });
  });
});
