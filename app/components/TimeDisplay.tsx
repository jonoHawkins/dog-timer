import { Time } from "@prisma/client";
import { format, formatDuration, intervalToDuration } from "date-fns";

export default function TimeDisplay(props: { time: Time }) {
    const interval = {
        start: new Date(props.time.start),
        end: props.time.end ? new Date(props.time.end) : new Date(), // do something less jank here...
    };

    return (
        <>
            <p>
                <strong>{formatDuration(intervalToDuration(interval))}</strong>{" "}
                {format(new Date(props.time.start), "kk:mm dd/MM/yyyy")}{" "}
                {props.time.end &&
                    "to " +
                        format(new Date(props.time.end), "kk:mm dd/MM/yyyy")}
                .
            </p>
            <p>{props.time.note}</p>
        </>
    );
}
