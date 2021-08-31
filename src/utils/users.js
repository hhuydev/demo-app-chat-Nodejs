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

addUser({ id: 1, username: "huy", room: "lo11" });

console.log(users);

const user = removeUser(1);
console.log(user);
console.log(users);
