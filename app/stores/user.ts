import usersData from "@/assets/data.json";

export const useUserStore = defineStore("User", () => {
  // Add proper types, don't be lazy
  const users = ref<any[]>([]);

  const fetchUsers = async () => {
    users.value = usersData;
    return usersData;
  };
  return {
    users,
    fetchUsers,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
