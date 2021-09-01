const users = [];

const addUser = ({ id, username, room }) => {
  /**validate data */
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) return { error: "Username & room are required!" };

  /**kiem tra thong user ton tai trong room chua */
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  if (existingUser) return { error: "User is in use!" };

  const user = { id, username, room };
  /**them user moi vao arr users*/
  users.push(user);
  return { user };
};
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  /**remove user tra ve user[0] */
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users[index];
};

const getUserInRoom = (roomName) => {
  const listUserByRoomName = users.filter((user) => user.room === roomName);
  if (listUserByRoomName.length !== 0) return listUserByRoomName;
  else return { error: "Can not find users by " + roomName };
};

module.exports = { addUser, removeUser, getUser, getUserInRoom };
