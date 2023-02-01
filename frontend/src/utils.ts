import { format, parseISO } from 'date-fns';
import { Race, User } from './types';

export const capitalize = (string: string) => {
  const capitalized = string
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  return capitalized;
};

export const raceTimeToSeconds = ({
  hours = '0',
  minutes,
  seconds,
}: {
  hours: string;
  minutes: string;
  seconds: string;
}) => {
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export const secondsToRaceTime = (timeInSeconds?: number) => {
  if (!timeInSeconds) {
    return '0:0:0';
  }
  let secondsLeft = timeInSeconds;
  const hours = Math.floor(Math.abs(timeInSeconds) / 3600);
  secondsLeft = secondsLeft - hours * 3600;
  const minutes = Math.floor(Math.abs(secondsLeft) / 60);
  secondsLeft = secondsLeft - minutes * 60;
  const seconds = Math.abs(secondsLeft).toLocaleString('US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return hours
    ? `${hours}:${minutes.toLocaleString('US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}:${seconds}`
    : `${minutes}:${seconds}`;
};

export const racesByUserId = (races: Race[]) => {
  if (races) {
    const byId = races.reduce((accum, race) => {
      const userId = race.userId;
      if (!userId) {
        return accum;
      }
      if (!accum[userId]) {
        accum[userId] = [race];
      } else {
        accum[userId].push(race);
      }

      return accum;
    }, {} as { [key: string]: Race[] });

    return byId;
  }

  return {};
};

export const secondsToPace = (timeInSeconds?: number, distanceInMeters = 5000) => {
  if (!timeInSeconds) {
    return '';
  }
  const distanceInMiles = distanceInMeters / 1609.34;
  const secondsPerMile = Math.round(timeInSeconds / distanceInMiles);
  const paceMinutesPerMile = secondsPerMile / 60;
  const paceSecondsPerMile = secondsPerMile % 60;
  const pace = `${Math.floor(paceMinutesPerMile)}:${Math.abs(Math.round(paceSecondsPerMile)).toLocaleString('US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;

  return pace;
};

export const calcPaceDifference = (pace1: string, pace2: string) => {
  const pace1Minutes = Number(pace1.split(':')[0]);
  const pace1Seconds = Number(pace1.split(':')[1]);
  const pace1TotalSeconds = pace1Minutes * 60 + pace1Seconds;

  const pace2Minutes = Number(pace2.split(':')[0]);
  const pace2Seconds = Number(pace2.split(':')[1]);
  const pace2TotalSeconds = pace2Minutes * 60 + pace2Seconds;

  const difference = pace1TotalSeconds - pace2TotalSeconds;

  return secondsToRaceTime(difference);
};

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return format(dateObj, 'MM/dd/yyyy');
};

export const metersToDisplayNameMap: Record<number, string> = {
  1609.34: '1 Mile',
  5000: '5k',
  10000: '10k',
  16093.4: '10 Mile',
  21097.5: '13.1',
  42195: '26.2',
};

export const getInitialRaceFormValues = ({ race, user }: { race?: Race | null; user?: User }) => {
  if (race && user) {
    const raceTime = secondsToRaceTime(race.timeInSeconds);
    let hours = '',
      minutes = '',
      seconds = '';
    const split = raceTime.split(':');
    if (split.length > 2) {
      [hours, minutes, seconds] = split;
    } else {
      [minutes, seconds] = split;
    }

    return {
      userId: user.id?.toString() ?? '',
      raceName: race.raceName,
      firstName: '',
      lastName: '',
      hours,
      minutes,
      seconds,
      date: parseISO(race.raceDate),
      distance: race.distanceInMeters.toString(),
    };
  } else {
    return {
      userId: '',
      firstName: '',
      lastName: '',
      hours: '',
      minutes: '',
      seconds: '',
      raceName: '',
      distance: '',
      date: new Date(),
    };
  }
};
