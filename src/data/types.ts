export type Category =
  | "Coding"
  | "Artificial Intelligence"
  | "Cloud"
  | "Data"
  | "Design"
  | "Infrastructure"
  | "Hacking"
  | "Networks"
  | "Cybersecurity";

type TooltipPosition = 'up' | 'down' | 'left' | 'right';

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  telegram?: string;
  youtube?: string;
  github?: string;
  [key: string]: string | undefined;
}

export interface ListaItem {
  logo: string;
  title: string;
  description: string;
  website?: string;
  mail?: string;
  social: SocialLinks;
  color: string;
  categories: Category[];
}

export interface EventItem {
  title: string;
  communities: string[];
  date: string;
  image?: string;
  link?: string;
}

interface NavItem {
  id: string;
  label: string;
}

// Props

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | "";
  setSelectedCategory: (category: Category | "") => void;
}

export interface NavProps {
  logo: string;
  items: NavItem[];
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export interface EventsProps {
  communityNames?: string[];
}

export interface FooterProps {
  copyrightHolderName: string;
  copyrightHolderUrl: string;
  redesignAuthorName: string;
  redesignAuthorUrl: string;
}

export interface HeroProps {
  logo: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface CommunityProfileProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export interface CollaborateButtonProps {
  mail: string;
  githubUrl: string;
}

export interface TooltipProps {
  text: string;
  delay?: number;
  duration?: number;
  position?: TooltipPosition;
  children: React.ReactNode;
}