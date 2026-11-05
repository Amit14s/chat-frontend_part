
import API from "./api";

export const sendMessage = async (payload) => {
  const { data } = await API.post("/chats/send-message", payload);
  return data;
};

export const getMessages = async (
  conversationId,
  page = 1,
  limit = 30
) => {
  const { data } = await API.get(
    `/chats/conversations/${conversationId}/messages`,
    {
      params: { page, limit },
    }
  );

  return data;
};

export const markMessagesAsRead = async (conversationId) => {
  const { data } = await API.put("/chats/message/read", {
    conversationId,
  });

  return data;
};

export const editMessage = async (messageId, content) => {
  const { data } = await API.put(
    `/chats/message/${messageId}`,
    { content }
  );

  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await API.delete(
    `/chats/message/${messageId}`
  );

  return data;
};

export const addReaction = async (messageId, emoji) => {
  const { data } = await API.post(
    `/chats/message/${messageId}/reaction`,
    { emoji }
  );

  return data;
};
