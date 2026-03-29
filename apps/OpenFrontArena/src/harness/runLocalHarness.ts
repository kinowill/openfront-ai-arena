import { runLocalHarnessTick } from "./localHarness";

const result = await runLocalHarnessTick();

console.log(
  JSON.stringify(
    {
      selectedActionId: result.decisionRecord.executedActionId,
      strategicSummary: result.observation.strategicSummary,
      validationErrors: result.decisionRecord.validationErrors,
      execution: result.execution,
    },
    null,
    2,
  ),
);
