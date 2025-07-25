export interface Task {
  id: string;      
  text: string;    
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  sevenDayTodoCreatedCount: number;
  sevenDayLoginCount: number;
  lastUpdated: string;
}