import { ActionFunction, LoaderFunction, useLoaderData } from "remix";

type LoaderData = {
    content: string;
};

export function loader(): LoaderData {
    return {
        content:
            "Nostrud pariatur nisi commodo occaecat sunt laborum et nostrud aute laboris.",
    };
}

export const action: ActionFunction = ({ request }) => {
    return {
        'value': Math.random(),
    };
};

export default function AboutPage() {
    const data = useLoaderData<LoaderData>();
    return (
        <div className="p-3">
            <h1>About</h1>
            <p>{data.content}</p>
            <form method="POST" action="/about">
                <button className="p-2 bg-orange-400 text-slate-900">
                    Do it!
                </button>
            </form>
        </div>
    );
}
