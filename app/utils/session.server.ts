import { createCookieSessionStorage } from "remix";

const sessionSecret = process.env.SESSION_SECRET;

console.log(process.env);
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: "RJ_session",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export type AlertMessage = { message: string; level: "success" };

export async function setAlert(request: Request, alert: AlertMessage) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    session.flash("alertMessage", alert);
    return storage.commitSession(session);
}

export async function getAlert(
    request: Request
): Promise<{ alert?: AlertMessage; cookie: string }> {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const flash = session.get("alertMessage");

    return {
        alert:
            flash &&
            typeof flash.message === "string" &&
            flash.level === "success"
                ? { message: flash.message, level: flash.level }
                : undefined,
        cookie: await storage.commitSession(session),
    };
}
