import { useState } from "react";
import useLayoutStore from "../../store/layoutStore";
import useThemeStore from "../../store/themeStore";
import useUserStore from "../../store/useUserStore";
import { FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import formatTimestamp from "../../utils/formatTime";
import AddUser from "./AddUser";
import { useChatStore } from "../../store/chatStore";

function ChatList({ contacts = [] }) {
  const { selectedContact, setSelectedContact } = useLayoutStore();
  const { theme } = useThemeStore();
  const user = useUserStore((state) => state.user);

  const { conversations, onlineUsers, typingUsers } =
    useChatStore();

  const [searchTerms, setSearchTerms] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    contact?.username
      ?.toLowerCase()
      .includes(searchTerms.toLowerCase())
  );

  const getConversation = (contactId) => {
    const list = conversations?.data || [];

    return list.find((conversation) =>
      conversation?.participants?.some(
        (participant) =>
          String(participant?._id || participant) ===
          String(contactId)
      )
    );
  };

  return (
    <div
      className={`w-full border-r h-screen ${
        theme === "dark"
          ? "bg-[#111b21] border-gray-600"
          : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 flex justify-between items-center ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        <h2 className="text-xl font-semibold">Chats</h2>

        <button
          type="button"
          onClick={() => setShowAddUser(true)}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <FaPlus />
        </button>
      </div>

      <div className="p-2">
        <div className="relative">
          <FaSearch
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-800"
            }`}
          />

          <input
            type="text"
            placeholder="Search or start new chat"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-500"
                : "bg-gray-100 text-black border-gray-200 placeholder-gray-400"
            }`}
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        {filteredContacts.length === 0 ? (
          <p className="text-center text-sm text-gray-500 mt-8 px-4">
            {searchTerms
              ? "No users found."
              : "No contacts available. Add someone to start chatting."}
          </p>
        ) : (
          filteredContacts.map((contact) => {
            const contactId = String(contact?._id || "");
            const conversation = getConversation(contactId);

            const isOnline =
              onlineUsers?.get?.(contactId)?.isOnline === true;

            const isTyping =
              typingUsers?.get?.(String(conversation?._id || ""))?.has?.(
                contactId
              ) === true;

            const lastSeen = contact?.lastSeen;
            const validLastSeen =
              lastSeen &&
              !Number.isNaN(new Date(lastSeen).getTime());

            const isSelected =
              String(selectedContact?._id) === contactId;

            return (
              <motion.div
                key={contactId}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  setSelectedContact({
                    ...contact,
                    conversation,
                  })
                }
                className={`p-3 flex items-center cursor-pointer ${
                  theme === "dark"
                    ? isSelected
                      ? "bg-gray-700"
                      : "hover:bg-gray-800"
                    : isSelected
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                }`}
              >
                {contact?.profilePicture ? (
                  <img
                    src={contact.profilePicture}
                    alt={contact?.username || "User"}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                    <FaUser className="text-gray-600 text-lg" />
                  </div>
                )}

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <h2
                      className={`font-semibold truncate ${
                        theme === "dark"
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {contact?.username || "User"}
                    </h2>

                    {isOnline ? (
                      <span className="text-xs text-green-500 shrink-0">
                        Online
                      </span>
                    ) : validLastSeen ? (
                      <span
                        className={`text-xs shrink-0 ${
                          theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTimestamp(lastSeen)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 shrink-0">
                        Offline
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-1">
                    <p
                      className={`text-sm truncate ${
                        isTyping
                          ? "text-green-500 font-medium"
                          : theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {isTyping
                        ? "typing..."
                        : conversation?.lastMessage?.content || ""}
                    </p>

                    {conversation?.unreadCount > 0 && (
                      <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center bg-green-500 text-white rounded-full shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {showAddUser && (
        <AddUser
          theme={theme}
          onClose={() => setShowAddUser(false)}
          onUserSelect={(newUser) => {
            const existingConversation = getConversation(newUser?._id);

            setSelectedContact({
              ...newUser,
              conversation: existingConversation || null,
            });

            setShowAddUser(false);
          }}
        />
      )}
    </div>
  );
}

export default ChatList;