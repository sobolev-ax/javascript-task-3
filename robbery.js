'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = false;


/**
 * 
 * @param {Array} days ['ПН', 'ВТ', 'СР']
 * @param {Object} schedule {Name: {from: '10:00+5', to: '18:00+5'}}
 * @returns {Object} Interval(s) {Name: {'ПН': [], 'ВТ': [], 'СР': []}}
 */
function toIntervalsEmpty(days, schedule) {
    var names = Object.keys(schedule);
    var intervals = {};

    for (var i = 0; i < names.length; i++) {
        var name = names[i];

        intervals[name] = {};
        // Name: {}

        for (var j = 0; j < days.length; j++) {
            var day = days[j];

            intervals[name][day] = [];
            // Name: {'ПН': [], 'ВТ': [], 'СР': []}
        }
    }

    return intervals;
}
// Danny: [
//  { from: 'ПН 09:00+3', to: 'ПН 14:00+3' },
//  { from: 'ПН 21:00+3', to: 'ВТ 09:30+3' },
// ]

// Danny: {
//  'ПН': [ { from: 'ПН 09:00+3', to: 'ПН 14:00+3' } ],
//  'ВТ': [ { from: 'ПН 21:00+3', to: 'ВТ 09:30+3' } ],
//  'СР': []
// }
function toIntervalsFill(days, schedule) {
    var names = Object.keys(schedule);
    var intervals;

    intervals = toIntervalsEmpty(days, schedule);
    intervals = toIntervalsEmpty(days, schedule);


    console.log('-\\/------------');
    console.info(intervals);
    console.log('-/\\------------');
    return intervals;
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
    console.info(schedule, duration, workingHours);
    var days = ['ПН', 'ВТ', 'СР'];
    var intervalsGang = toIntervalsFill(days, schedule);
    var intervalsBank = toIntervalsFill(days, {Bank: workingHours});
    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            return false;
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            return template;
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @star
         * @returns {Boolean}
         */
        tryLater: function () {
            return false;
        }
    };
};
