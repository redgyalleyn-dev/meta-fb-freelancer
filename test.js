const moment = require('moment');

const handleDeduction = ({ date, start, end, list, workHours }, salaryPerDay, role = 'parttime') => {
    if (workHours === 0) {
        return {
            date, start, end, list, workHours, deductionHourLate: null, deductionDayOff: null,
        };
    }
    // TODO: Set up late time setting date

    // Time start work user
    const startWork = moment(start, 'HH:mm');

    // Time end work user
    let endWork = moment(end, 'HH:mm');

    // Time policy of company
    const thresholdTime1 = moment('08:30', 'HH:mm');
    const thresholdTime2 = moment('09:30', 'HH:mm');
    const thresholdTime3 = moment('10:00', 'HH:mm');
    const timeStartWorkOfCompany = moment('08:30', 'HH:mm');
    const lunchTime = moment('12:00', 'HH:mm');
    const timeAfternoonOfCompany = moment('13:30', 'HH:mm');
    const timeEndWorkOfCompany = moment('18:00', 'HH:mm');
    const timeEndWorkMaxOfCompany = moment('19:30', 'HH:mm');


    if (endWork.isAfter(timeEndWorkMaxOfCompany)) {
        endWork = timeEndWorkMaxOfCompany;
    }

    if (lunchTime.isBefore(startWork) && startWork.isBefore(timeAfternoonOfCompany) && endWork.isAfter(timeAfternoonOfCompany)) {
        startWork.set('hour', 13);
        startWork.set('minute', 30);
    }

    if (lunchTime.isBefore(startWork) && endWork.isBefore(timeAfternoonOfCompany)) {
        return {
            date, start, end, list, workHours: 0, deductionHourLate: null, deductionDayOff: null,
        };
    }

    // nửa ngày
    if (endWork.isBefore(timeAfternoonOfCompany)) {
        if (endWork.isSameOrAfter(lunchTime)) {
            endWork = lunchTime;
        }
        const timeAbout = Math.abs(endWork.diff(startWork, 'minutes'));
        const timeWorkHour = timeAbout / 60;
        if (timeWorkHour < 3.5) {
            const timeAboutMinutesStart = Math.abs(startWork.diff(timeStartWorkOfCompany, 'minutes'));

            const penalizeStart = startWork.isAfter(timeStartWorkOfCompany) ? generateDeduction(timeAboutMinutesStart, salaryPerDay) : 0;
            const timeAboutMinutesEnd = Math.abs(lunchTime.diff(endWork, 'minutes'));
            const penalizeEnd = endWork.isBefore(lunchTime) ? generateDeduction(timeAboutMinutesEnd, salaryPerDay) : 0;
            const deductionHourLate = penalizeStart ? Number((timeAboutMinutesStart / 60).toFixed(2)) : 0;
            const deductionHourEarly = penalizeEnd ? Number((timeAboutMinutesEnd / 60).toFixed(2)) : 0;
            return {
                date,
                start,
                end,
                list,
                workHours: Number(timeWorkHour.toFixed(2)),
                totalPenalize: (penalizeStart + penalizeEnd > 100000) ? salaryPerDay / 2 : penalizeStart + penalizeEnd,
                deductionHourLate,
                deductionHourEarly,
                deductionDayOff: 0.5,
            };
        } else {
            return {
                date,
                start,
                end,
                list,
                workHours: Number(timeWorkHour.toFixed(2)),
                totalPenalize: 0,
                deductionHourLate: 0,
                deductionHourEarly: 0,
                deductionDayOff: 0.5,
            };
        }
    } else if (lunchTime.isBefore(startWork)) {
        if (startWork.isSameOrBefore(timeAfternoonOfCompany)) { // <= 13h30 
            const timeAbout = Math.abs(endWork.diff(timeAfternoonOfCompany, 'minutes'));
            const timeWorks = timeAbout / 60;

            const penalizeEnd = generateDeduction((4.0 - timeWorks) * 60, salaryPerDay);
            return {
                date,
                start,
                end,
                list,
                workHours,
                totalPenalize: penalizeEnd,
                deductionHourLate: 0,
                deductionHourEarly: penalizeEnd ? Number((4.5 - timeWorks).toFixed(2)) : 0,
                deductionDayOff: 0.5,
            };
        } else if (startWork.isAfter(timeAfternoonOfCompany)) { // > 13h30
            const timeAbout = Math.abs(endWork.diff(startWork, 'minutes'));
            const timeWorks = timeAbout / 60;
            console.log("timeAboutMinutesStart: ", timeWorks);
            if (timeWorks < 4.0) {
                const timeAboutMinutesStart = Math.abs(startWork.diff(timeAfternoonOfCompany, 'minutes'));
                const minutesStart = timeAboutMinutesStart;
                const hourStart = timeAboutMinutesStart / 60;
                const penalizeStart = generateDeduction(minutesStart, salaryPerDay);
                let penalizeEnd = 0;
                let hourEnd = 0;
                const timeEndWork = moment('17:30', 'HH:mm');
                if (endWork.isBefore(timeEndWork)) {
                    const timeAboutMinutesEnd = Math.abs(timeEndWork.diff(endWork, 'minutes'));
                    hourEnd = timeAboutMinutesEnd / 60;
                    penalizeEnd = generateDeduction(timeAboutMinutesEnd, salaryPerDay);
                }
                const deductionHourLate = penalizeStart ? Math.abs(hourStart) : 0;
                const deductionHourEarly = penalizeEnd ? Math.abs(hourEnd) : 0;
                return {
                    date,
                    start,
                    end,
                    list,
                    workHours: Number(timeWorks.toFixed(2)),
                    totalPenalize: (penalizeStart + penalizeEnd > 100000) ? salaryPerDay / 2 : penalizeStart + penalizeEnd,
                    deductionHourLate: Number(deductionHourLate.toFixed(2)),
                    deductionHourEarly: Number(deductionHourEarly.toFixed(2)),
                    deductionDayOff: 0.5,
                };
            } else {
                const timeAboutMinutesStart = Math.abs(startWork.diff(timeAfternoonOfCompany, 'minutes'));
                const minutesStart = timeAboutMinutesStart;
                const hourStart = timeAboutMinutesStart / 60;
                const penalizeStart = generateDeduction(minutesStart, salaryPerDay);
                return {
                    date,
                    start,
                    end,
                    list,
                    workHours,
                    totalPenalize: Number(penalizeStart.toFixed(2)),
                    deductionHourLate: penalizeStart ? Number(hourStart.toFixed(2)) : 0,
                    deductionHourEarly: 0,
                    deductionDayOff: 0.5,
                };
            }
        }
    } else {
        const timeWorks = workHours - 1.5;
        if (timeWorks < 8) {
            const timeAboutMinutesStart = Math.abs(startWork.diff(timeStartWorkOfCompany, 'minutes'));
            const minutesStart = timeAboutMinutesStart;
            const penalizeStart = generateDeduction(minutesStart, salaryPerDay);
            const timeAboutMinutesEnd = Math.abs(endWork.diff(timeEndWorkOfCompany, 'minutes'));
            const minutesEnd = timeAboutMinutesEnd;
            const penalizeEnd = generateDeduction(minutesEnd, salaryPerDay);

            const deductionHourLate = ((startWork.isAfter(timeStartWorkOfCompany)) ? (penalizeStart ? minutesStart / 60 : 0) : 0)
            const deductionHourEarly = ((endWork.isBefore(timeEndWorkOfCompany)) ? (penalizeEnd ? minutesEnd / 60 : 0) : 0);
            console.log("deductionHourLate: ", startWork.isAfter(timeStartWorkOfCompany));
            console.log("deductionHourEarly: ", endWork.isBefore(timeEndWorkOfCompany));
            const totalPenalizeHourLate = ((startWork.isAfter(timeStartWorkOfCompany)) ? penalizeStart : 0) + ((endWork.isBefore(timeEndWorkOfCompany)) ? penalizeEnd : 0);
            return {
                date,
                start,
                end,
                list,
                workHours: Number(timeWorks.toFixed(2)),
                deductionHourLate: Number(deductionHourLate.toFixed(2)),
                deductionHourEarly: Number(deductionHourEarly.toFixed(2)),
                totalPenalize: (totalPenalizeHourLate > 100000) ? salaryPerDay / 2 : totalPenalizeHourLate,
                deductionDayOff: 0,
            };
        } else {
            const timeAbout = Math.abs(startWork.diff(timeStartWorkOfCompany, 'minutes'));
            const penalizeStart = startWork.isAfter(timeStartWorkOfCompany) ? generateDeduction(timeAbout, salaryPerDay) : 0;
            const deductionHourLate = penalizeStart ? Number((timeAbout / 60).toFixed(2)) : 0;
            return {
                date,
                start,
                end,
                list,
                workHours: Number(timeWorks.toFixed(2)),
                deductionHourLate,
                deductionHourEarly: 0,
                totalPenalize: penalizeStart,
                deductionDayOff: 0,
            };
        }
    }
}


const generateDeduction = (minutes, baseSalary) => {
    if (minutes <= 5) return 0;
    else if (5 < minutes && minutes <= 30) return 20000;
    else if (30 < minutes && minutes <= 60) return 50000;
    else return baseSalary / 2;
}

// const caculateTimeForRoleIntern = () => {
//     // Implement logic for intern role
// }
// const list = ["08:33", "16:50", "11:52"];
const list = ["13:54", "16:50", "18:30"];
const startTime = list[0];
const endTime = list[list.length - 1];

const workHours = Number(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), 'hours', true).toFixed(2));
console.log("workHours: ", workHours)
console.log("data", handleDeduction({ date: "29/03/2024", start: startTime, end: endTime, list, workHours }, 1000000, 'Partime'));
