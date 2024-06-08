"use server"

import { getUserProgress } from "@/db/queries"
import { auth } from "@clerk/nextjs/server"

export const upserChallengeProgress = async (challengeId: number) => {
    const { userId } = auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const currentUserProgress = await getUserProgress()
}