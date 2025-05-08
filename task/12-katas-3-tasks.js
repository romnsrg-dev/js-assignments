'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    const rows = puzzle.length;
    const cols = puzzle[0]?.length || 0;

    // Массив направлений: вверх, вниз, влево, вправо
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    // Вспомогательная функция для поиска в глубину (DFS)
    function dfs(x, y, index, visited) {
        if (index === searchStr.length) {
            return true; // Весь искомый текст найден
        }
        // Проверка: выходит ли за границы или клетка уже посещена
        if (x < 0 || x >= rows || y < 0 || y >= cols || visited[x][y]) {
            return false;
        }
        // Если текущий символ не совпадает с нужным
        if (puzzle[x][y] !== searchStr[index]) {
            return false;
        }

        // Отмечаем текущую клетку как посещённую
        visited[x][y] = true;
        // Рекурсивно исследуем все четыре направления
        for (const [dx, dy] of directions) {
            if (dfs(x + dx, y + dy, index + 1, visited)) {
                return true;
            }
        }
        // Отмена отметки (бэктрекинг)
        visited[x][y] = false;
        return false;
    }

    // Инициализируем матрицу посещений
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Запускаем поиск начиная с каждой клетки сетки
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (dfs(i, j, 0, visited)) {
                return true;
            }
        }
    }
    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    if (chars.length <= 1) {
        yield chars;
    } else {
        for (let i = 0; i < chars.length; i++) {
            const currentChar = chars[i];
            const remainingChars = chars.slice(0, i) + chars.slice(i + 1);
            for (const perm of getPermutations(remainingChars)) {
                yield currentChar + perm;
            }
        }
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let maxProfit = 0;
    let maxPrice = 0;

    for (let i = quotes.length - 1; i >= 0; i--) {
        if (quotes[i] > maxPrice) {
            maxPrice = quotes[i];
        }
        maxProfit += maxPrice - quotes[i];
    }

    return maxProfit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    // Используем Map для хранения сопоставлений между коротким кодом и оригинальным URL
    this.urlMap = new Map();
    // Счетчик для генерации уникальных коротких кодов
    this.counter = 0;
    // Набор символов для построения короткого кода
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789-_.~!*'();:@&=+$,/?#[]";
    this.base = this.urlAllowedChars.length;
}

UrlShortener.prototype = {
    /**
     * Кодирует URL в короткий код и сохраняет сопоставление.
     */
    encode: function(url) {
        let shortCode = this.generateShortCode(this.counter);
        this.counter++;
        this.urlMap.set(shortCode, url);
        return shortCode;
    },
    /**
     * Декодирует короткий код, возвращая исходный URL.
     */
    decode: function(code) {
        return this.urlMap.get(code) || '';
    },
    /**
     * Генерирует короткий код на основе числа.
     */
    generateShortCode: function(num) {
        let shortCode = '';
        while (num > 0) {
            shortCode = this.baseChars[num % this.base] + shortCode;
            num = Math.floor(num / this.base);
        }
        return shortCode || this.baseChars[0];
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
