export type Project = {
  id: string;
  title: string;
  description: string;
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
}

export type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
}
