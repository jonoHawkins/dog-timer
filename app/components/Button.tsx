import { ReactChildren, ReactNode } from "react";

export function Button(props: { children: ReactNode }) {
    return <button
        type="submit"
        className="p-3 bg-orange-400 text-gray-900 rounded-full w-full my-4 font-black"
    >
        {props.children}
    </button>;
}
