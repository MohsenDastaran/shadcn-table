import usersData from "@/assets/data.json";

export const useUserStore = defineStore("User", () => {
  const users = ref<any[]>([]); // Paginated users for display
  const totalUsers = ref<number>(0); // Total count of users (after filtering/searching)
  const allUsers = ref<any[]>(usersData); // Current working dataset (after filtering/searching)
  const baseUsers = ref<any[]>(usersData); // Base dataset for the combination of filtering and searching
  const curretnTerm = ref<string>(""); // Base dataset for the combination of filtering and searching

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
    return { results: paginatedData, total: totalUsers.value };
  };

  const searchUsers = async (searchTerm: string) => {
    const term = normalize(searchTerm);
    curretnTerm.value = term;
    if (!term) {
      // If no search term, reset to the filtered state (baseUsers)
      allUsers.value = baseUsers.value;
    } else {
      // Filter within the currently filtered state (baseUsers)
      allUsers.value = baseUsers.value.filter((user) =>
        Object.values(user).some(
          (value) => typeof value === "string" && normalize(value).includes(term)
        )
      );
    }
    await fetchUsers({ offset: 0, limit: 10 }); // Refresh paginated users
  };

  /**
   * Multi-Column Sorting
   */
  const sortCache = new Map<string, any[]>();

  const sortUsers = (sortConfig: { column: string; direction: "asc" | "desc" }[]) => {
    if (!sortConfig.length) return;

    // Generate a cache key based on sort configuration
    const cacheKey = JSON.stringify(sortConfig);
    if (sortCache.has(cacheKey)) {
      allUsers.value = sortCache.get(cacheKey)!;
      return;
    }

    // Clone the array to avoid in-place sorting
    const sortedUsers = [...allUsers.value].sort((a, b) => {
      for (const { column, direction } of sortConfig) {
        const valA = a[column];
        const valB = b[column];

        if (column === "submission_datetime") {
          // Pre-compute timestamps for dates
          const timeA = new Date(valA).getTime();
          const timeB = new Date(valB).getTime();
          if (timeA !== timeB) {
            return direction === "asc" ? timeA - timeB : timeB - timeA;
          }
        } else if (typeof valA === "string" && typeof valB === "string") {
          // Locale comparison for strings
          const comparison = valA.localeCompare(valB);
          if (comparison !== 0) {
            return direction === "asc" ? comparison : -comparison;
          }
        } else if (valA !== valB) {
          // Generic comparison for numbers or other types
          return direction === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
        }
      }
      return 0;
    });

    // Cache the result
    sortCache.set(cacheKey, sortedUsers);
    allUsers.value = sortedUsers;
  };

  const applyFilters = async (filters: { column: string; condition: string; value: string }[]) => {
    // Apply filters on the original dataset (usersData)
    let filtered = usersData.filter((user: any) => {
      return filters.every(({ column, condition, value }) => {
        const userValue =
          typeof user[column] === "string" ? normalize(user[column] || "") : user[column];
        const normalizedValue = typeof user[column] === "string" ? normalize(value) : value;
        switch (condition) {
          case "equals":
            return userValue === normalizedValue;
          case "contains":
            return userValue.includes(normalizedValue);
          case "starts with":
            return userValue.startsWith(normalizedValue);
          case "ends with":
            return userValue.endsWith(normalizedValue);
          case "greater than":
            return parseFloat(userValue) > parseFloat(normalizedValue);
          case "less than":
            return parseFloat(userValue) < parseFloat(normalizedValue);
          default:
            return false;
        }
      });
    });

    // Update the base dataset (filtered results become the new base)
    baseUsers.value = filtered;

    // Apply the current search term on the new filtered state
    await searchUsers(curretnTerm.value);
  };

  return {
    users,
    allUsers,
    totalUsers,
    fetchUsers,
    searchUsers,
    sortUsers,
    applyFilters,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
