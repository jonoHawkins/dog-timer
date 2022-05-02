import { Time } from "@prisma/client";
import { format, formatDuration, intervalToDuration } from "date-fns";
import EditNote from "./EditTime";

export default function FeatureTime(props: { time: Time }) {
    const interval = {
        start: new Date(props.time.start),
        end: props.time.end ? new Date(props.time.end) : new Date(), // do something less jank here...
    };

    return (
        <>
            <div className="bg-slate-800 p-3 rounded-xl mb-3">
                <p>
                    <strong>
                        {formatDuration(intervalToDuration(interval))}
                    </strong>{" "}
                    {format(new Date(props.time.start), "kk:mm dd/MM/yyyy")}{" "}
                    {props.time.end &&
                        "to " +
                            format(
                                new Date(props.time.end),
                                "kk:mm dd/MM/yyyy"
                            )}
                    .
                </p>
                <EditNote timeId={props.time.id} note={props.time.note} />
            </div>
        </>
    );
}
