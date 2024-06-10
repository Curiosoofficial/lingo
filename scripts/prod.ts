import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const insertChallengeOptions = async (challengeId: number, options: { correct: boolean; text: string; imageSrc?: string; audioSrc?: string; }[]) => {
  await db.insert(schema.challengeOptions).values(
    options.map(option => ({
      challengeId,
      ...option,
    }))
  );
};

const insertCourse = async (title: string, imageSrc: string, unitDescriptions: string[], lessonTitles: string[], challengesData: any[]) => {
  const courses = await db
    .insert(schema.courses)
    .values([{ title, imageSrc }])
    .returning();

  for (const course of courses) {
    const units = await db
      .insert(schema.units)
      .values([
        {
          courseId: course.id,
          title: "Unit 1",
          description: unitDescriptions[0],
          order: 1,
        },
        {
          courseId: course.id,
          title: "Unit 2",
          description: unitDescriptions[1],
          order: 2,
        },
      ])
      .returning();

    for (const unit of units) {
      const lessons = await db
        .insert(schema.lessons)
        .values(lessonTitles.map((title, index) => ({
          unitId: unit.id,
          title,
          order: index + 1,
        })))
        .returning();

      for (const lesson of lessons) {
        const challenges = await db
          .insert(schema.challenges)
          .values(challengesData.map((challenge, index) => ({
            lessonId: lesson.id,
            type: challenge.type,
            question: challenge.question,
            order: index + 1,
          })))
          .returning();
          // @ts-ignore
        for (const [index, challenge] of challenges.entries()) {
          await insertChallengeOptions(challenge.id, challengesData[index].options);
        }
      }
    }
  }
};

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data in a batched manner
    await db.delete(schema.userProgress);
    await db.delete(schema.challenges);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.courses);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.userSubscription);

    // Insert Spanish course
    await insertCourse(
      "Spanish",
      "/es.svg",
      ["Learn the basics of Spanish", "Learn intermediate Spanish"],
      ["Nouns", "Verbs", "Adjectives", "Phrases", "Sentences"],
      [
        {
          type: "SELECT",
          question: 'Which one of these is "the man"?',
          options: [
            { correct: true, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
            { correct: false, text: "la mujer", imageSrc: "/woman.svg", audioSrc: "/es_woman.mp3" },
            { correct: false, text: "el chico", imageSrc: "/boy.svg", audioSrc: "/es_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the woman"?',
          options: [
            { correct: true, text: "la mujer", imageSrc: "/woman.svg", audioSrc: "/es_woman.mp3" },
            { correct: false, text: "el chico", imageSrc: "/boy.svg", audioSrc: "/es_boy.mp3" },
            { correct: false, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the boy"?',
          options: [
            { correct: false, text: "la mujer", imageSrc: "/woman.svg", audioSrc: "/es_woman.mp3" },
            { correct: false, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
            { correct: true, text: "el chico", imageSrc: "/boy.svg", audioSrc: "/es_boy.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the man"',
          options: [
            { correct: false, text: "la mujer", audioSrc: "/es_woman.mp3" },
            { correct: true, text: "el hombre", audioSrc: "/es_man.mp3" },
            { correct: false, text: "el chico", audioSrc: "/es_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the zombie"?',
          options: [
            { correct: false, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
            { correct: false, text: "la mujer", imageSrc: "/woman.svg", audioSrc: "/es_woman.mp3" },
            { correct: true, text: "el zombie", imageSrc: "/zombie.svg", audioSrc: "/es_zombie.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the robot"?',
          options: [
            { correct: true, text: "el robot", imageSrc: "/robot.svg", audioSrc: "/es_robot.mp3" },
            { correct: false, text: "el zombie", imageSrc: "/zombie.svg", audioSrc: "/es_zombie.mp3" },
            { correct: false, text: "el chico", imageSrc: "/boy.svg", audioSrc: "/es_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the girl"?',
          options: [
            { correct: true, text: "la nina", imageSrc: "/girl.svg", audioSrc: "/es_girl.mp3" },
            { correct: false, text: "el zombie", imageSrc: "/zombie.svg", audioSrc: "/es_zombie.mp3" },
            { correct: false, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the zombie"',
          options: [
            { correct: false, text: "la mujer", audioSrc: "/es_woman.mp3" },
            { correct: true, text: "el zombie", audioSrc: "/es_zombie.mp3" },
            { correct: false, text: "el chico", audioSrc: "/es_boy.mp3" },
          ],
        },
      ]
    );

    // Insert French course
    await insertCourse(
      "French",
      "/fr.svg",
      ["Learn the basics of French", "Learn intermediate French"],
      ["Nouns", "Verbs", "Adjectives", "Phrases", "Sentences"],
      [
        {
          type: "SELECT",
          question: 'Which one of these is "the man"?',
          options: [
            { correct: true, text: "l'homme", imageSrc: "/man.svg", audioSrc: "/fr_man.mp3" },
            { correct: false, text: "la femme", imageSrc: "/woman.svg", audioSrc: "/fr_woman.mp3" },
            { correct: false, text: "le garçon", imageSrc: "/boy.svg", audioSrc: "/fr_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the woman"?',
          options: [
            { correct: true, text: "la femme", imageSrc: "/woman.svg", audioSrc: "/fr_woman.mp3" },
            { correct: false, text: "le garçon", imageSrc: "/boy.svg", audioSrc: "/fr_boy.mp3" },
            { correct: false, text: "l'homme", imageSrc: "/man.svg", audioSrc: "/fr_man.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the boy"?',
          options: [
            { correct: false, text: "la femme", imageSrc: "/woman.svg", audioSrc: "/fr_woman.mp3" },
            { correct: false, text: "l'homme", imageSrc: "/man.svg", audioSrc: "/fr_man.mp3" },
            { correct: true, text: "le garçon", imageSrc: "/boy.svg", audioSrc: "/fr_boy.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the man"',
          options: [
            { correct: false, text: "la femme", audioSrc: "/fr_woman.mp3" },
            { correct: true, text: "l'homme", audioSrc: "/fr_man.mp3" },
            { correct: false, text: "le garçon", audioSrc: "/fr_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the zombie"?',
          options: [
            { correct: false, text: "l'homme", imageSrc: "/man.svg", audioSrc: "/fr_man.mp3" },
            { correct: false, text: "la femme", imageSrc: "/woman.svg", audioSrc: "/fr_woman.mp3" },
            { correct: true, text: "le zombie", imageSrc: "/zombie.svg", audioSrc: "/fr_zombie.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the robot"?',
          options: [
            { correct: true, text: "le robot", imageSrc: "/robot.svg", audioSrc: "/fr_robot.mp3" },
            { correct: false, text: "le zombie", imageSrc: "/zombie.svg", audioSrc: "/fr_zombie.mp3" },
            { correct: false, text: "le garçon", imageSrc: "/boy.svg", audioSrc: "/fr_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the girl"?',
          options: [
            { correct: true, text: "la fille", imageSrc: "/girl.svg", audioSrc: "/fr_girl.mp3" },
            { correct: false, text: "le zombie", imageSrc: "/zombie.svg", audioSrc: "/fr_zombie.mp3" },
            { correct: false, text: "l'homme", imageSrc: "/man.svg", audioSrc: "/fr_man.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the zombie"',
          options: [
            { correct: false, text: "la femme", audioSrc: "/fr_woman.mp3" },
            { correct: true, text: "le zombie", audioSrc: "/fr_zombie.mp3" },
            { correct: false, text: "le garçon", audioSrc: "/fr_boy.mp3" },
          ],
        },
      ]
    );

    // Insert Croatian course
    await insertCourse(
      "Croatian",
      "/hr.svg",
      ["Learn the basics of Croatian", "Learn intermediate Croatian"],
      ["Nouns", "Verbs", "Adjectives", "Phrases", "Sentences"],
      [
        {
          type: "SELECT",
          question: 'Which one of these is "the man"?',
          options: [
            { correct: true, text: "muškarac", imageSrc: "/man.svg", audioSrc: "/hr_man.mp3" },
            { correct: false, text: "žena", imageSrc: "/woman.svg", audioSrc: "/hr_woman.mp3" },
            { correct: false, text: "dječak", imageSrc: "/boy.svg", audioSrc: "/hr_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the woman"?',
          options: [
            { correct: true, text: "žena", imageSrc: "/woman.svg", audioSrc: "/hr_woman.mp3" },
            { correct: false, text: "dječak", imageSrc: "/boy.svg", audioSrc: "/hr_boy.mp3" },
            { correct: false, text: "muškarac", imageSrc: "/man.svg", audioSrc: "/hr_man.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the boy"?',
          options: [
            { correct: false, text: "žena", imageSrc: "/woman.svg", audioSrc: "/hr_woman.mp3" },
            { correct: false, text: "muškarac", imageSrc: "/man.svg", audioSrc: "/hr_man.mp3" },
            { correct: true, text: "dječak", imageSrc: "/boy.svg", audioSrc: "/hr_boy.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the man"',
          options: [
            { correct: false, text: "žena", audioSrc: "/hr_woman.mp3" },
            { correct: true, text: "muškarac", audioSrc: "/hr_man.mp3" },
            { correct: false, text: "dječak", audioSrc: "/hr_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the zombie"?',
          options: [
            { correct: false, text: "muškarac", imageSrc: "/man.svg", audioSrc: "/hr_man.mp3" },
            { correct: false, text: "žena", imageSrc: "/woman.svg", audioSrc: "/hr_woman.mp3" },
            { correct: true, text: "zombi", imageSrc: "/zombie.svg", audioSrc: "/hr_zombie.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the robot"?',
          options: [
            { correct: true, text: "robot", imageSrc: "/robot.svg", audioSrc: "/hr_robot.mp3" },
            { correct: false, text: "zombi", imageSrc: "/zombie.svg", audioSrc: "/hr_zombie.mp3" },
            { correct: false, text: "dječak", imageSrc: "/boy.svg", audioSrc: "/hr_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the girl"?',
          options: [
            { correct: true, text: "djevojka", imageSrc: "/girl.svg", audioSrc: "/hr_girl.mp3" },
            { correct: false, text: "zombi", imageSrc: "/zombie.svg", audioSrc: "/hr_zombie.mp3" },
            { correct: false, text: "muškarac", imageSrc: "/man.svg", audioSrc: "/hr_man.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the zombie"',
          options: [
            { correct: false, text: "žena", audioSrc: "/hr_woman.mp3" },
            { correct: true, text: "zombi", audioSrc: "/hr_zombie.mp3" },
            { correct: false, text: "dječak", audioSrc: "/hr_boy.mp3" },
          ],
        },
      ]
    );

    // Insert Italian course
    await insertCourse(
      "Italian",
      "/it.svg",
      ["Learn the basics of Italian", "Learn intermediate Italian"],
      ["Nouns", "Verbs", "Adjectives", "Phrases", "Sentences"],
      [
        {
          type: "SELECT",
          question: 'Which one of these is "the man"?',
          options: [
            { correct: true, text: "l'uomo", imageSrc: "/man.svg", audioSrc: "/it_man.mp3" },
            { correct: false, text: "la donna", imageSrc: "/woman.svg", audioSrc: "/it_woman.mp3" },
            { correct: false, text: "il ragazzo", imageSrc: "/boy.svg", audioSrc: "/it_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the woman"?',
          options: [
            { correct: true, text: "la donna", imageSrc: "/woman.svg", audioSrc: "/it_woman.mp3" },
            { correct: false, text: "il ragazzo", imageSrc: "/boy.svg", audioSrc: "/it_boy.mp3" },
            { correct: false, text: "l'uomo", imageSrc: "/man.svg", audioSrc: "/it_man.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the boy"?',
          options: [
            { correct: false, text: "la donna", imageSrc: "/woman.svg", audioSrc: "/it_woman.mp3" },
            { correct: false, text: "l'uomo", imageSrc: "/man.svg", audioSrc: "/it_man.mp3" },
            { correct: true, text: "il ragazzo", imageSrc: "/boy.svg", audioSrc: "/it_boy.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the man"',
          options: [
            { correct: false, text: "la donna", audioSrc: "/it_woman.mp3" },
            { correct: true, text: "l'uomo", audioSrc: "/it_man.mp3" },
            { correct: false, text: "il ragazzo", audioSrc: "/it_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the zombie"?',
          options: [
            { correct: false, text: "l'uomo", imageSrc: "/man.svg", audioSrc: "/it_man.mp3" },
            { correct: false, text: "la donna", imageSrc: "/woman.svg", audioSrc: "/it_woman.mp3" },
            { correct: true, text: "lo zombie", imageSrc: "/zombie.svg", audioSrc: "/it_zombie.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the robot"?',
          options: [
            { correct: true, text: "il robot", imageSrc: "/robot.svg", audioSrc: "/it_robot.mp3" },
            { correct: false, text: "lo zombie", imageSrc: "/zombie.svg", audioSrc: "/it_zombie.mp3" },
            { correct: false, text: "il ragazzo", imageSrc: "/boy.svg", audioSrc: "/it_boy.mp3" },
          ],
        },
        {
          type: "SELECT",
          question: 'Which one of these is "the girl"?',
          options: [
            { correct: true, text: "la ragazza", imageSrc: "/girl.svg", audioSrc: "/it_girl.mp3" },
            { correct: false, text: "lo zombie", imageSrc: "/zombie.svg", audioSrc: "/it_zombie.mp3" },
            { correct: false, text: "l'uomo", imageSrc: "/man.svg", audioSrc: "/it_man.mp3" },
          ],
        },
        {
          type: "ASSIST",
          question: '"the zombie"',
          options: [
            { correct: false, text: "la donna", audioSrc: "/it_woman.mp3" },
            { correct: true, text: "lo zombie", audioSrc: "/it_zombie.mp3" },
            { correct: false, text: "il ragazzo", audioSrc: "/it_boy.mp3" },
          ],
        },
      ]
    );

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

main();
