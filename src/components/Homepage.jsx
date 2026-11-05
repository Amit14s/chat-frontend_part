import { useEffect, useState } from "react";
import ChatList from "../pages/chatSection/ChatList";
import Layout from "./Layout";
import { motion } from "framer-motion";
import { getAllUser } from "../services/user.services";
import { toast } from "react-toastify";

function HomePage() {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllContacts = async () => {
    try {
      setLoading(true);

      const result = await getAllUser();

      const users = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.users)
          ? result.data.users
          : Array.isArray(result?.users)
            ? result.users
            : [];

      setAllUser(users);
    } catch (error) {
      console.error("Unable to fetch users:", error);
      toast.error(
        error?.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            Loading users...
          </div>
        ) : (
          <ChatList contacts={allUser} />
        )}
      </motion.div>
    </Layout>
  );
}

export default HomePage;