
import API from "./api";

export const createGroup = async (payload) => {
  const { data } = await API.post("/groups/create", payload);
  return data;
};

export const getGroups = async () => {
  const { data } = await API.get("/groups");
  return data;
};

export const getGroupDetails = async (groupId) => {
  const { data } = await API.get(`/groups/${groupId}`);
  return data;
};

export const addGroupMember = async (groupId, payload) => {
  const { data } = await API.post(
    `/groups/${groupId}/members`,
    payload
  );
  return data;
};

export const removeGroupMember = async (groupId, memberId) => {
  const { data } = await API.delete(
    `/groups/${groupId}/members/${memberId}`
  );
  return data;
};
