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
    question: 'Weet je het wel zeker?',
    example: 'Soep eet je toch ook niet zonder ballen?',
    option1: 'Ik wil ballen!',
    option2: 'Balloos graag',
  },
  {
    id: '2',
    question: 'Echt waar?',
    example: 'Een auto zonder wielen, is dat nog een auto?',
    option1: 'Geef me wielen!',
    option2: 'Rol me maar weg',
  },
  {
    id: '3',
    question: 'Laatste kans...',
    example: 'Pizza zonder kaas, is dat nog pizza?',
    option1: 'Kaas erop!',
    option2: 'Kaasloos is prima',
  },
  {
    id: '4',
    question: 'Ongelooflijk!',
    example: 'Bier zonder alcohol, wat is dat nou?',
    option1: 'Bier met pit!',
    option2: 'Fris is fijn',
  },
  {
    id: '5',
    question: 'Serieus?',
    example: 'Een strand zonder water, is dat nog een strand?',
    option1: 'Water erbij!',
    option2: 'Droog is ook fijn',
  },
  {
    id: '6',
    question: 'Oké, laatste keer!',
    example: 'Een feestje zonder muziek, is dat nog een feestje?',
    option1: 'Muziek aan!',
    option2: 'Stilte is goud',
  },
];

