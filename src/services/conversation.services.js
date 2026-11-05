
import API from "./api";

export const createConversation = async (payload) => {
  const { data } = await API.post("/conversations/create", payload);
  return data;
};

export const getConversations = async () => {
  const { data } = await API.get("/conversations");
  return data;
};
