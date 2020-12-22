import { HomeContainerPersonInfoFragment } from 'client/graphqlTypes';

interface FAQ {
  question: string;
  answer: string[];
}

export const frequentlyAskedQuestions: FAQ[] = [
  {
    question:
      "Is Fambly just a contacts tool? Aren't there a lot of those already?",
    answer: [
      "Fambly is indeed a contacts tool, sort of. But it's designed to store a lot of different kinds of information — not just phone numbers and email addresses. It's designed for organizing other types of information conveniently, such as personal histories and family trees. It also allows you to do things other contacts apps do, such as organize people into groups and search your contacts, with a clean, no-fuss interface.",
    ],
  },
  {
    question: "Isn't there some other tool that already does this?",
    answer: [
      'There is — in fact, there is a website called MonicaHQ that does something very similar in concept. We encourage you to check it out. There are also a lot of other tools for organizing contacts — but the vast majority of them focus on business contacts and information such as phone numbers and email addresses.',
      "The reason we built Fambly is that we weren't satisfied with the total package offered by any of the existing tools. We wanted something different, and something we believe to be more user-friendly and customizable.",
    ],
  },
  {
    question: 'Do you have a mobile app?',
    answer: [
      'Unfortunately, no, we do not. But if enough people like the web version of the tool, we will look for the resources to build a mobile app. We know this is a tool that would be most convenient to have on mobile. For now, you can access the site on a mobile browser — we have designed the site to be mobile-friendly.',
    ],
  },
  {
    question: 'How much does Fambly cost? How do you make money?',
    answer: [
      "Fambly is free, for now. This is an experimental idea, and we currently have a very small team, with no institutional backing. If the tool gains a large enough user base, we will start charging money in order to maintain and further improve the site's functionality.",
      "But we want to emphasize that we would provide a great deal of advance warning before we would start charging a subscription fee. And, most importantly, there will always be a way to download the information you've entered into the site, so you're not tied permanently to our tool.",
    ],
  },
  {
    question:
      'If I start to use Fambly and then want to stop, can I download my information?',
    answer: [
      "Yes, absolutely. We think this is really important — we know it can be time-consuming and feel like a major commitment to enter a lot of information into a new tool like ours. So we're working on a method for users to download their info into a spreadsheet. In the meantime, if you want to download the information you've entered, just get in touch with us at zeke@fambly.io and we will figure out how to get it to you.",
    ],
  },
  {
    question: 'How was Fambly started? Who is working on the tool?',
    answer: [
      'The tool is primarily being built by Ezekiel (Zeke) Pfeifer, a software developer and former journalist who had wanted to build something like this for a very long time! He has always wanted a convenient place to organize information about friends, acquaintances, and colleagues, and was never satisfied with the existing options. Zeke started work on Fambly in summer 2020.',
    ],
  },
  {
    question: 'I have a suggestion for a profile field. Can you add it?',
    answer: [
      "We will strongly consider it! Please write to Zeke at zeke@fambly.io with your suggestion and we'll consider adding it to our to-do list.",
    ],
  },
];

export interface CoupleForDatesScroller {
  partnerOneName: string;
  partnerOneId: string;
  partnerTwoName: string;
  partnerTwoId: string;
  weddingYear: number | null | undefined;
  weddingMonth: number | null | undefined;
  weddingDay: number | null | undefined;
}

export interface PersonForDatesScroller {
  id: string;
  firstName: string;
  lastName?: string | null | undefined;
  birthYear?: number | null | undefined;
  birthMonth?: number | null | undefined;
  birthDay?: number | null | undefined;
  age?: number | null | undefined;
  monthsOld?: number | null | undefined;
}

export interface PeopleAndCouplesInfoForDatesScroller {
  people: PersonForDatesScroller[];
  couples: CoupleForDatesScroller[];
}

export type DaysObjectForDatesScroller = {
  [day: number]: PeopleAndCouplesInfoForDatesScroller;
};

export type MonthsObjectForDatesScroller = {
  [month: number]: DaysObjectForDatesScroller;
};

export const getInfoForDatesScroller = (
  people: HomeContainerPersonInfoFragment[],
) => {
  const monthsObject: MonthsObjectForDatesScroller = {};
  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    const {
      id,
      firstName,
      lastName,
      birthYear,
      birthMonth,
      birthDay,
      anniversary,
      age,
      monthsOld,
    } = person;
    if (birthMonth && birthDay) {
      const personObject = {
        id,
        firstName,
        lastName,
        birthYear,
        birthMonth,
        birthDay,
        age,
        monthsOld,
      };
      if (
        monthsObject[birthMonth] &&
        monthsObject[birthMonth][birthDay] &&
        monthsObject[birthMonth][birthDay].people
        // monthsObject[birthMonth][birthDay].people.length > 0
      ) {
        monthsObject[birthMonth][birthDay].people.push(personObject);
      } else {
        if (!monthsObject[birthMonth]) {
          monthsObject[birthMonth] = {};
        }
        monthsObject[birthMonth][birthDay] = {
          people: [],
          couples: [],
        };
        monthsObject[birthMonth][birthDay]['people'] = [personObject];
      }
    }
    if (anniversary && anniversary.weddingMonth && anniversary.weddingDay) {
      const {
        partnerOneName,
        partnerOneId,
        partnerTwoName,
        partnerTwoId,
        weddingYear,
        weddingMonth,
        weddingDay,
      } = anniversary;
      const coupleObject = {
        partnerOneName,
        partnerOneId,
        partnerTwoName,
        partnerTwoId,
        weddingYear,
        weddingMonth,
        weddingDay,
      };
      if (
        monthsObject[weddingMonth] &&
        monthsObject[weddingMonth][weddingDay] &&
        monthsObject[weddingMonth][weddingDay].couples
        // monthsObject[weddingMonth][weddingDay].couples.length > 0
      ) {
        let anniversaryAlreadyPresent = false;
        const couples = monthsObject[weddingMonth][weddingDay].couples;
        for (let i = 0; i < couples.length; i++) {
          if (
            couples[i].partnerOneId === partnerOneId ||
            couples[i].partnerOneId === partnerTwoId
          ) {
            anniversaryAlreadyPresent = true;
            i = couples.length;
          }
        }
        if (!anniversaryAlreadyPresent) {
          monthsObject[weddingMonth][weddingDay].couples.push(coupleObject);
        }
      } else {
        if (!monthsObject[weddingMonth]) {
          monthsObject[weddingMonth] = {};
        }
        monthsObject[weddingMonth][weddingDay] = {
          people: [],
          couples: [],
        };
        monthsObject[weddingMonth][weddingDay]['couples'] = [coupleObject];
      }
    }
  }
  return monthsObject;
};
