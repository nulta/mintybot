import { delay } from "@std/async"
import {
    IMySocialPost,
    ISocialInterface,
    ISocialPost,
    ISocialUser,
    PostVisiblity,
    WritePostParam,
} from "social/interface.ts"

export class DummySocialInterface implements ISocialInterface {
    readonly host: string
    readonly name: string
    me: ISocialUser

    constructor() {
        this.host = "dummy-" + Math.random().toString(36).slice(2, 6)
        this.name = "Dummy Social Interface"
        this.me = new DummySocialUser(this, "@me@" + this.host)

        console.log("DummySocialInterface created:", this.host)
    }

    async getPost(id: string) {
        await delay(50)

        return new DummySocialPost(this.me, {
            content: "This is a dummy post",
            visibility: "public",
        }, id)
    }

    async getUser(acct: string) {
        await delay(50)

        return new DummySocialUser(this, acct)
    }

    async writePost(param: WritePostParam) {
        await delay(100)
        param.visibility = param.visibility ?? "unlisted"

        const post = new MyDummySocialPost(this.me, param)
        console.log(`${this.host}: New post: `, post)
        return post
    }
}

class DummySocialUser implements ISocialUser {
    readonly acct: string
    readonly social: ISocialInterface
    readonly nickname: string
    readonly avatarUri: string | null
    readonly bio: string
    readonly mention: string

    readonly isMe: boolean
    readonly isFollowLocked: boolean
    readonly isBeingFollowed: boolean
    readonly isMyFollower: boolean
    readonly isBot: boolean

    constructor(social: ISocialInterface, acct: string) {
        this.acct = acct
        this.social = social

        this.nickname = acct
        this.avatarUri = null
        this.bio = "Bio of " + acct
        this.mention = acct

        this.isMe = acct == "@me@" + social.host
        this.isFollowLocked = false
        this.isBeingFollowed = false
        this.isMyFollower = false
        this.isBot = this.isMe
    }

    async follow() {
        await delay(50)
    }

    async unfollow() {
        await delay(50)
    }

    async sendDM(param: WritePostParam) {
        return await this.social.writePost({
            ...param,
            visibility: "direct",
            content: this.mention + " " + param.content,
        })
    }

    async getPinnedPosts() {
        await delay(50)
        return []
    }
}

class DummySocialPost implements ISocialPost {
    readonly id: string
    readonly user: ISocialUser
    readonly createdAt: Date

    readonly content: string
    readonly cw: string | null
    readonly visibility: PostVisiblity
    readonly hasNsfwMedia: boolean
    readonly replyTo: ISocialPost | null
    readonly rawContent: string
    renotes: number
    likes: number
    replies: number

    constructor(user: ISocialUser, param: WritePostParam, id?: string) {
        this.id = id ?? crypto.randomUUID()
        this.user = user

        this.createdAt = new Date()
        this.content = param.content
        this.cw = param.cw ?? null
        this.visibility = param.visibility ?? "public"
        this.hasNsfwMedia = param.isMediaNsfw ?? false

        this.replyTo = param.replyTo ?? null
        this.rawContent = this.content

        this.renotes = 0
        this.likes = 1
        this.replies = 0
    }

    async reply(param: WritePostParam) {
        return await this.user.social.writePost({ ...param, replyTo: this })
    }

    async renote() {
        await delay(50)
        console.log(`Renoted: `, this)
        this.renotes += 1
    }

    async like() {
        await delay(50)

        console.log(`Liked: `, this)
        this.likes += 1
    }

    async react(emoji: string): Promise<void> {
        console.log(`Reacted "${emoji}": `, this)
        return await this.like()
    }

    async reactOrLike(emoji: string): Promise<void> {
        return await this.react(emoji)
    }
}

class MyDummySocialPost extends DummySocialPost implements IMySocialPost {
    async delete() {
        console.log(`Deleted Post: `, this)
        await delay(50)
    }

    async pin() {
        console.log(`Pinned Post: `, this)
        await delay(50)
    }

    async unpin() {
        console.log(`Unpinned Post: `, this)
        await delay(50)
    }
}
