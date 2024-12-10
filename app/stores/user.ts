import usersData from "@/assets/data.json";

export const useUserStore = defineStore("User", () => {
  const users = ref<any[]>([]);
  const totalUsers = ref<number>(0);

  const fetchUsers = async (params: { offset: number; limit: number }) => {
    const paginatedData = usersData.slice(params.offset, params.offset + params.limit);
    users.value = paginatedData;
    totalUsers.value = usersData.length;

    return {
      results: paginatedData,
      total: totalUsers.value,
    };
  };

  return {
    users,
    totalUsers,
    fetchUsers,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
