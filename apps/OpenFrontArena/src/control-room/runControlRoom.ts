import { startControlRoomServer } from "./server/server";

const port = Number(process.env.OPENFRONT_BOTS_CONTROL_ROOM_PORT ?? 4318);

startControlRoomServer(port);
console.log(`Control Room running on http://localhost:${port}`);
