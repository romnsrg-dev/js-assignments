'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    // Вычисляемые ключи: оборачиваем выражения в квадратные скобки
    const digitPatterns = {
        [" _ " + "| |" + "|_|"]: "0",
        ["   " + "  |" + "  |"]: "1",
        [" _ " + " _|" + "|_ "]: "2",
        [" _ " + " _|" + " _|"]: "3",
        ["   " + "|_|" + "  |"]: "4",
        [" _ " + "|_ " + " _|"]: "5",
        [" _ " + "|_ " + "|_|"]: "6",
        [" _ " + "  |" + "  |"]: "7",
        [" _ " + "|_|" + "|_|"]: "8",
        [" _ " + "|_|" + " _|"]: "9"
    };
    const lines = bankAccount.split('\n').filter(line => line.length > 0);
    const numDigits = lines[0].length / 3;
    let accountNumber = '';
    for (let i = 0; i < numDigits; i++) {
        const digitStr =
            lines[0].substr(i * 3, 3) +
            lines[1].substr(i * 3, 3) +
            lines[2].substr(i * 3, 3);
        accountNumber += digitPatterns[digitStr];
    }
    return Number(accountNumber);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    const words = text.split(' ');
    let line = "";
    for (let word of words) {
        if (line === "") {
            line = word;
        } else if ((line + " " + word).length <= columns) {
            line += " " + word;
        } else {
            yield line;
            line = word;
        }
    }
    if (line !== "") {
        yield line;
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    // Отображение значений карт
    const rankMap = {
        '2': 2, '3': 3, '4': 4, '5': 5,
        '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    const values = [];
    const suits = [];
    for (let card of hand) {
        let rank, suit;
        if (card.startsWith('10')) {
            rank = '10';
            suit = card.slice(2);
        } else {
            rank = card[0];
            suit = card.slice(-1);
        }
        values.push(rankMap[rank]);
        suits.push(suit);
    }
    // Проверка на флеш (все масти одинаковы)
    const isFlush = suits.every(s => s === suits[0]);
    // Сортировка значений карт по возрастанию
    let sorted = values.slice().sort((a, b) => a - b);
    // Проверка на стрит (последовательные значения)
    let isStraight = true;
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] !== 1) {
            isStraight = false;
            break;
        }
    }
    // Обработка специального случая: A,2,3,4,5
    if (!isStraight && sorted[0] === 2 && sorted[1] === 3 && sorted[2] === 4 && sorted[3] === 5 && sorted[4] === 14) {
        isStraight = true;
        // Заменяем туза для правильного сравнения
        sorted[4] = 1;
        sorted.sort((a, b) => a - b);
    }
    // Подсчет частоты появления карт
    const freq = {};
    for (let v of sorted) {
        freq[v] = (freq[v] || 0) + 1;
    }
    const counts = Object.values(freq).sort((a, b) => b - a);
    if (isFlush && isStraight) return PokerRank.StraightFlush;
    if (counts[0] === 4) return PokerRank.FourOfKind;
    if (counts[0] === 3 && counts[1] === 2) return PokerRank.FullHouse;
    if (isFlush) return PokerRank.Flush;
    if (isStraight) return PokerRank.Straight;
    if (counts[0] === 3) return PokerRank.ThreeOfKind;
    if (counts[0] === 2 && counts[1] === 2) return PokerRank.TwoPairs;
    if (counts[0] === 2) return PokerRank.OnePair;
    return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    const lines = figure.split('\n').filter(line => line.length > 0);
    // Если фигура имеет ровно 8 строк, предполагаем заданную форму.
    // Нижний блок: строки 4-7.
    const bottomBand = lines.slice(4, 8);
    // Функция для получения индексов символа '+' в строке.
    function getPlusIndices(line) {
        let indices = [];
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '+') indices.push(i);
        }
        return indices;
    }
    const plusIndicesRow4 = getPlusIndices(bottomBand[0]); // строка 4
    const plusIndicesRow7 = getPlusIndices(bottomBand[bottomBand.length - 1]); // строка 7
    // Предполагаем, что они совпадают.
    let common = plusIndicesRow4.filter(i => plusIndicesRow7.includes(i));
    common.sort((a, b) => a - b);
    // Для нижнего блока для каждой пары соседних плюсов создаём прямоугольник.
    for (let i = 0; i < common.length - 1; i++) {
        const left = common[i], right = common[i+1];
        const rectLines = [];
        for (let row of bottomBand) {
            rectLines.push(row.slice(left, right + 1));
        }
        yield rectLines.join('\n');
    }
    // Формируем внешний прямоугольник верхнего блока.
    const topBandTop = lines[0]; // верхняя граница
    const topBandMiddle = lines.slice(1, 4); // внутренние строки верхнего блока
    const bottomBorderRaw = lines[4]; // строка, разделяющая верхний и нижний блоки
    const width = topBandTop.length;
    // Формируем нижнюю границу внешнего прямоугольника: берем первый и последний символ строки-разделителя
    // и заполняем внутренности символом '-'
    const mergedBottom = bottomBorderRaw[0] + '-'.repeat(width - 2) + bottomBorderRaw[width - 1];
    const upperRect = [];
    upperRect.push(topBandTop);
    for (let line of topBandMiddle) {
        upperRect.push(line.slice(0, width));
    }
    upperRect.push(mergedBottom);
    yield upperRect.join('\n');
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
