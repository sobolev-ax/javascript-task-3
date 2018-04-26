'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = true;

function getNextDay(day, days) {
    var index = Number(days.indexOf(day)) + 1;
    var nextDay = days[index];

    if (nextDay === undefined) {
        return '';
    }
    return nextDay;
}
function getPrevDay(day, days) {
    var index = Number(days.indexOf(day)) - 1;
    var prevDay = days[index];

    if (prevDay === undefined) {
        return '';
    }
    return prevDay;
}
function getUTC(time) {
    return Number(time.match(/[+][\d]{1,2}/));
}
function getHours(time) {
    return Number(time.match(/([\d]{2})[:][\d]{2}/)[1]);
}
function getMinutes(time) {
    return Number(time.match(/[\d]{2}[:]([\d]{2})/)[1]);
}
function getDay(time) {
    return String(time.match(/[А-Я]{2}/));
}

function toIntervalsEmpty(days, schedule) {
    var names = Object.keys(schedule);
    var intervals = {};

    for (var i = 0; i < names.length; i++) {
        var name = names[i];

        intervals[name] = {};

        for (var j = 0; j < days.length; j++) {
            var day = days[j];

            intervals[name][day] = [];
        }
    }

    return intervals;
}

function toIntervalsFill(days, schedule, intervalsEmpty, utc) {
    var names = Object.keys(intervalsEmpty);

    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var dist = intervalsEmpty[name];
        var source = schedule[name];

        for (var j = 0; j < source.length; j++) {
            var hours = source[j];
            dist = toMinutes(hours, days, utc, dist);
        }
    }
    
    return intervalsEmpty;
}
function toMinutes(hours, days, utc, dist) {
    var result = Object.assign({}, dist);
    var keys = Object.keys(hours); // from, to
    var diff = utc - getUTC(hours[keys[0]]);
    var myMinutes = [];
    var myInterval = [];

    for (var i = 0; i < keys.length; i++) {
        var time = String(hours[keys[i]]);
        var d = getDay(time);
        var h = getHours(time) + diff;
        var m = getMinutes(time);
        var minutes;

        if (h >= 24) {
            var nextDay = getNextDay(d, days);

            if (nextDay === '') {
                if (i === 0) {
                    break;
                } else if (i === 1) {
                    h = 23;
                    m = 59;
                }
            } else {
                h = h - 24;
                d = nextDay;
            }
        } else if (h < 0) {
            var prevDay = getPrevDay(d, days);

            if (prevDay === '') {
                if (i === 0) {
                    h = 0;
                    m = 0;
                } else if (i === 1) {
                    break;
                }
            } else {
                h = 24 + h;
                d = prevDay;
            }
        }

        minutes = (h * 60) + m;

        myMinutes.push(minutes);
        myInterval.push(d);
    }

    if (myMinutes.length === 1) {
        myMinutes = [];
        myInterval = [];

        return result;
    }

    if (myInterval[0] === myInterval[1]) {
        if (myInterval[0] === 'null') {
            var allDays = Object.keys(result);
            var t = {
                from: Number(myMinutes[0]),
                to: Number(myMinutes[1])
            };

            for (var i = 0; i < allDays.length; i++) {
                result[allDays[i]].push(t);
            }
        } else {
            var t = {
                from: Number(myMinutes[0]),
                to: Number(myMinutes[1])
            };

            result[myInterval[0]].push(t);
        }
    } else { // ПН !== СР
        var strIndex = Number(days.indexOf(myInterval[0]));
        var endIndex = Number(days.indexOf(myInterval[1]));
        var saveIndex;

        for (var i = strIndex; i <= endIndex; i++) {
            if (i === strIndex) {
                var t = {
                    from: Number(myMinutes[0]),
                    to: 1439
                }

                saveIndex = Number(days.indexOf(myInterval[0]));
                result[myInterval[0]].push(t);
            } else if (i === endIndex) {
                var t = {
                    from: 0,
                    to: Number(myMinutes[1])
                }

                result[myInterval[1]].push(t);
            } else {
                var t = {
                    from: 0,
                    to: 1439
                }

                saveIndex++;
                result[days[saveIndex]].push(t);
            }
        }
    }

    return result;
}
function toIntervals(days, schedule, utc) {
    var names = Object.keys(schedule);
    var intervalsEmpty;
    var intervalsFill;

    intervalsEmpty = toIntervalsEmpty(days, schedule);
    intervalsFill = toIntervalsFill(days, schedule, intervalsEmpty, utc);

    return intervalsFill;
}
function checkTime(intervalsBankForDay, intervalsGang, duration) {
    var newIntervals = [];
    var banIntervals = [].concat(intervalsBankForDay);

    for (var i = 0; i < intervalsGang.length; i++) {
        var gang = intervalsGang[i];

        newIntervals = [];


        for (var j = 0; j < banIntervals.length; j++) {
            var bank = banIntervals[j];

            if (bank.to - bank.from < duration) continue;
            
            if (gang.from <= bank.to && gang.to >= bank.from) { // есть совпадение
                if (gang.from >= bank.from && gang.to <= bank.to) {
                    if (gang.from - bank.from >= duration) {
                        newIntervals.push({
                            from: Number(bank.from), to: Number(gang.from)
                        })
                    }
                    if (bank.to - gang.to >= duration) {
                        newIntervals.push({
                            from: Number(gang.to), to: Number(bank.to)
                        })
                    }
                } else if (gang.from < bank.from && gang.to < bank.to) {
                    if (bank.to - gang.to >= duration) {
                        newIntervals.push({
                            from: Number(gang.to), to: Number(bank.to)
                        })
                    }
                } else if (gang.to > bank.to && gang.from <= bank.to && gang.from >= bank.from) {
                    if (gang.from - bank.from >= duration) {
                        newIntervals.push({
                            from: Number(bank.from), to: Number(gang.from)
                        })
                    }
                } else if (gang.from < bank.from && gang.to > bank.to) {
                    
                }
            } else { // нет совпадения
                newIntervals.push(bank);
            }
        }

        banIntervals = [].concat(newIntervals);
    }
    return banIntervals;
}
function toCommonIntervals(intervalsBank, intervalsGang, duration, days) {
    var result = Object.assign({}, intervalsBank);
    var name = Object.keys(intervalsBank)[0];
    var gangs = Object.keys(intervalsGang);
    var newIntervals;

    for(var i = 0; i < days.length; i++) {
        var day = String(days[i]);

        for (var j = 0; j < gangs.length; j++) {
            var nameOfGang = gangs[j];

            newIntervals = checkTime(intervalsBank[name][day], intervalsGang[nameOfGang][day], duration);

            result[name][day] = [].concat(newIntervals);
        }
    }

    return result;
}

