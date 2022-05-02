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
    useLocation,
} from "remix";
import { Button } from "../../../components/Button";
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

type TimeValues = {
    date: string;
    startTime: string;
    endTime: string;
    note: string;
};

type ActionData = {
    success: false;
    errors: {
        date?: string;
        startTime?: string;
        endTime?: string;
        note?: string;
    };
    values: Partial<TimeValues>;
};

function getFormValues(form: FormData): Partial<TimeValues> {
    let date = form.get("date");
    let startTime = form.get("startTime");
    let endTime = form.get("endTime");
    let note = form.get("note");

    return {
        date: typeof date === "string" ? date : undefined,
        startTime: typeof startTime === "string" ? startTime : undefined,
        endTime: typeof endTime === "string" ? endTime : undefined,
        note: typeof note === "string" ? note : undefined,
    };
}

export const action: ActionFunction = async ({
    request,
    params,
}): Promise<ActionData | Response> => {
    const time = flattenTime(
        await db.time.findFirst({ where: { id: params.timeId } })
    );

    if (!time) {
        throw new Response("Not Found", { status: 404 });
    }

    const form = await request.formData();
    let values = getFormValues(form);

    let date = getTimeDateError(values?.date);
    let startTime;
    let endTime;
    let note;

    if (typeof values.startTime !== "string") {
        startTime = "Start time is required";
    } else if (!validateTimeString(values.startTime)) {
        startTime = "Must be a valid time hh:mm:ss";
    }

    if (typeof values.endTime !== "string") {
        endTime = "Start time is required";
    } else if (!validateTimeString(values.endTime)) {
        endTime = "Must be a valid time hh:mm:ss";
    }

    if (typeof values.note === "string" && values.note.length > 255) {
        note = "Your note is too long";
    }

    let errors = {
        date,
        startTime,
        endTime,
        note,
    };

    if (
        values.startTime &&
        values.endTime &&
        !errors.startTime &&
        !errors.endTime
    ) {
        if (values.startTime >= values.endTime) {
            errors.endTime = "End Time must be after start time";
        }
    }

    if (Object.values(errors).filter(Boolean).length) {
        return {
            success: false,
            errors,
            values,
        };
    }

    await db.time.update({
        where: { id: params.timeId },
        data: {
            ...time,
            note: values.note,
            start: new Date(values.date + " " + values.startTime),
            end: new Date(values.date + " " + values.endTime),
        },
    });

    const cookie = await setAlert(request, {
        level: "success",
        message: "Time updated!",
    });

    const dest =
        form.get("redirect") === "HOME" ? "/" : `/times/${params.timeId}`;

    return redirect(dest, {
        headers: {
            "Set-Cookie": cookie,
        },
    });
};

function getTimeDateError(date?: any) {
    if (typeof date !== "string") {
        return "Date is required.";
    }

    if (!isValidDate(date)) {
        return "Date is not valid";
    }
}

/**
 * Validates hh:mm:ss
 */
function validateTimeString(time: string) {
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
}

function isValidDate(date: any) {
    return !isNaN(Date.parse(date));
}

export default function EditTimePage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    console.log(params.get('redirect'))

    const data = useLoaderData<LoaderData>();
    const time = hydrateTime(data.time);
    const action = useActionData<ActionData>();

    return (
        <div className="p-4 w-max mx-auto">
            <p>
                <Link to="/">
                    <ChevronLeftIcon className="h-5 w-5 inline-block align-middle" />{" "}
                    Home
                </Link>
            </p>
            <Form method="post">
                {params.get('redirect') === 'HOME' && <input type="hidden" name="redirect" value="HOME" />}
                <fieldset className="flex flex-col gap-3">
                    <legend className="font-black">Edit Time</legend>
                    <label htmlFor="date">Date</label>
                    {action?.errors.date && (
                        <p className="text-red-700">{action?.errors.date}</p>
                    )}
                    <input
                        className="py-2 px-3 rounded-lg bg-slate-700"
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={format(time.start, "yyyy-MM-dd")}
                    />
                    <label htmlFor="startTime">Start Time</label>
                    {action?.errors.startTime && (
                        <p className="text-red-700">
                            {action?.errors.startTime}
                        </p>
                    )}
                    <input
                        className="py-2 px-3 rounded-lg bg-slate-700"
                        id="startTime"
                        name="startTime"
                        type="time"
                        defaultValue={format(time.start, "kk:mm:ss")}
                    />
                    <label htmlFor="endTime">End Time</label>
                    {action?.errors.endTime && (
                        <p className="text-red-700">{action?.errors.endTime}</p>
                    )}
                    <input
                        className="py-2 px-3 rounded-lg bg-slate-700"
                        id="endTime"
                        name="endTime"
                        type="time"
                        defaultValue={
                            time.end ? format(time.end, "kk:mm:ss") : undefined
                        }
                    />
                    <label htmlFor="note">Note</label>

                    {action?.errors.note && (
                        <p className="text-red-700">{action?.errors.note}</p>
                    )}
                    <textarea
                        rows={5}
                        className="py-2 px-3 rounded-lg bg-slate-700"
                        id="note"
                        name="note"
                        defaultValue={time.note}
                    />
                    <Button>Save</Button>
                </fieldset>
            </Form>
        </div>
    );
}
