
import API from "./api";

export const createGroup = async (groupName, members) => {
  const { data } = await API.post("/groups/create", {
    groupName,
    members,
  });

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

export const addGroupMember = async (groupId, memberId) => {
  const { data } = await API.post(
    `/groups/${groupId}/members`,
    { memberId }
  );

  return data;
};

export const removeGroupMember = async (groupId, memberId) => {
  const { data } = await API.delete(
    `/groups/${groupId}/members/${memberId}`
  );

  return data;
};
