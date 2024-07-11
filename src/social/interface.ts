export type PostVisiblity = "public" | "unlisted" | "followers" | "direct"

export type WritePostParam = {
    content: string
    cw?: string

    visibility?: PostVisiblity
    replyTo?: ISocialPost
    images?: Blob[]
    isMediaNsfw?: boolean
    poll?: {
        choices: string[]
        endTime: Date
        multiple: boolean
    }
}

export interface ISocialInterface {
    readonly host: string
    readonly name: string
    me: ISocialUser

    getPost(id: string): Promise<ISocialPost | IMySocialPost | null>
    getUser(acct: string): Promise<ISocialUser | null>
    writePost(param: WritePostParam): Promise<IMySocialPost>
}

export interface ISocialUser {
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

    follow(): Promise<void>
    unfollow(): Promise<void>
    sendDM(param: WritePostParam): Promise<IMySocialPost>
    getPinnedPosts(): Promise<ISocialPost[]>
}

export interface ISocialPost {
    readonly id: string
    readonly user: ISocialUser

    readonly createdAt: Date
    readonly content: string
    readonly cw: string | null
    readonly visibility: PostVisiblity
    readonly hasNsfwMedia: boolean
    readonly replyTo: ISocialPost | null
    readonly rawContent: string
    readonly renotes: number
    readonly likes: number
    readonly replies: number

    reply(param: WritePostParam): Promise<IMySocialPost>
    renote(): Promise<void>
    like(): Promise<void>
    react?(emoji: string): Promise<void>
    reactOrLike(emoji: string): Promise<void>
}

export interface IMySocialPost extends ISocialPost {
    delete(): Promise<void>
    pin(): Promise<void>
    unpin(): Promise<void>
}
