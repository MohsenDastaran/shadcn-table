import usersData from "@/assets/data.json";

export const useUserStore = defineStore("User", () => {
  const users = ref<any[]>([]);
  const totalUsers = ref<number>(0);
  const allUsers = ref<any[]>(usersData); // Full dataset

  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const fetchUsers = async (params: { offset: number; limit: number }) => {
    const paginatedData = allUsers.value.slice(params.offset, params.offset + params.limit);
    users.value = paginatedData;
    totalUsers.value = allUsers.value.length;

    return {
      results: paginatedData,
      total: totalUsers.value,
    };
  };

  const searchUsers = async (searchTerm: string) => {
    const term = normalize(searchTerm);

    if (!term) {
      allUsers.value = usersData;
    } else {
      allUsers.value = usersData.filter((user) =>
        Object.values(user).some(
          (value) => typeof value === "string" && normalize(value).includes(term)
        )
      );
    }

    await fetchUsers({ offset: 0, limit: 20 });
  };

  /**
   * Sort entire dataset
   */
  const sortUsers = (column: string, direction: "asc" | "desc" | "") => {
    allUsers.value.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (column === "submission_datetime") {
        return direction === "asc"
          ? new Date(valA).getTime() - new Date(valB).getTime()
          : new Date(valB).getTime() - new Date(valA).getTime();
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return 0;
    });
  };

  return {
    users,
    totalUsers,
    fetchUsers,
    searchUsers,
    sortUsers,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
