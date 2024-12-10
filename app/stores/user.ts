import usersData from "@/assets/data.json";

export const useUserStore = defineStore("User", () => {
  const users = ref<any[]>([]);
  const totalUsers = ref<number>(0);
  const allUsers = ref<any[]>(usersData); // Full dataset

  /**
   * Normalize strings for search comparison
   */
  const normalize = (value: string) =>
    value
      .normalize("NFD") // Decompose special characters (José -> Jose)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase()
      .trim();

  /**
   * Fetch paginated users
   */
  const fetchUsers = async (params: { offset: number; limit: number }) => {
    const paginatedData = allUsers.value.slice(params.offset, params.offset + params.limit);
    users.value = paginatedData;
    totalUsers.value = allUsers.value.length;

    return {
      results: paginatedData,
      total: totalUsers.value,
    };
  };

  /**
   * Search users without external libraries
   */
  const searchUsers = async (searchTerm: string) => {
    const term = normalize(searchTerm);

    if (!term) {
      // Reset if search term is empty
      allUsers.value = usersData;
    } else {
      allUsers.value = usersData.filter((user) =>
        Object.values(user).some(
          (value) => typeof value === "string" && normalize(value).includes(term)
        )
      );
    }

    // Reset to the first page after search
    await fetchUsers({ offset: 0, limit: 20 });
  };

  return {
    users,
    totalUsers,
    fetchUsers,
    searchUsers,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
