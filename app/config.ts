import { configure, getConsoleSink } from "@logtape/logtape";

await configure({
  reset: true,
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: "cryptaaar", lowestLevel: "debug", sinks: ["console"] },
  ],
});