/**
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
exports.getAppropriateMoment = function (schedule, duration, workingHours) {
    var days = ['ПН', 'ВТ', 'СР'];
    var commonUTC = getUTC(workingHours.from);
    var intervalsGang = toIntervals(days, schedule, commonUTC);
    var intervalsBank = toIntervals(days, {Bank: [workingHours]}, commonUTC);
    var intervalsCommon = toCommonIntervals(intervalsBank, intervalsGang, duration, days);

    var isTry = true;
    var all = Object.assign({}, intervalsCommon);
    var name = String(Object.keys(all)[0]);

    var person = all[name];
    var currInterval;
    var currDayIndex;
    var currIndex;
    var isFirst = false;

    var isExists = (function () {
        for (var i = 0; i < days.length; i++) {
            if (person[days[i]].length) {
                currDayIndex = i;
                currInterval = person[days[i]][0];
                currIndex = 0;
                return true;
            }
        }
        return false;
    })();

    function isLater(interval) {
        var save = Object.assign({}, interval);
        var newFrom = Number(save.from) + 30;

        if (save.to - newFrom >= duration) {
            isFirst = false;
            return {
                from: Number(newFrom),
                to: Number(save.to)
            }
        } else {
            isFirst = true;
            return false;
        }
    }

    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            return isExists;
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            if (!currInterval) return '';
            var h = String(Math.floor(currInterval.from / 60));
            var m = String(currInterval.from % 60);
            var d = String(days[currDayIndex]);

            if (h.length < 2) h = '0' + h;
            if (m.length < 2) m = '0' + m;

            return template.replace(/[%][H]{2}/g, h)
                           .replace(/[%][M]{2}/g, m)
                           .replace(/[%][D]{2}/g, d);
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @star
         * @returns {Boolean}
         */
        tryLater: function () {
            if (!this.exists()) return false;
            if (!isTry) return false;
            var j = currIndex;

            for (var i = currDayIndex; i < days.length; i++) {
                var myDay = days[i];
                
                for (var k; j < person[myDay].length; j++) {
                    if (isFirst) {
                        isFirst = false;
                        currInterval = Object.assign({}, person[myDay][j]);
                        currDayIndex = i;
                        currIndex = j
                        return true;
                    } else if (isLater(person[myDay][j])) {
                        person[myDay][j] = isLater(person[myDay][j]);

                        currInterval = Object.assign({}, person[myDay][j]);
                        currDayIndex = i;
                        currIndex = j
                        return true;
                    }
                }
                isFirst = true;
                j = 0;
            }
            isTry = false;
            return false;
        }
    };
};
