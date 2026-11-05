
import API from "./api";

export const createConversation = async (receiverId) => {
  const { data } = await API.post("/conversations/create", {
    receiverId,
  });

  return data;
};

export const getConversations = async () => {
  const { data } = await API.get("/conversations");
  return data;
};
