import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
const db = new PrismaClient();

async function seed() {
    await Promise.all(
        getTimes().map((time) => {
            return db.time.create({ data: time });
        })
    );
}

seed();

function getTimes() {
    return [
        {
            start: new Date("2022/01/28 05:55"),
            end: new Date("2022/01/28 07:15"),
            note: "Orientation game at home. Then Reading Road and Station Road. Middle, two, orientation out and about. Practice on railway bridge stairs! up 5 down 5.",
        },
        {
            start: new Date("2022/01/28 10:40"),
            end: new Date("2022/01/28 11:40"),
            note: "Mark here working today",
        },
        {
            start: new Date("2022/01/28 14:05"),
            end: new Date("2022/01/28 15:02"),
            note: "",
        },
        {
            start: new Date("2022/01/28 15:33"),
            end: new Date("2022/01/28 16:00"),
            note: "",
        },
        {
            start: new Date("2022/01/28 17:05"),
            end: new Date("2022/01/28 18:00"),
            note: "",
        },
        {
            start: new Date("2022/01/28 19:40"),
            end: new Date("2022/01/28 20:05"),
            note: "couldn't settle this eve - stimulating few days? quiet tomorrow then woods Sunday instead of sat I think",
        },
        {
            start: new Date("2022/01/29 08:00"),
            end: new Date("2022/01/29 09:00"),
            note: "",
        },
        {
            start: new Date("2022/01/29 11:15"),
            end: new Date("2022/01/29 13:00"),
            note: "",
        },
        {
            start: new Date("2022/01/29 15:30"),
            end: new Date("2022/01/29 16:35"),
            note: "",
        },
        {
            start: new Date("2022/01/29 18:27"),
            end: new Date("2022/01/29 19:30"),
            note: "",
        },
        {
            start: new Date("2022/01/29 22:20"),
            end: new Date("2022/01/29 22:55"),
            note: "",
        },
        {
            start: new Date("2022/01/30 07:45"),
            end: new Date("2022/01/30 09:15"),
            note: "",
        },
        {
            start: new Date("2022/01/30 11:00"),
            end: new Date("2022/01/30 13:15"),
            note: "Sadlers lane field and woods. Puppachino at Blue Orchid Bakery",
        },
        {
            start: new Date("2022/01/30 15:00"),
            end: new Date("2022/01/30 16:00"),
            note: "",
        },
        {
            start: new Date("2022/01/30 18:15"),
            end: new Date("2022/01/30 19:15"),
            note: "",
        },
        {
            start: new Date(format(new Date(), "yyyy/MM/dd 05:55")),
            end: new Date(format(new Date(), "yyyy/MM/dd 07:15")),
            note: "20 min walk: middle. Boundary games, orientation, paint the town, mouse game. Snoozy this morning so we focused on gentle, easy wins",
        },
        {
            start: new Date(format(new Date(), "yyyy/MM/dd 10:02")),
            end: new Date(format(new Date(), "yyyy/MM/dd 11:23")),
            note: "",
        },
        {
            start: new Date(format(new Date(), "yyyy/MM/dd 13:42")),
            end: new Date(format(new Date(), "yyyy/MM/dd 14:44")),
            note: "Just decided it was bed time, apprently...",
        },
        {
            start: new Date(format(new Date(), "yyyy/MM/dd 17:12")),
        },
    ];
}
