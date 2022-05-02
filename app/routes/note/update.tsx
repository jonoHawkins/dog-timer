import { Time } from "@prisma/client";
import { ActionFunction, json, redirect } from "remix";
import { db } from "../../utils/db.server";

export type ActionResponse =
    | {
          success: false;
          error: string;
      }
    | {
          success: true;
          time: Time;
      };

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const id = form.get("timeId");
    const note = form.get("note");

    if (typeof id !== "string") {
        throw new Error("Nope");
    }

    if (typeof note !== "string" || !note) {
        return json(
            {
                success: false,
                error: "Please add a note!",
            },
            { status: 400 }
        );
    }

    if (note.length > 255) {
        return json(
            {
                success: false,
                error: "You note is too long",
            },
            { status: 400 }
        );
    }

    const time = await db.time.update({
        where: { id },
        data: { note },
    });

    return json(
        {
            success: true,
            time,
        },
        { status: 200 }
    );
};
