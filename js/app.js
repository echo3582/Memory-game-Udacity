/*
 * Create a list that holds all of your cards
 */
var cards = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
    'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'
];

/**
* @param {array} openCards - 即将进行匹配的卡片
* @param {number} matchNum - 已匹配的卡片对数
* @param {number} count - 玩家已走的步数（匹配一次记一步）
* @param {number} second - 开始游戏之后的秒数计时
* @param {boolean} isCounting - 计时状态
* @param {string} timerID - setInterval的返回值
* @param {number} starNum - 初始化星星数量
*/
var openCards = [];
var matchNum = 0;
var count = 0;
var second = 0;
var isCounting = false;
var timerID = null;
var starNum = 3;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/**
* @description 洗牌、翻牌、抓牌
*/
function getHtml() {
    shuffle(cards);
    $(".card").each(function(index) {
        $(this).attr("class", "card"); //翻牌
        $(this).children().attr("class", cards[index]);
    });
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
* @description 点击事件
*/
function click() {
    $(".card").click(function() {

        /**
        * @description 防止每次点击的时候计时发生紊乱~ 第一次点击时开始计时，此后的点击均不重新计时。
        */
        if (!isCounting) {
            timerBegin();
            isCounting = true;
        }
        /**
        * @description 当牌已经翻开或者已经匹配时，不执行点击事件。
        */
        if ($(this).hasClass("open") || $(this).hasClass("match")) {
            return;
        }
        /**
        * @description 翻开两张牌，第一张牌存入openCards数组，第二张牌存入openCards数组并与第一张牌进行比对。
        */
        if (openCards.length === 0) {
            openCards.push($(this).children().attr("class"));
            $(this).addClass("open show");
        } else if (openCards.length === 1) {
            openCards.push($(this).children().attr("class"));
            $(this).addClass("open show");
            $(".moves").html(++count);
            countSteps();
            match(openCards);
        } else {
            return false;
        }
    });
}
/**
* @description 比对函数，如果openCards中两个元素相同则执行比对成功函数，失败则执行比对失败函数。
* @param {array} array - openCards数组
*/
function match(array) {
    if (array[0] === array[1]) {
        matchSuccess(array[0]);
    } else { 
        matchFailure(array);
    }
}
/**
* @description 比对成功函数，将匹配的卡片添加match类。
* @param {string} classname - openCards数组里面的元素，也就是卡片的类型。
*/
function matchSuccess(classname) {
    $(".card").each(function() {
        if ($(this).children().attr("class") === classname) {
            $(this).addClass("match");
        }
    });
    openCards = [];
    matchNum++;
    if (matchNum === 8) {
        congratulation();
    }
}
/**
* @description 比对失败函数，找到翻开的卡片并添加匹配失败的动画效果。扣牌动作延迟1s,不然第二张牌将不会被翻开。
* @param {string} classname - openCards数组里面的元素，也就是卡片的类型。
*/
function matchFailure(classname) {
    $(".card").each(function() {
        if ($(this).children().attr("class") === classname[0] && $(this).hasClass("open")) {
            $(this).addClass("errorShake");
        } else if ($(this).children().attr("class") === classname[1] && $(this).hasClass("open")) {
            $(this).addClass("errorShake");
        }
    });

    setTimeout(function() {
        $(".card").each(function() {
            if ($(this).children().attr("class") === classname[0] && $(this).hasClass("open")) {
                $(this).attr("class", "card");
            } else if ($(this).children().attr("class") === classname[1] && $(this).hasClass("open")) {
                $(this).attr("class", "card");
            }
        });
    }, 1000);
    openCards = [];
}
/**
* @description 掉血规则
*/
function countSteps() {
    switch (count) {
        case 20:
            starRemove();
            starNum--;
            break;
        case 30:
            starRemove();
            starNum--;
            break;
        case 50:
            starRemove();
            starNum--;
            break;
    }
}
/**
* @description 掉血操作
*/
function starRemove() {
    $(".stars li:first").remove();
}
/**
* @description 游戏成功，停止计时，显示玩家游戏信息，动态显示congratulation页面。
* @description 显示玩家游戏信息，优雅的模板字符串呢~ 划重点：反引号 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings
*/
function congratulation() {
    clearInterval(timerID);
    var second = $(".timer").html();
    for (let i = starNum - 1; i >= 0; i--) {
        console.log(starNum);
        $(".starShow").append("<li class='liStar'><i class='fa fa-star'></i></li>"); 
    }
    $(".successInfo").text(`With ${second} seconds and ${count} moves!`);
    $(".textShow").addClass("animated bounceInDown");
    $(".congratulation").show();
}
/**
* @description 点击重置按钮
*/
function reset() {
    $(".restart").click(function() {
        restart();
    });
}
/**
* @description 点击再玩一次
*/
function tryAgain() {
    $(".tryAgain").click(function() {
        $(".congratulation").hide();
        restart();
    });
}
/**
* @description 重置游戏
*/
function restart() {
    getHtml();
    clearInterval(timerID);
    count = 0;
    second = 0;
    isCounting = false;
    matchNum = 0;
    starNum = 3;
    openCards = [];
    $(".moves").html(0);
    $(".timer").html(0);
    $(".stars").empty();
    $(".starShow").empty();
    $(".stars").append("<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>");
}
/**
* @description 开始计时
*/
var $timer = $(".timer");   // 将 .timer 所在网页元素保存在外面
function timerBegin() {
    timerID = setInterval(function() {
        second += 1;
        $timer.html(second);
    }, 1000);
}

restart();
click();
reset();
tryAgain();