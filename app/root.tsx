import { StarIcon } from "@heroicons/react/solid";
import type { MetaFunction } from "remix";
import {
    json,
    Links,
    LinksFunction,
    LiveReload,
    LoaderFunction,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData
} from "remix";
import tailwindUrl from "~/styles/tailwind.css";
import { AlertMessage, getAlert } from "./utils/session.server";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: tailwindUrl }];
};

export const meta: MetaFunction = () => {
    return { title: "Cleo the dogs App" };
};

type LoaderData = {
    alert?: AlertMessage;
};

export const loader: LoaderFunction = async ({
    request,
}): Promise<Response> => {
    const { alert, cookie } = await getAlert(request);

    return json<LoaderData>(
        { alert },
        {
            headers: {
                "Set-Cookie": cookie,
            },
        }
    );
};

export default function App() {
    const data = useLoaderData<LoaderData>();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <link
                    rel="icon"
                    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦴</text></svg>"
                />
                <Meta />
                <Links />
            </head>
            <body className="antialiased text-slate-400 bg-white bg-slate-900">
                {data.alert && (
                    <div className="bg-green-200 border-1 border-green-700 text-green-700 border-r-8 p-3 text-center">
                        <StarIcon className="w-3 h-3 inline-block" />
                        <StarIcon className="w-4 h-4 inline-block" />
                        <StarIcon className="w-5 h-5 inline-block" />
                        <span className="px-2">{data.alert.message}</span>
                        <StarIcon className="w-5 h-5 inline-block" />
                        <StarIcon className="w-4 h-4 inline-block" />
                        <StarIcon className="w-3 h-3 inline-block" />
                    </div>
                )}
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    );
}
