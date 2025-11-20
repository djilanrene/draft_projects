import type { Timestamp } from "firebase/firestore";

export type Project = {
  id: string;
  title: string;
  excerpt: string; // Changed from description
  content: string; // Added for markdown details
  category: string;
  software: string[];
  imageUrl: string;
  imageHint: string;
  resources?: {
    label: string;
    url: string;
    type: 'website' | 'github';
  }[];
};

export type Profile = {
  profileImageUrl: string;
  aboutImageUrl: string;
  aboutImageHint: string;
  aboutText1: string;
  aboutText2: string;
  aboutText3: string;
  updatedAt?: Timestamp;
}

export type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  publishedDate: Timestamp;
};
