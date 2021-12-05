type UserDetails = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  isStaff: boolean;
};

type UserDetailsReceived = {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  is_staff: boolean;
};

type UserDetailsToSend = {
  id?: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
};

export type { UserDetails, UserDetailsReceived, UserDetailsToSend };
