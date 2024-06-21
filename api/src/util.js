import moment from "moment";

export const SLOT_DURATION = 30;
export async function isOpened(horarios) {
  const currentDay = moment().day();
  const horariosDia = horarios.filter((h) => h.dias.includes(currentDay));

  if (horariosDia.length > 0) {
    return horariosDia.some((h) => {
      const inicio = moment(h.inicio, "HH:mm:ss");
      const fim = moment(h.fim, "HH:mm:ss");
      return moment().isBetween(inicio, fim);
    });
  }

  return false;
}
export function toCents(price) {
  return parseInt(price.toString().replace(".", "").replace(",", ""));
}
export function mergeDateTime(date, time) {
  return moment(`${date}T${time}`).format("YYYY-MM-DDTHH:mm");
}
export function sliceMinutes(start, end, duration, validation = true) {
  const slices = [];
  const now = moment();
  start = moment(start);
  end = moment(end);

  while (end > start) {
    if (start.isSame(now, "day") && validation && start.isAfter(now)) {
      slices.push(start.format("HH:mm"));
    } else if (!start.isSame(now, "day")) {
      slices.push(start.format("HH:mm"));
    }

    start.add(duration, "minutes");
  }

  return slices;
}
export function hourToMinutes(hourMinute) {
  const [hour, minutes] = hourMinute.split(":");
  return parseInt(hour) * 60 + parseInt(minutes);
}
export function splitByValue(array, value) {
  const newArray = [];
  let chunk = [];

  array.forEach((item) => {
    if (item !== value) {
      chunk.push(item);
    } else {
      newArray.push(chunk);
      chunk = [];
    }
  });

  if (chunk.length) {
    newArray.push(chunk);
  }

  return newArray;
}
