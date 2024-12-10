export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Meeting {
  id: string;
  date: string;
  description: string;
  startTime: string;
  userDetails: UserDetails;
}
