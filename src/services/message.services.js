
import API from "./api";

export const sendMessage = async (payload) => {
  const isFormData = payload instanceof FormData;

  const { data } = await API.post(
    "/chats/send-message",
    payload,
    isFormData
      ? { headers: { "Content-Type": undefined } }
      : {}
  );

  return data;
};

export const getChatConversations = async () => {
  const { data } = await API.get("/chats/conversations");
  return data;
};

export const getMessages = async (conversationId, params = {}) => {
  const { data } = await API.get(
    `/chats/conversations/${conversationId}/messages`,
    { params }
  );

  return data;
};

export const markMessagesAsRead = async (payload) => {
  const { data } = await API.put("/chats/message/read", payload);
  return data;
};

export const editMessage = async (messageId, payload) => {
  const { data } = await API.put(
    `/chats/message/${messageId}`,
    payload
  );

  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await API.delete(
    `/chats/message/${messageId}`
  );

  return data;
};

export const addReaction = async (messageId, payload) => {
  const { data } = await API.post(
    `/chats/message/${messageId}/reaction`,
    payload
  );

  return data;
};
