<template>
  <UiContainer class="py-5">
    <h1 class="mb-1 text-2xl font-bold">Users</h1>

    <!-- Search Input -->
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search users by name, email, or phone..."
      class="mb-5 w-full rounded-md border p-2"
      @input="onSearch"
    />
    <SearchBuilder @updateFilters="handleFilters" />
    <UiGradientDivider />

    <div class="h-[600px] overflow-y-auto">
      <div class="mt-2">
        <UiTable>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead
                @click="onSort('first_name')"
                class="sticky top-0 z-10 cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                :sort-order="getSortOrder('first_name')"
                :is-stroke="isHighPriority('first_name')"
                >Name</UiTableHead
              >
              <UiTableHead
                class="bg-background/9 0 sticky top-0 z-10 hidden pl-0 font-bold text-foreground backdrop-blur lg:table-cell"
                >ID</UiTableHead
              >
              <UiTableHead
                @click="onSort('order_type')"
                :sort-order="getSortOrder('order_type')"
                :is-stroke="isHighPriority('order_type')"
                class="bg-background/9 0 sticky top-0 z-10 hidden cursor-pointer pl-0 font-bold text-foreground backdrop-blur md:table-cell"
                >Order Type</UiTableHead
              >
              <UiTableHead
                @click="onSort('phone_number')"
                :sort-order="getSortOrder('phone_number')"
                :is-stroke="isHighPriority('phone_number')"
                class="sticky top-0 z-10 cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Phone Number</UiTableHead
              >
              <UiTableHead
                @click="onSort('provider_message')"
                :sort-order="getSortOrder('provider_message')"
                :is-stroke="isHighPriority('provider_message')"
                class="sticky top-0 z-10 cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Provider Message</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 hidden cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur md:table-cell"
                @click="onSort('submission_datetime')"
                :sort-order="getSortOrder('submission_datetime')"
                :is-stroke="isHighPriority('submission_datetime')"
                >Submission Datetime</UiTableHead
              >
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <template v-for="user in users" :key="user.id">
              <UiTableRow>
                <UiTableCell class="pl-0">
                  <div class="flex flex-col">
                    <p class="font-medium">{{ user.first_name }}</p>
                    <p class="text-muted-foreground lg:hidden">{{ user.id }}</p>
                    <p class="text-muted-foreground md:hidden">{{ user.order_type }}</p>
                    <p class="text-muted-foreground md:hidden">{{ user.submission_datetime }}</p>
                  </div>
                </UiTableCell>
                <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">{{
                  user.id
                }}</UiTableCell>
                <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">{{
                  user.order_type
                }}</UiTableCell>
                <UiTableCell class="pl-0 text-muted-foreground">{{
                  user.phone_number
                }}</UiTableCell>
                <UiTableCell class="pl-0 text-muted-foreground">{{
                  user.provider_message
                }}</UiTableCell>
                <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">{{
                  user.submission_datetime
                }}</UiTableCell>
              </UiTableRow>
            </template>
          </UiTableBody>
        </UiTable>
      </div>
    </div>

    <div class="mt-10 flex w-full justify-center">
      <UiPagination @update:page="onUpdatePage" :total="totalUsers" :sibling-count="1" />
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
  import { useUserStore } from "@/stores/user";
  import { debounce } from "lodash";
  import { onMounted, ref } from "vue";

  const userStore = useUserStore();
  const users = ref<any[]>([]);
  const searchTerm = ref<string>("");
  const totalUsers = ref<number>(0);
  const sortConfig = ref<{ column: string; direction: "asc" | "desc" }[]>([]);

  const fetchPaginatedUsers = async (page: number) => {
    const { results, total } = await userStore.fetchUsers({
      offset: (page - 1) * 10,
      limit: 10,
    });
    users.value = results;
    totalUsers.value = total;
  };
  const onSearch = debounce(async () => {
    await userStore.searchUsers(searchTerm.value);
    users.value = userStore.users;
    totalUsers.value = userStore.totalUsers;
  }, 400);

  const isHighPriority = (key: string) => sortConfig.value?.[0]?.column === key;
  const getSortOrder = (key: string) => {
    const config = sortConfig.value.find((c) => c.column === key);
    return config ? config.direction : "";
  };

  const onSort = (key: string) => {
    const existingConfig = sortConfig.value.find((c) => c.column === key);

    if (existingConfig) {
      // Toggle or unsort the column
      if (existingConfig.direction === "asc") {
        existingConfig.direction = "desc";
      } else {
        // Remove the column from sorting if already descending
        sortConfig.value = sortConfig.value.filter((c) => c.column !== key);
      }
    } else {
      // Add new column to sort
      if (sortConfig.value.length === 2) {
        sortConfig.value.shift(); // Remove the oldest sorted column
      }
      sortConfig.value.push({ column: key, direction: "asc" });
    }

    userStore.sortUsers(sortConfig.value);
    fetchPaginatedUsers(1); // Reset to the first page
  };
  const handleFilters = (newFilters: { column: string; condition: string; value: string }[]) => {
    userStore.applyFilters(newFilters);
    users.value = userStore.users;
    totalUsers.value = userStore.totalUsers;
  };

  const onUpdatePage = (pageNumber: number) => {
    fetchPaginatedUsers(pageNumber);
  };
  onMounted(() => {
    fetchPaginatedUsers(1);
  });
</script>

<style src="../assets/css/styles.css"></style>
