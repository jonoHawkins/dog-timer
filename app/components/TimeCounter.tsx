import { format, intervalToDuration, formatDuration } from "date-fns";
import { useEffect, useState } from "react";

function getTimeSince(date: Date) {
    return intervalToDuration({
        start: date,
        end: new Date(),
    });
}

export default function TimeCounter(props: { startedAt: Date }) {
    const [duration, setDuration] = useState(getTimeSince(props.startedAt));

    useEffect(() => {
        const to = setTimeout(() => {
            setDuration(getTimeSince(props.startedAt))
        }, 1000);

        return () => {
            clearTimeout(to);
        }
    }, [duration, props.startedAt]);

    return (
        <p>
            Started at {format(props.startedAt, "kk:mm")} - {formatDuration(duration)}
        </p>
    );
}
