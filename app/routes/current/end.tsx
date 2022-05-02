import { ActionFunction, redirect } from "remix";
import { db } from "../../utils/db.server";
import { getCurrent } from "../../utils/time-service.server";

export const action: ActionFunction = async ({ request }) => {
    let current = await getCurrent();

    if (!current) {
        /** @todo probably throw or something? */
        throw new Error("No current time!");
    }

    await db.time.update({
        where: { id: current.id },
        data: { end: new Date() },
    });

    return redirect("/");
};
