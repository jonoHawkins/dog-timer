import { Time } from "@prisma/client";
import { format } from "date-fns";
import { db } from "./db.server";

export function getCurrent() {
    return db.time.findFirst({
        where: {
            start: {
                gte: new Date(format(new Date(), "yyyy-MM-dd 00:00:00")),
            },
            end: {
                equals: null,
            },
        },
        orderBy: {
            start: "asc",
        },
    });
}