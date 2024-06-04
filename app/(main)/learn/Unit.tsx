import { lessons, units } from "@/db/schema";
import React from 'react'
import UnitBanner from "./UnitBanner";
import LessonButton from "./LessonButton";

type Props = {
    id: number;
    order: number;
    description: string;
    title: string;
    lessons: (typeof lessons.$inferSelect & {
        completed: boolean;
    })[];
    activeLesson: typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
    } | undefined;
    activeLessonPercentage: number;
}

const Unit = ({ 
    id, 
    order, 
    description, 
    title, 
    lessons, 
    activeLesson, 
    activeLessonPercentage }: Props) => {
  return (
    <>
        <UnitBanner title={title} description={description} />
        <div className="flex items-center flex-col relative">
            {lessons.map((lesson, index) => {
                const isCurrent = lesson.id === activeLesson?.id;
                const isLocked = !lesson.completed && !isCurrent;

                return (
                    <LessonButton
                        key={lesson.id}
                        id={lesson.id}
                        index={index}
                        totalCount={lessons.length - 1}
                        locked={isLocked}
                        current={isCurrent}
                        percentage={activeLessonPercentage}
                    />
                )

    })}
        </div>
    </>
  )
}

export default Unit