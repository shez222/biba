export interface GroupMember {
  id: number;
  member_email: string;
  status: number;
  group: {
    id: number;
    name: string;
  } | null;
  member: {
    id: number;
    first_name: string;
    surname: string;
  } | null;
}
