import { Time } from "@prisma/client";

export type FlatTime = Omit<Time, "start" | "end"> & {
    start: string;
    end: string | null;
};

export function hydrateTimeOrNull(time: FlatTime | null): Time | null {
    return time ? hydrateTime(time) : null;
}

export function hydrateTime(time: FlatTime): Time {
    return {
        ...time,
        start: new Date(time.start),
        end: time.end ? new Date(time.end) : null,
    };
}

export function flattenTime<T extends Time | null>(time: T | FlatTime) {
    if (time === null) {
        return null;
    }

    return {
        ...time,
        start: toIsoString(time.start),
        end: toIsoString(time.end),
    };
}

function toIsoString<T>(date: Date | T) {
    return date instanceof Date ? date.toISOString() : date;
}
