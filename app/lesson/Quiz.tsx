"use client";

import { challengeOptions, challenges } from "@/db/schema";

import { useState } from "react";
import Header from "./Header";
import QuestionBubble from "./QuestionBubble";
import Challenge from "./Challenge";
import Footer from "./Footer";
import { stat } from "fs";



type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferInsert & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferInsert)[];
  })[];
  userSubscription: any;
};

const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });


  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onSelect = (id: number) => {
    if(status !== "none") return;

    setSelectedOption(id);
  }

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  }

  const onContinue = () => {
    if(!selectedOption) return;

    if(status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if(status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if(!correctOption) {
      setStatus("wrong");
      setHearts((current) => current - 1);
      return;
    }

    if(correctOption && correctOption.id === selectedOption) {
      setStatus("correct");
      setPercentage((current) => current + 10);
      return;
    } else {
      setStatus("wrong");
      setHearts((current) => current - 1);
      return;
    }
  }

  const title = challenge.type === "ASSIST" 
  ? "Select the correct Meaning" 
  : challenge.question;

  return (
    <>
      <Header 
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />

      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge 
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer
        disabled={!selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};

export default Quiz;
