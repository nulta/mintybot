import { ISocialInterface } from "social/interface.ts"

export class MintyBot {
    private readonly social: ISocialInterface

    constructor(socialInterface: ISocialInterface) {
        this.social = socialInterface

        this.social.writePost({
            content: "Hello, world!",
            visibility: "unlisted",
        })
    }
}
