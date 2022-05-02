import { format, formatDuration, intervalToDuration } from "date-fns";
import { Link } from "remix";
import { FlatTime } from "../utils/time-utils";

export default function TimesListing(props: {
    times: Array<FlatTime>;
    redirect?: string;
    showDate?: boolean;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left mb-4" style={{ minWidth: 500 }}>
                <thead>
                    <tr>
                        {props.showDate && (
                            <th className="border-b border-slate-600 font-medium p-3 text-slate-300">
                                Date
                            </th>
                        )}
                        <th className="border-b border-slate-600 font-medium p-3 text-slate-300">
                            Time Out
                        </th>
                        <th className="border-b border-slate-600 font-medium p-3 text-slate-300">
                            Time Away
                        </th>
                        <th className="border-b border-slate-600 font-medium p-3 text-slate-300 ">
                            Split
                        </th>
                        <th className="border-b border-slate-600 font-medium p-3 text-slate-300 ">
                            Notes
                        </th>
                        <th className="border-b border-slate-600 font-medium p-3 text-slate-300 ">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-slate-800">
                    {props.times.map((time) => {
                        const interval = {
                            start: new Date(time.start),
                            end: time.end ? new Date(time.end) : new Date(), // do something less jank here...
                        };

                        return (
                            <tr
                                key={time.id}
                                className="border-slate-700 last:border-slate-600 even:bg-slate-900/25"
                            >
                                {props.showDate && (
                                    <td className="border-b border-inherit p-3 text-slate-400">
                                        {format(
                                            new Date(time.start),
                                            "dd/MM/yyyy"
                                        )}
                                    </td>
                                )}
                                <td className="border-b border-inherit p-3 text-slate-400">
                                    {format(new Date(time.start), "kk:mm")}
                                </td>
                                <td className="border-b border-inherit p-3 text-slate-400">
                                    {time.end
                                        ? format(new Date(time.end), "kk:mm")
                                        : "-"}
                                </td>
                                <td className="border-b border-inherit p-3 text-slate-400">
                                    {formatDuration(
                                        intervalToDuration(interval)
                                    )}
                                </td>
                                <td className="border-b border-inherit p-3 text-slate-400 ">
                                    {time.note}
                                </td>
                                <td className="border-b border-inherit p-3 text-slate-400 ">
                                    <Link
                                        to={`/times/${time.id}/edit${
                                            props.redirect
                                                ? `?redirect=${props.redirect}`
                                                : ""
                                        }`}
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
