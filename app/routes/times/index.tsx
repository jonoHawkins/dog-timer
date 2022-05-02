import { Link, LoaderFunction, useLoaderData, useLocation } from "remix";
import TimesListing from "../../components/TimesListing";
import { db } from "../../utils/db.server";
import { FlatTime } from "../../utils/time-utils";
import endOfDay from "date-fns/endOfDay";
import startOfDay from "date-fns/startOfDay";

type LoaderData = {
    times: Array<FlatTime>;
    date: string | null;
    count: number;
    take: number;
    skip: number;
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const take = 2;
    let skip = parseInt(url.searchParams.get("skip") ?? "0");

    if (isNaN(skip) || skip < 0) {
        skip = 0;
    }

    let date = url.searchParams.get("date");
    let where;

    if (date) {
        let parsed = new Date(date);
        where = {
            start: {
                gte: startOfDay(parsed),
            },
            end: {
                lt: endOfDay(parsed),
            },
        };
    }

    const [times, count] = await Promise.all([
        db.time.findMany({
            where,
            take,
            skip,
            orderBy: {
                start: "desc",
            },
        }),
        db.time.count({ where }),
    ]);

    return {
        times,
        count,
        take,
        skip,
        date,
    };
};

function replaceSearch(
    search: string,
    changes: { [k: string]: string | number }
) {
    const params = new URLSearchParams(search);
    for (const [k, v] of Object.entries(changes)) {
        params.set(k, v.toString());
    }
    return params;
}

export default function TimesIndexPage() {
    const location = useLocation();
    const data = useLoaderData<LoaderData>();

    return (
        <>
            <form method="get" className="p-4">
                <h1>
                    Showing Times: {data.skip + 1} to {data.skip + data.take} of{" "}
                    {data.count}
                </h1>
                <input
                    defaultValue={data.date ?? undefined}
                    type="date"
                    name="date"
                    className="bg-transparent rounded rounded-r-none border-slate-600 border-r-0"
                />
                <button className="rounded-l-none border border-slate-600 px-3 py-2 rounded bg-slate-800 text-slate-400 hover:bg-slate-400 hover:text-slate-700">
                    Update
                </button>
            </form>
            <TimesListing showDate times={data.times} />
            <div className="flex justify-between p-4">
                {data.skip - data.take >= 0 && (
                    <Link
                        className="border border-slate-600 px-3 py-2 rounded bg-slate-800 text-slate-400 hover:bg-slate-400 hover:text-slate-700"
                        to={
                            ".?" +
                            replaceSearch(location.search, {
                                skip: data.skip - data.take,
                            }).toString()
                        }
                    >
                        Prev
                    </Link>
                )}
                {data.skip + data.take <= data.count && (
                    <Link
                        className="ml-auto border border-slate-600 px-3 py-2 rounded bg-slate-800 text-slate-400 hover:bg-slate-400 hover:text-slate-700"
                        to={
                            ".?" +
                            replaceSearch(location.search, {
                                skip: data.skip + data.take,
                            }).toString()
                        }
                    >
                        Next
                    </Link>
                )}
            </div>
        </>
    );
}
