import { useQuery } from "@tanstack/react-query";

// Define the API response types
export interface TriviaQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  category: string;
  difficulty: string;
  type: string;
}

// Map our categories to the API's categories
const categoryMapping = {
  "General Knowledge": "",
  "Science": "science",
  "Geography": "geography",
  "History": "history", 
  "Sport & Leisure": "sport_and_leisure",
  "Art & Literature": "arts_and_literature",
};

export type QuizCategory = keyof typeof categoryMapping;

// Transform API response to our app's question format
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

// Fetch questions from the Trivia API
export const fetchTriviaQuestions = async (category: QuizCategory, limit: number = 20, difficulty: string = "medium"): Promise<QuizQuestion[]> => {
  // If General Knowledge, don't specify a category
  const categoryParam = categoryMapping[category] ? `categories=${categoryMapping[category]}` : '';
  
  const url = `https://the-trivia-api.com/api/questions?${categoryParam}&limit=${limit}&difficulty=${difficulty}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.statusText}`);
  }
  
  const data: TriviaQuestion[] = await response.json();
  
  // Transform the data to match our app's format
  return data.map(q => {
    // Combine correct and incorrect answers and shuffle them
    const options = [q.correctAnswer, ...q.incorrectAnswers];
    
    // Fisher-Yates shuffle algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return {
      id: q.id,
      question: q.question,
      options: options,
      correctAnswer: q.correctAnswer,
      category: q.category,
    };
  });
};

// React Query hook for fetching trivia questions
export const useTriviaQuestions = (category: QuizCategory) => {
  return useQuery({
    queryKey: ['triviaQuestions', category],
    queryFn: () => fetchTriviaQuestions(category),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Export available categories for reuse across components
export const availableCategories: QuizCategory[] = [
  "General Knowledge", 
  "Science", 
  "Geography", 
  "History", 
  "Sport & Leisure", 
  "Art & Literature"
];
