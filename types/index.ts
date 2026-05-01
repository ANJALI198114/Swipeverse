export interface Profile {
  id: string;
  name: string;
  age: number;
  tagline: string;
  emoji: string;
  gender: string;
  orientation: string;
  location: string;
  height: string;
  drinks: string;
  exercise: string;
  marijuana: string;
  pets: string;
  children: string;
  job: string;
  education: string;
  religion: string;
  city: string;
  languages: string;
  intent: string;
  photos: string[];
  quotes: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Match {
  id: string;
  profile: Profile;
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  initials: string;
  age: number;
  city: string;
  job: string;
  bio: string;
  gender: string;
  lookingFor: string;
  profileViews: number;
  likesReceived: number;
  matchesCount: number;
}
