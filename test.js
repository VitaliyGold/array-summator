import { parallelSum } from './index.js';
import { generateRandomArray } from './generate.js';
import assert from 'assert';

describe('Parallel Sum', function() { 

    it('Корректная сумма с 1 потоком', async function() {
        const array = generateRandomArray(1000000, 1, 100000000);
        const expectedSum = array.reduce((acc, val) => acc + val, 0);
    
        const { count, time } = await parallelSum(array, 1);
        assert.equal(count, expectedSum);
        assert(time >= 0, 'Время должно быть больше 0');
      });
    
      it('Корректная сумма с 5 потоками', async function() {
        const array = generateRandomArray(1000);
        const expectedSum = array.reduce((acc, val) => acc + val, 0);
    
        const { count, time } = await parallelSum(array, 5);
        assert.equal(count, expectedSum);
        assert(time >= 0, 'Время должно быть больше 0');
      });

      it('Корректная сумма с максимальной длиной массива', async function() {
        const array = generateRandomArray(1000000);
        const expectedSum = array.reduce((acc, val) => acc + val, 0);
    
        const { count, time } = await parallelSum(array, 3);
        assert.equal(count, expectedSum);
        assert(time >= 0, 'Время должно быть больше 0');
      });
      it('Корректная сумма с пустым массивом', async function() {
    
        const { count, time } = await parallelSum([], 3);
        assert.equal(count, 0);
        assert(time >= 0, 'Время должно быть больше 0');
      });
      it('Корректная сумма с отрицательными числами', async function() {
        const array = generateRandomArray(1000, -500000, 500000);
        const expectedSum = array.reduce((acc, val) => acc + val, 0);

        const { count, time } = await parallelSum(array, 3);
        assert.equal(count, expectedSum);
        assert(time >= 0, 'Время должно быть больше 0');
      });
    
      it('Ошибка при количестве воркеров меньше минимального', async function() {
        const array = generateRandomArray(1000);
        try {
          await parallelSum(array, 0);
          assert.fail('Количество воркеров меньше минимального');
        } catch (err) {
            assert.equal(err, 'Error: Количество воркеров должно быть от 1 до 5');
        }
      });
    
      it('Ошибка при количестве воркеров больше максимального', async function() {
        const array = generateRandomArray(1000);
        try {
          await parallelSum(array, 6);
          assert.fail('Количество воркеров больше минимального');
        } catch (err) {
          assert.equal(err, 'Error: Количество воркеров должно быть от 1 до 5');
        }
      });

      it('Ошибка при длине массива больше максимальной', async function() {
        try {
          await parallelSum(new Array(1000001), 3);
          assert.fail('Длина массива больше максимального');
        } catch (err) {
            assert.equal(err, 'Error: Количество элементов в массиве должно быть от 1 до 1000000');
        }
      });
});