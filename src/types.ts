export interface Question {
  id: string;
  question: string;
  example: string;
  option1: string;
  option2: string;
}

export const QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Are you sure?',
    example: 'Soup without meatballs, is that still soup?',
    option1: 'I want meatballs!',
    option2: 'No meatballs please',
  },
  {
    id: '2',
    question: 'Really?',
    example: 'A car without wheels, is that still a car?',
    option1: 'Give me wheels!',
    option2: 'Just roll me away',
  },
  {
    id: '3',
    question: 'Last chance...',
    example: 'Pizza without cheese, is that still pizza?',
    option1: 'Cheese on it!',
    option2: 'Cheeseless is fine',
  },
  {
    id: '4',
    question: 'Unbelievable!',
    example: 'Beer without alcohol, what is that?',
    option1: 'Beer with kick!',
    option2: 'Non-alcoholic is fine',
  },
  {
    id: '5',
    question: 'Seriously?',
    example: 'A beach without water, is that still a beach?',
    option1: 'Water please!',
    option2: 'Dry is fine too',
  },
  {
    id: '6',
    question: 'Okay, last time!',
    example: 'A party without music, is that still a party?',
    option1: 'Turn on the music!',
    option2: 'Silence is golden',
  },
];

