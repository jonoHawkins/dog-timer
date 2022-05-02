import { ChevronLeftIcon } from "@heroicons/react/solid";
import format from "date-fns/format";
import {
    ActionFunction,
    Form,
    Link,
    LoaderFunction,
    redirect,
    useActionData,
    useLoaderData,
} from "remix";
import { Button } from "../../../components/Button";
import TimeDisplay from "../../../components/TimeDisplay";
import { db } from "../../../utils/db.server";
import { setAlert } from "../../../utils/session.server";
import { flattenTime, FlatTime, hydrateTime } from "../../../utils/time-utils";
import { NullablePartial } from "../../../utils/types/NullablePartial";

type LoaderData = {
    time: FlatTime;
};

export const loader: LoaderFunction = async ({
    params,
}): Promise<LoaderData> => {
    const time = flattenTime(
        await db.time.findFirst({ where: { id: params.timeId } })
    );

    if (!time) {
        throw new Response("Not Found", { status: 404 });
    }

    return { time };
};

export default function TimePage() {
    const data = useLoaderData<LoaderData>();
    const time = hydrateTime(data.time);

    return (
        <div className="p-4 w-max mx-auto">
            <p>
                <Link to="/">
                    <ChevronLeftIcon className="h-5 w-5 inline-block align-middle" />{" "}
                    Home
                </Link>
            </p>
            <TimeDisplay time={time} />
        </div>
    );
}
