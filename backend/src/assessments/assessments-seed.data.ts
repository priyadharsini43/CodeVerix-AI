export interface SeedAssessment {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  topic: string;
  questionType: string;
  totalMarks: number;
  allowedLanguages: string;
  starterCode: Record<string, string>;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    marks: number;
  }>;
}

export const SEED_ASSESSMENTS: SeedAssessment[] = [
  {
    "title": "Sum of Two Numbers",
    "description": "Given two space-separated integers, calculate and print their sum.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "5 10",
        "expectedOutput": "15",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-3 7",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 0",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 200",
        "expectedOutput": "300",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-50 -50",
        "expectedOutput": "-100",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9999 1",
        "expectedOutput": "10000",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1000 500",
        "expectedOutput": "-500",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "12345 67890",
        "expectedOutput": "80235",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-9999 9999",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "777 888",
        "expectedOutput": "1665",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Calculate Average of Numbers",
    "description": "Given space-separated numbers on standard input, calculate and print their average rounded to 2 decimal places.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "10 20 30 40",
        "expectedOutput": "25.00",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "5 15",
        "expectedOutput": "10.00",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5 6",
        "expectedOutput": "3.50",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100",
        "expectedOutput": "100.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-10 10",
        "expectedOutput": "0.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2.5 7.5 10",
        "expectedOutput": "6.67",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200 300 400 500",
        "expectedOutput": "300.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0 0",
        "expectedOutput": "0.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "14 28 42",
        "expectedOutput": "28.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 9 9 9 9",
        "expectedOutput": "9.00",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Even or Odd Check",
    "description": "Given a single integer, print `Even` if even, or `Odd` if odd.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Conditionals",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "7",
        "expectedOutput": "Odd",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "42",
        "expectedOutput": "Even",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "Even",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-10",
        "expectedOutput": "Even",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-15",
        "expectedOutput": "Odd",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "999999",
        "expectedOutput": "Odd",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1000000",
        "expectedOutput": "Even",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "Odd",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2",
        "expectedOutput": "Even",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1",
        "expectedOutput": "Odd",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Positive, Negative or Zero",
    "description": "Given a single integer, print `Positive`, `Negative`, or `Zero`.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Conditionals",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "-5",
        "expectedOutput": "Negative",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "Zero",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "99",
        "expectedOutput": "Positive",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-1000",
        "expectedOutput": "Negative",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "Positive",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1",
        "expectedOutput": "Negative",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "500",
        "expectedOutput": "Positive",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-500",
        "expectedOutput": "Negative",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "99999",
        "expectedOutput": "Positive",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-99999",
        "expectedOutput": "Negative",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Factorial Calculation",
    "description": "Given a non-negative integer N (0 <= N <= 12), print its factorial (N!).",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Loops",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "120",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "7",
        "expectedOutput": "5040",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10",
        "expectedOutput": "3628800",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3",
        "expectedOutput": "6",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "4",
        "expectedOutput": "24",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "6",
        "expectedOutput": "720",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "8",
        "expectedOutput": "40320",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "12",
        "expectedOutput": "479001600",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Prime Number Check",
    "description": "Given an integer N, print `Prime` if N is prime, or `Not Prime` otherwise.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "13",
        "expectedOutput": "Prime",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "4",
        "expectedOutput": "Not Prime",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2",
        "expectedOutput": "Prime",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "Not Prime",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "Not Prime",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-7",
        "expectedOutput": "Not Prime",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "29",
        "expectedOutput": "Prime",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100",
        "expectedOutput": "Not Prime",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "97",
        "expectedOutput": "Prime",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "99",
        "expectedOutput": "Not Prime",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Fibonacci Number at Index",
    "description": "Given a non-negative integer N, print the N-th Fibonacci number (F(0)=0, F(1)=1, F(2)=1...).",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Loops",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "6",
        "expectedOutput": "8",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10",
        "expectedOutput": "55",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "20",
        "expectedOutput": "6765",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "4",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "15",
        "expectedOutput": "610",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Reverse an Integer",
    "description": "Given a signed integer, reverse its digits while preserving the negative sign.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "-1234",
        "expectedOutput": "-4321",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1200",
        "expectedOutput": "21",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "987654321",
        "expectedOutput": "123456789",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-900",
        "expectedOutput": "-9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7",
        "expectedOutput": "7",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5",
        "expectedOutput": "-5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1001",
        "expectedOutput": "1001",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "456",
        "expectedOutput": "654",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-850",
        "expectedOutput": "-58",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Palindrome Number Check",
    "description": "Check if an integer reads the same backward as forward. Print `Palindrome` or `Not Palindrome`.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "12321",
        "expectedOutput": "Palindrome",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "12345",
        "expectedOutput": "Not Palindrome",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "9009",
        "expectedOutput": "Palindrome",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-121",
        "expectedOutput": "Not Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10",
        "expectedOutput": "Not Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1111",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "123321",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "8998",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Count Digits in a Number",
    "description": "Given a non-negative integer, print the count of its digits.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "98765",
        "expectedOutput": "5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1000000",
        "expectedOutput": "7",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "9",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "12",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "345",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "6789",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "555555",
        "expectedOutput": "6",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1234567890",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "99999",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Sum of Digits",
    "description": "Given a non-negative integer, calculate and print the sum of its individual digits.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1234",
        "expectedOutput": "10",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "999",
        "expectedOutput": "27",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1020304",
        "expectedOutput": "10",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "8888",
        "expectedOutput": "32",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "123456",
        "expectedOutput": "21",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9000",
        "expectedOutput": "9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "77",
        "expectedOutput": "14",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100001",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Sum of Array Elements",
    "description": "Given space-separated integers, calculate and print their sum.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "15",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-10 20 -30 40",
        "expectedOutput": "20",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 200 300",
        "expectedOutput": "600",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -5 -5",
        "expectedOutput": "-15",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "50",
        "expectedOutput": "50",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 1 1 1 1 1 1 1 1 1",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-100 100",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30",
        "expectedOutput": "60",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "99 1",
        "expectedOutput": "100",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Reverse a String",
    "description": "Given a word, reverse its characters and print the reversed string.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Strings",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "CodeVerix",
        "expectedOutput": "xireVedoC",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "hello",
        "expectedOutput": "olleh",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "antigravity",
        "expectedOutput": "ytivargitna",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "a",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "racecar",
        "expectedOutput": "racecar",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "12345",
        "expectedOutput": "54321",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "OpenAI",
        "expectedOutput": "IAnepO",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Java",
        "expectedOutput": "avaJ",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Python",
        "expectedOutput": "nohtyP",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "TypeScript",
        "expectedOutput": "tpircSepyT",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "String Palindrome Check",
    "description": "Check if a word is palindrome (case-insensitive). Print `Palindrome` or `Not Palindrome`.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Strings",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "Madam",
        "expectedOutput": "Palindrome",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "Racecar",
        "expectedOutput": "Palindrome",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "OpenAI",
        "expectedOutput": "Not Palindrome",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "noon",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "hello",
        "expectedOutput": "Not Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Level",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Kayak",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Algorithm",
        "expectedOutput": "Not Palindrome",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Civic",
        "expectedOutput": "Palindrome",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Count Vowels in a String",
    "description": "Given a string, count and print the total number of vowels (a, e, i, o, u - case insensitive).",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Strings",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "Hello World",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "CodeVerix AI",
        "expectedOutput": "6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "rhythm",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "aeiou",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "AEIOU",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "bcdfgh",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Programming",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "Placement Prep",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "xyz",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Check for Duplicate Elements",
    "description": "Given space-separated integers, print `Duplicates Found` if any integer repeats, else `All Unique`.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 2 3 4 2",
        "expectedOutput": "Duplicates Found",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 20 30 40",
        "expectedOutput": "All Unique",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "5 5 5 5",
        "expectedOutput": "Duplicates Found",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "All Unique",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 -100 100",
        "expectedOutput": "Duplicates Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5 6 7 8 9 10",
        "expectedOutput": "All Unique",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0",
        "expectedOutput": "Duplicates Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -4 -3 -2 -1",
        "expectedOutput": "All Unique",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 8 7 6 5 4 3 2 1 9",
        "expectedOutput": "Duplicates Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "42",
        "expectedOutput": "All Unique",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Sort Array in Ascending Order",
    "description": "Given space-separated integers, sort them in ascending order and print space-separated.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Sorting",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "5 2 8 1 3",
        "expectedOutput": "1 2 3 5 8",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-10 0 5 -5",
        "expectedOutput": "-10 -5 0 5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 90 80 70",
        "expectedOutput": "70 80 90 100",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 1",
        "expectedOutput": "1 2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1 -2 -3",
        "expectedOutput": "-3 -2 -1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 5 10 5",
        "expectedOutput": "5 5 10 10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 1 8 2 7 3",
        "expectedOutput": "1 2 3 7 8 9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100",
        "expectedOutput": "100",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Character Frequency Count",
    "description": "Given a word, print character frequencies in order of first appearance formatted as `char:count` space-separated.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Strings",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "banana",
        "expectedOutput": "b:1 a:3 n:2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "apple",
        "expectedOutput": "a:1 p:2 l:1 e:1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "mississippi",
        "expectedOutput": "m:1 i:4 s:4 p:2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "a:1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "aabbcc",
        "expectedOutput": "a:2 b:2 c:2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "aba",
        "expectedOutput": "a:2 b:1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "xyz",
        "expectedOutput": "x:1 y:1 z:1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "tetris",
        "expectedOutput": "t:2 e:1 r:1 i:1 s:1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "code",
        "expectedOutput": "c:1 o:1 d:1 e:1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "bookkeeper",
        "expectedOutput": "b:1 o:2 k:2 e:3 p:1 r:1",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Find Maximum Element",
    "description": "Given space-separated integers, find and print the maximum integer.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "10 20 5 30 15",
        "expectedOutput": "30",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-5 -10 -2 -50",
        "expectedOutput": "-2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 500 200 999 400",
        "expectedOutput": "999",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "42",
        "expectedOutput": "42",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-100 -50 0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-99 -1",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "777 888 999",
        "expectedOutput": "999",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Find Minimum Element",
    "description": "Given space-separated integers, find and print the minimum integer.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "10 20 5 30 15",
        "expectedOutput": "5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-5 -10 -2 -50",
        "expectedOutput": "-50",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 500 200 999 400",
        "expectedOutput": "100",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "42",
        "expectedOutput": "42",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-100 -50 0",
        "expectedOutput": "-100",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-99 -1",
        "expectedOutput": "-99",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "777 888 999",
        "expectedOutput": "777",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Reverse an Array",
    "description": "Given space-separated integers, print the array in reversed order.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "5 4 3 2 1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 20",
        "expectedOutput": "20 10",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100",
        "expectedOutput": "100",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-1 -2 -3",
        "expectedOutput": "-3 -2 -1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 1",
        "expectedOutput": "1 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 8 7 6",
        "expectedOutput": "6 7 8 9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1 0",
        "expectedOutput": "0 1 2 3 4 5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "77 88 99",
        "expectedOutput": "99 88 77",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 1 1",
        "expectedOutput": "1 1 1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-10 0 10",
        "expectedOutput": "10 0 -10",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Linear Search in Array",
    "description": "Given array elements on the first line and target on the second line, print 0-based index of target, or -1 if not found.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Searching",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "10 20 30 40 50\n30",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5\n10",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1\n5",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100\n100",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30\n30",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30\n40",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -10 -15\n-10",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0\n1",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7 8 9 10\n10",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "12 34 56\n12",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "GCD of Two Numbers",
    "description": "Given two positive integers, calculate and print their Greatest Common Divisor (GCD).",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "12 18",
        "expectedOutput": "6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "20 28",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "7 13",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 10",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "81 153",
        "expectedOutput": "9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "17 17",
        "expectedOutput": "17",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 50",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "48 180",
        "expectedOutput": "12",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "105 252",
        "expectedOutput": "21",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "999 9999",
        "expectedOutput": "9",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Armstrong Number Check",
    "description": "Check if an integer N is an Armstrong number (sum of digits raised to count of digits equals N). Print `Armstrong` or `Not Armstrong`.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Basic Math",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "153",
        "expectedOutput": "Armstrong",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "370",
        "expectedOutput": "Armstrong",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "123",
        "expectedOutput": "Not Armstrong",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "371",
        "expectedOutput": "Armstrong",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "407",
        "expectedOutput": "Armstrong",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9474",
        "expectedOutput": "Armstrong",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "Armstrong",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "Armstrong",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "500",
        "expectedOutput": "Not Armstrong",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9999",
        "expectedOutput": "Not Armstrong",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Second Largest Element in Array",
    "description": "Given space-separated integers, print the second distinct largest element, or -1 if no second largest exists.",
    "difficulty": "Easy",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "10 20 5 30 15",
        "expectedOutput": "20",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 10 10",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "5 1",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 200 300 400",
        "expectedOutput": "300",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -10 -2 -50",
        "expectedOutput": "-5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "42",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "99 99 98",
        "expectedOutput": "98",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 5 4 4",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 -1 -2",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Move Zeroes to End",
    "description": "Given space-separated integers, move all zeroes to the end while maintaining the relative order of non-zero elements.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Two Pointers",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "0 1 0 3 12",
        "expectedOutput": "1 3 12 0 0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 0 1",
        "expectedOutput": "1 0 0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 3",
        "expectedOutput": "1 2 3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "4 2 4 0 0 3 0 5 1 0",
        "expectedOutput": "4 2 4 3 5 1 0 0 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1 0 5 0",
        "expectedOutput": "-1 5 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 0 0 20",
        "expectedOutput": "10 20 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 5",
        "expectedOutput": "5 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 0 8 0 7",
        "expectedOutput": "9 8 7 0 0",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Two Sum Problem",
    "description": "Given array elements on the first line and target on the second line, print the 0-based indices of two numbers that add up to target.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Hash Table",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "2 7 11 15\n9",
        "expectedOutput": "0 1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 2 4\n6",
        "expectedOutput": "1 2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 3\n6",
        "expectedOutput": "0 1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 5 8 12\n13",
        "expectedOutput": "0 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1 -2 -3 -4 -5\n-8",
        "expectedOutput": "2 4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30 40\n50",
        "expectedOutput": "0 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 7 9 11\n16",
        "expectedOutput": "1 2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200 300\n500",
        "expectedOutput": "1 2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 4 3 0\n0",
        "expectedOutput": "0 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5\n9",
        "expectedOutput": "3 4",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Find Missing Number in Array",
    "description": "Given an array containing n distinct numbers in the range [0, n], find and print the one missing number.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "3 0 1",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 1",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "9 6 4 2 3 5 7 0 1",
        "expectedOutput": "8",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 1 2 3 4",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "4 3 1 0",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 2",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "6 5 4 3 2 1 0",
        "expectedOutput": "7",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Find Duplicate Number",
    "description": "Given an array of integers containing n + 1 integers where each integer is in range [1, n], find and print the repeated number.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Hash Table",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 3 4 2 2",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 1 3 4 2",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 3 3 3 3",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 5 9 6 9 3 8 9 7 1",
        "expectedOutput": "9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 4 5",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7 6 5 4 3 2 1 7",
        "expectedOutput": "7",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 10",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 8 7 9",
        "expectedOutput": "9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 2 2",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Rotate Array by K Positions",
    "description": "Given array elements on line 1 and integer K on line 2, rotate array right by K steps and print result.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Arrays",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 2 3 4 5 6 7\n3",
        "expectedOutput": "5 6 7 1 2 3 4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-1 -100 3 99\n2",
        "expectedOutput": "3 99 -1 -100",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2\n3",
        "expectedOutput": "2 1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100\n5",
        "expectedOutput": "100",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3\n0",
        "expectedOutput": "1 2 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4\n4",
        "expectedOutput": "1 2 3 4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30 40\n1",
        "expectedOutput": "40 10 20 30",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1\n2",
        "expectedOutput": "2 1 5 4 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 8 7\n5",
        "expectedOutput": "8 7 9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 1\n10",
        "expectedOutput": "0 1",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Maximum Subarray Sum (Kadane's)",
    "description": "Given an integer array, find the contiguous subarray with the largest sum and print its sum.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "-2 1 -3 4 -1 2 1 -5 4",
        "expectedOutput": "6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "5 4 -1 7 8",
        "expectedOutput": "23",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-1 -2 -3 -4",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 10 -2 3",
        "expectedOutput": "11",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 -50 200",
        "expectedOutput": "250",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-10 20 -10",
        "expectedOutput": "20",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 -10 5",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-100",
        "expectedOutput": "-100",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Binary Search in Sorted Array",
    "description": "Given sorted array on line 1 and target on line 2, print 0-based index of target, or -1 if not found.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Searching",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "-1 0 3 5 9 12\n9",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "-1 0 3 5 9 12\n2",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "5\n5",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 3 5 7 9\n1",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 3 5 7 9\n9",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 3 5 7 9\n5",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 3 5 7 9\n0",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 3 5 7 9\n10",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30 40 50\n40",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200\n150",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Merge Two Sorted Arrays",
    "description": "Given two sorted arrays on line 1 and line 2, merge them into a single sorted array and print space-separated.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Two Pointers",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 3 5\n2 4 6",
        "expectedOutput": "1 2 3 4 5 6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 20\n5 15 25",
        "expectedOutput": "5 10 15 20 25",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 1\n2 2",
        "expectedOutput": "1 1 2 2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n0",
        "expectedOutput": "0 1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -1\n-3 0",
        "expectedOutput": "-5 -3 -1 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200\n150 250",
        "expectedOutput": "100 150 200 250",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5\n1 2 3",
        "expectedOutput": "1 2 3 5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0\n0",
        "expectedOutput": "0 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 30\n20 40 50",
        "expectedOutput": "10 20 30 40 50",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9 10\n1 2",
        "expectedOutput": "1 2 9 10",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Valid Anagram Check",
    "description": "Given two strings on line 1 and line 2, check if they are valid anagrams of each other. Print `Anagram` or `Not Anagram`.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Hash Table",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "anagram\nnagaram",
        "expectedOutput": "Anagram",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "rat\ncar",
        "expectedOutput": "Not Anagram",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "listen\nsilent",
        "expectedOutput": "Anagram",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a\na",
        "expectedOutput": "Anagram",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "ab\naa",
        "expectedOutput": "Not Anagram",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "triangle\nintegral",
        "expectedOutput": "Anagram",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "paper\ntitle",
        "expectedOutput": "Not Anagram",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "earth\nheart",
        "expectedOutput": "Anagram",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "c\nd",
        "expectedOutput": "Not Anagram",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abc\ncba",
        "expectedOutput": "Anagram",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "First Non-Repeating Character",
    "description": "Given a string, print the first non-repeating character, or `-1` if none exists.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Hash Table",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "leetcode",
        "expectedOutput": "l",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "loveleetcode",
        "expectedOutput": "v",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "aabb",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "z",
        "expectedOutput": "z",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abacaba",
        "expectedOutput": "c",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "codeverix",
        "expectedOutput": "c",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "stress",
        "expectedOutput": "t",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "repaper",
        "expectedOutput": "e",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "xxxx",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abcdef",
        "expectedOutput": "a",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Valid Parentheses",
    "description": "Given a string containing `()[]{}` check if brackets are valid. Print `Valid` or `Invalid`.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Stack",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "()",
        "expectedOutput": "Valid",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "()[]{}",
        "expectedOutput": "Valid",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "(]",
        "expectedOutput": "Invalid",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "([)]",
        "expectedOutput": "Invalid",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "{[]}",
        "expectedOutput": "Valid",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "",
        "expectedOutput": "Valid",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "(",
        "expectedOutput": "Invalid",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "]",
        "expectedOutput": "Invalid",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "{{{{}}}}",
        "expectedOutput": "Valid",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "({[]})",
        "expectedOutput": "Valid",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Longest Common Prefix",
    "description": "Given space-separated strings on standard input, find and print their longest common prefix, or `-1` if none.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Strings",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "flower flow flight",
        "expectedOutput": "fl",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "dog racecar car",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "interspecies interstellar interstate",
        "expectedOutput": "inters",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "a",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "throne throne",
        "expectedOutput": "throne",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abc abcd ab",
        "expectedOutput": "ab",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "cir car",
        "expectedOutput": "c",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "refers reference refuge",
        "expectedOutput": "ref",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "x y z",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "apple app apply",
        "expectedOutput": "app",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Intersection of Two Arrays",
    "description": "Given two arrays on line 1 and line 2, print their unique intersection elements sorted in ascending order.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Hash Table",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 2 2 1\n2 2",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "4 9 5\n9 4 9 8 4",
        "expectedOutput": "4 9",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 3\n4 5 6",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 1 1\n1 1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30\n30 20 10",
        "expectedOutput": "10 20 30",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5\n5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1 -2 0\n0 -2 5",
        "expectedOutput": "-2 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200\n300 400",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7 8 9\n9 8 7 6",
        "expectedOutput": "7 8 9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 3 5 7\n2 3 6 7",
        "expectedOutput": "3 7",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Container With Most Water",
    "description": "Given array of line heights, find two lines that form container with max water and print max area.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Two Pointers",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 8 6 2 5 4 8 3 7",
        "expectedOutput": "49",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 1",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "4 3 2 1 4",
        "expectedOutput": "16",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 1",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 3 4 5 18 17 6",
        "expectedOutput": "17",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 9 8 7 6 5 4 3 2 1",
        "expectedOutput": "25",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 1 1 1",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 10 5",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 100",
        "expectedOutput": "100",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 9 3 4 7 2 12 6",
        "expectedOutput": "36",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "3Sum Problem",
    "description": "Given integer array, check if any 3 distinct elements sum to 0. Print `Found` or `Not Found`.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Two Pointers",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "-1 0 1 2 -1 -4",
        "expectedOutput": "Found",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 1 1",
        "expectedOutput": "Not Found",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "Found",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 -2 -1",
        "expectedOutput": "Not Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-2 0 2 1 -1",
        "expectedOutput": "Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 -10 0",
        "expectedOutput": "Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 1 2 3",
        "expectedOutput": "Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4",
        "expectedOutput": "Not Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1 -1 2",
        "expectedOutput": "Found",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200 -300",
        "expectedOutput": "Found",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Longest Substring Without Repeating Characters",
    "description": "Given a string, find the length of the longest substring without repeating characters.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Sliding Window",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "abcabcbb",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "bbbbb",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "pwwkew",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "au",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "dvdf",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "anviaj",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "tmmzuxt",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "codeverix",
        "expectedOutput": "7",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Subarray Sum Equals K",
    "description": "Given array elements on line 1 and integer K on line 2, print count of total subarrays whose sum equals K.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Sliding Window",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 1 1\n2",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2 3\n3",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 2 -2 -20 10\n-10",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1\n1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 -1 1 -1\n0",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 4 7 2 -3 1 4 2\n7",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "0 0 0\n0",
        "expectedOutput": "6",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 10 15\n25",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 1 2 1\n3",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Implement Queue using Stacks",
    "description": "Given operations push X, pop, peek separated by spaces, execute operations and print outputs of pop and peek.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Queue",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "push 1 push 2 peek pop",
        "expectedOutput": "1 1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "push 10 push 20 push 30 pop peek",
        "expectedOutput": "10 20",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "push 5 pop",
        "expectedOutput": "5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "push 100 peek",
        "expectedOutput": "100",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "push 1 push 2 pop pop",
        "expectedOutput": "1 2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "push 7 push 8 push 9 pop pop peek",
        "expectedOutput": "7 8 9",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "push 42 peek pop",
        "expectedOutput": "42 42",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "push 1 push 2 push 3 peek",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "push 99 pop",
        "expectedOutput": "99",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "push 11 push 22 pop peek",
        "expectedOutput": "11 22",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Matrix Transpose",
    "description": "Given R and C on line 1 followed by R rows of matrix elements, print its transposed matrix (C rows, R cols).",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Matrix",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "expectedOutput": "1 4\n2 5\n3 6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "1 3\n2 4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 3\n7 8 9",
        "expectedOutput": "7\n8\n9",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 1\n1\n2\n3",
        "expectedOutput": "1 2 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 1\n42",
        "expectedOutput": "42",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 2\n0 1\n1 0",
        "expectedOutput": "0 1\n1 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 2\n1 2\n3 4\n5 6",
        "expectedOutput": "1 3 5\n2 4 6",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 3\n10 20 30\n40 50 60",
        "expectedOutput": "10 40\n20 50\n30 60",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2\n5 10",
        "expectedOutput": "5\n10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 1\n99\n100",
        "expectedOutput": "99 100",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Spiral Matrix Traversal",
    "description": "Given R and C on line 1 followed by R rows of matrix, print elements in spiral order space-separated.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Matrix",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "expectedOutput": "1 2 3 6 9 8 7 4 5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12",
        "expectedOutput": "1 2 3 4 8 12 11 10 9 5 6 7",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 1\n10",
        "expectedOutput": "10",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "1 2 4 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 3\n1 2 3",
        "expectedOutput": "1 2 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 1\n1\n2\n3",
        "expectedOutput": "1 2 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "expectedOutput": "1 2 3 6 5 4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 2\n1 2\n3 4\n5 6",
        "expectedOutput": "1 2 4 6 5 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 4\n1 2 3 4\n5 6 7 8",
        "expectedOutput": "1 2 3 4 8 7 6 5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "4 1\n10\n20\n30\n40",
        "expectedOutput": "10 20 30 40",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Climbing Stairs (DP)",
    "description": "Given N steps, you can climb 1 or 2 steps at a time. Print count of distinct ways to reach the top.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "4",
        "expectedOutput": "5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5",
        "expectedOutput": "8",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "6",
        "expectedOutput": "13",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10",
        "expectedOutput": "89",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "15",
        "expectedOutput": "987",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "20",
        "expectedOutput": "10946",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7",
        "expectedOutput": "21",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Coin Change (Minimum Coins)",
    "description": "Given coin denominations on line 1 and target amount on line 2, print min coins needed, or -1 if impossible.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 2 5\n11",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2\n3",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n0",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1\n2",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 5 10\n15",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "186 419 83 408\n6249",
        "expectedOutput": "20",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 7\n5",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 5 10 25\n30",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 4 6\n7",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Kth Largest Element in Array",
    "description": "Given array on line 1 and integer K on line 2, find and print the Kth largest element in sorted order.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Sorting",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "3 2 1 5 6 4\n2",
        "expectedOutput": "5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 2 3 1 2 4 5 5 6\n4",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 20 30\n1",
        "expectedOutput": "30",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30\n3",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-1 -2 -3 -4\n2",
        "expectedOutput": "-2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 5 5 5\n2",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 500 200 999\n1",
        "expectedOutput": "999",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 500 200 999\n4",
        "expectedOutput": "100",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7 8 9 10 11\n3",
        "expectedOutput": "9",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Group Anagrams",
    "description": "Given space-separated words, print total count of unique anagram groups.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Hash Table",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "eat tea tan ate nat bat",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "abc cba bca xyz zyx",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "cat dog bird",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "rat tar art star rats",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "listen silent enlist google",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "a b c d",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "aaaa aaaa",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "ab ba cd dc ef fe",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "codeverix",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Search in Rotated Sorted Array",
    "description": "Given rotated sorted array on line 1 and target on line 2, print 0-based index of target, or -1 if not found.",
    "difficulty": "Medium",
    "subject": "Programming",
    "topic": "Searching",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "4 5 6 7 0 1 2\n0",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "4 5 6 7 0 1 2\n3",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n0",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n1",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 1\n1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 1 3\n5",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 1 3\n3",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "4 5 6 7 8 1 2 3\n8",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30 5 6 7\n30",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30 5 6 7\n7",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Trapping Rain Water",
    "description": "Given elevation map array on standard input, compute total units of trapped rain water.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Two Pointers",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "0 1 0 2 1 0 1 3 2 1 2 1",
        "expectedOutput": "6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "4 2 0 3 2 5",
        "expectedOutput": "9",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3 0 2 0 4",
        "expectedOutput": "7",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 0 0",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 0 5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2 0 2",
        "expectedOutput": "2",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 0 0 10",
        "expectedOutput": "20",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 2 1 2 3",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Longest Palindromic Substring",
    "description": "Given a string, find and print the longest palindromic substring.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "babad",
        "expectedOutput": "bab",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "cbbd",
        "expectedOutput": "bb",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a",
        "expectedOutput": "a",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "ac",
        "expectedOutput": "a",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "racecar",
        "expectedOutput": "racecar",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "noon",
        "expectedOutput": "noon",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abbc",
        "expectedOutput": "bb",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "bananas",
        "expectedOutput": "anana",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "aaaa",
        "expectedOutput": "aaaa",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abcdef",
        "expectedOutput": "a",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Edit Distance (Levenshtein Distance)",
    "description": "Given word1 on line 1 and word2 on line 2, print minimum operations (insert, delete, replace) to convert word1 to word2.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "horse\nros",
        "expectedOutput": "3",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "intention\nexecution",
        "expectedOutput": "5",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "cat\ncut",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a\nb",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abc\nabc",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abc\n",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "\nabc",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "sunday\nsaturday",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "gfg\ngfg",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "algorithm\nalttrut",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Minimum Window Substring",
    "description": "Given string S on line 1 and string T on line 2, find min window substring in S containing all chars in T, or `-1` if none.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Sliding Window",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "ADOBECODEBANC\nABC",
        "expectedOutput": "BANC",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a\na",
        "expectedOutput": "a",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a\naa",
        "expectedOutput": "-1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "ab\nb",
        "expectedOutput": "b",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abc\nac",
        "expectedOutput": "abc",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "aa\na",
        "expectedOutput": "a",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "timetopractice\ntoc",
        "expectedOutput": "toprac",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "xyz\na",
        "expectedOutput": "-1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abcdef\ndef",
        "expectedOutput": "def",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "bba\nab",
        "expectedOutput": "ba",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Merge K Sorted Lists / Arrays",
    "description": "Given K on line 1 followed by K lines of sorted arrays, merge all into one sorted array and print space-separated.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Sorting",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "3\n1 4 5\n1 3 4\n2 6",
        "expectedOutput": "1 1 2 3 4 4 5 6",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2\n1 2\n3 4",
        "expectedOutput": "1 2 3 4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1\n10 20",
        "expectedOutput": "10 20",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2\n-5 0\n-2 3",
        "expectedOutput": "-5 -2 0 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3\n1\n2\n3",
        "expectedOutput": "1 2 3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2\n100 300\n200 400",
        "expectedOutput": "100 200 300 400",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3\n0\n0\n0",
        "expectedOutput": "0 0 0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2\n5 15 25\n10 20 30",
        "expectedOutput": "5 10 15 20 25 30",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1\n5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "2\n99\n1",
        "expectedOutput": "1 99",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Median of Two Sorted Arrays",
    "description": "Given two sorted arrays on line 1 and line 2, find their median and print formatted to 2 decimal places.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Searching",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "1 3\n2",
        "expectedOutput": "2.00",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1 2\n3 4",
        "expectedOutput": "2.50",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 0\n0 0",
        "expectedOutput": "0.00",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10\n20",
        "expectedOutput": "15.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 5 9\n2 6 10",
        "expectedOutput": "5.50",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100\n200 300",
        "expectedOutput": "200.00",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -3\n-2 -1",
        "expectedOutput": "-2.50",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5\n6 7 8 9 10",
        "expectedOutput": "5.50",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7\n1 2 3",
        "expectedOutput": "2.50",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 10 15\n20",
        "expectedOutput": "12.50",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "0/1 Knapsack Problem",
    "description": "Given values on line 1, weights on line 2, and max capacity W on line 3, print max value achievable.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "60 100 120\n10 20 30\n50",
        "expectedOutput": "220",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10 20 30\n1 1 1\n2",
        "expectedOutput": "50",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "10\n5\n4",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "100 200\n5 10\n15",
        "expectedOutput": "300",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30\n10 20 30\n30",
        "expectedOutput": "30",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 100\n1 10\n9",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "50 40 30 20\n5 4 3 2\n10",
        "expectedOutput": "90",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3\n4 5 6\n3",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "500\n10\n10",
        "expectedOutput": "500",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 20 30 40\n1 2 3 4\n5",
        "expectedOutput": "50",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Word Break Problem",
    "description": "Given string S on line 1 and space-separated dictionary words on line 2, check if S can be segmented into dictionary words. Print `Possible` or `Impossible`.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "leetcode\nleet code",
        "expectedOutput": "Possible",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "applepenapple\napple pen",
        "expectedOutput": "Possible",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "catsandog\ncats dog sand and cat",
        "expectedOutput": "Impossible",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "a\na",
        "expectedOutput": "Possible",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "codeverix\ncode verix",
        "expectedOutput": "Possible",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "abcd\nab c",
        "expectedOutput": "Impossible",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "goals\ngo al s",
        "expectedOutput": "Possible",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "program\npro gram",
        "expectedOutput": "Possible",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "xyz\nx y",
        "expectedOutput": "Impossible",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "pythonjava\npython java",
        "expectedOutput": "Possible",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "N-Queens Problem Representation",
    "description": "Given integer N, print total number of distinct solutions for placing N non-attacking queens on an N x N chessboard.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Recursion",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "2",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "2",
        "expectedOutput": "0",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "3",
        "expectedOutput": "0",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5",
        "expectedOutput": "10",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "6",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "7",
        "expectedOutput": "40",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "8",
        "expectedOutput": "92",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "9",
        "expectedOutput": "352",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10",
        "expectedOutput": "724",
        "isHidden": true,
        "marks": 10
      }
    ]
  },
  {
    "title": "Longest Increasing Subsequence",
    "description": "Given space-separated integers, find the length of the longest strictly increasing subsequence.",
    "difficulty": "Hard",
    "subject": "Programming",
    "topic": "Dynamic Programming",
    "questionType": "Single File Programming",
    "totalMarks": 100,
    "allowedLanguages": "Java, Python, C, C++, JavaScript, TypeScript",
    "starterCode": {
      "Java": "",
      "Python": "",
      "C": "",
      "C++": "",
      "JavaScript": "",
      "TypeScript": ""
    },
    "testCases": [
      {
        "input": "10 9 2 5 3 7 101 18",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "0 1 0 3 2 3",
        "expectedOutput": "4",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "7 7 7 7 7",
        "expectedOutput": "1",
        "isHidden": false,
        "marks": 10
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "5",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "5 4 3 2 1",
        "expectedOutput": "1",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "10 22 9 33 21 50 41 60 80",
        "expectedOutput": "6",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "-5 -2 0 3",
        "expectedOutput": "4",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "3 10 2 1 20",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      },
      {
        "input": "100 200 150 300",
        "expectedOutput": "3",
        "isHidden": true,
        "marks": 10
      }
    ]
  }
];
