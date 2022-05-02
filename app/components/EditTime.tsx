import { useFetcher } from "remix";
import type { ActionResponse } from "~/routes/note/update";

export default function EditNote(props: { timeId: string; note?: string }) {
    const fetcher = useFetcher<ActionResponse>();
    const isSubmitting = fetcher.state === "submitting";

    return (
        <fetcher.Form
            method="post"
            action="/note/update"
            className="flex flex-col"
        >
            {fetcher.data?.success === false && (
                <p className="bg-red-300 text-red-900 rounded-lg py-2 px-3">
                    {fetcher.data.error}
                </p>
            )}
            <input type="hidden" name="timeId" value={props.timeId} />
            <textarea
                className="py-2 px-3 rounded-t-lg bg-slate-700"
                rows={3}
                disabled={isSubmitting}
                name="note"
                defaultValue={props.note}
            />
            <button
                disabled={isSubmitting}
                className="py-2 px-3 rounded-b-lg bg-blue-600 font-bold text-blue-50 transition-all hover:bg-orange-500"
            >
                {props.note
                    ? isSubmitting
                        ? "Updating..."
                        : "Update"
                    : isSubmitting
                    ? "Saving..."
                    : "Add a note"}
            </button>
        </fetcher.Form>
    );
}
