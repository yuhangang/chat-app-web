import { ChatRoom } from "@/types";

export interface GroupedRooms {
  today: ChatRoom[];
  last7days: ChatRoom[];
  last30days: ChatRoom[];
  older: ChatRoom[];
}

const groupRoomsByDate = (rooms: ChatRoom[]): GroupedRooms => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7Days = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

  return rooms.reduce(
    (groups, room) => {
      const roomDate = new Date(room.updated_at);

      if (roomDate >= today) {
        groups.today.push(room);
      } else if (roomDate >= last7Days) {
        groups.last7days.push(room);
      } else if (roomDate >= last30Days) {
        groups.last30days.push(room);
      } else {
        groups.older.push(room);
      }

      return groups;
    },
    {
      today: [] as ChatRoom[],
      last7days: [] as ChatRoom[],
      last30days: [] as ChatRoom[],
      older: [] as ChatRoom[],
    }
  );
};

export default groupRoomsByDate;
