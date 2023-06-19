export interface Iuser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  client: Array<Iclient>;
}

interface Iclient {
  id: number;
  idUser: number;
  avatar: string;
  photo: Array<Iphoto>;
}

interface Iphoto {
  id: number;
  name: string;
  url: string;
}
