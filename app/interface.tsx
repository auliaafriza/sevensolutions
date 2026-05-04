export interface User {
  id: number;
  firstName: string;
  lastName: string;
  company: {
    department: string;
  };
}

export interface UsersResponse {
  users: User[];
}

export interface TypeSelect {
  type: string;
  name: string;
}
