export interface Iregister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "client";
  avatar?: string;
  photos: Array<photo>;
}

interface photo {
  name: string;
  url: string;
}
