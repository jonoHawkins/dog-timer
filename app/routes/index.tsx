import { Time } from "@prisma/client";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { normalize, sum } from "duration-fns";
import {
    ActionFunction,
    Form,
    Link,
    LoaderFunction,
    useLoaderData,
} from "remix";
import { Button } from "../components/Button";
import TimeCounter from "../components/TimeCounter";
import FeatureTime from "../components/FeatureTime";
import EditNote from "../components/EditTime";
import TimesListing from "../components/TimesListing";
import { db } from "../utils/db.server";
import { notNullish } from "../utils/notNullish";
import { getCurrent } from "../utils/time-service.server";
import { flattenTime, FlatTime } from "../utils/time-utils";

type LoaderData = {
    times: Array<FlatTime>;
    current: FlatTime | null;
    total: Duration;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
    const today = new Date(format(new Date(), "yyyy-MM-dd 00:00:00"));
    const times = await db.time.findMany({
        where: {
            start: {
                gte: today,
            },
            end: {
                not: null,
            },
        },
        orderBy: {
            start: "desc",
        },
    });

    const total = normalize(
        sum(
            ...times
                .map(
                    (time) =>
                        time.end &&
                        intervalToDuration({
                            start: time.start,
                            end: time.end,
                        })
                )
                .filter(notNullish)
        )
    );

    return {
        times: times.map(flattenTime).filter(notNullish),
        total,
        current: flattenTime(await getCurrent()),
    };
};

export default function Index() {
    const data = useLoaderData<LoaderData>();

    return (
        <>
            <div className="p-3 max-w-xl mx-auto text-center">
                <h1 className="text-orange-400">Welcome to Cleo's Timer!</h1>
                {data.current && (
                    <>
                        <h2>Current Time</h2>
                        <TimeCounter startedAt={new Date(data.current.start)} />
                        <EditNote
                            timeId={data.current.id}
                            note={data.current.note}
                        />
                    </>
                )}
                <Form
                    method="post"
                    action={data.current ? "/current/end" : "/current/start"}
                >
                    <Button>{data.current ? "Stop" : "Start"}</Button>
                </Form>
                <h2 className="mt-7">Today: {formatDuration(data.total)}</h2>
            </div>
            <TimesListing times={data.times} redirect="HOME" />
        </>
    );
}
