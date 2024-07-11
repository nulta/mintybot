import { DummySocialInterface } from "social/dummy/DummySocialInterface.ts"
import { MintyBot } from "core/mintybot.ts"

const dummySocial = new DummySocialInterface()
const bot = new MintyBot(dummySocial)

console.log("Bot created:", bot)
