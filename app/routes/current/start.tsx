import { ActionFunction, redirect } from "remix";
import { db } from "../../utils/db.server";
import { getCurrent } from "../../utils/time-service.server";

export const action: ActionFunction = async ({ request }) => {
    let current = await getCurrent();

    if (current) {
        /** @todo probably throw or something? */
        throw new Error('Already started!');
    }

    await db.time.create({
        data: {
            start: new Date(),
        }
    });

    return redirect("/");
};
