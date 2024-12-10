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
    <UiGradientDivider class="" />

    <div class="h-[600px] overflow-y-auto">
      <div class="mt-2">
        <UiTable>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead
                @click="onSort('first_name')"
                class="sticky top-0 z-10 cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                :sorted="sortKey === 'first_name'"
                :sort-order
                >Name</UiTableHead
              >
              <UiTableHead
                class="bg-background/9 0 sticky top-0 z-10 hidden pl-0 font-bold text-foreground backdrop-blur lg:table-cell"
                >ID</UiTableHead
              >
              <UiTableHead
                @click="onSort('order_type')"
                :sorted="sortKey === 'order_type'"
                :sort-order
                class="bg-background/9 0 sticky top-0 z-10 hidden cursor-pointer pl-0 font-bold text-foreground backdrop-blur md:table-cell"
                >Order Type</UiTableHead
              >
              <UiTableHead
                @click="onSort('phone_number')"
                :sorted="sortKey === 'phone_number'"
                :sort-order
                class="sticky top-0 z-10 cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Phone Number</UiTableHead
              >
              <UiTableHead
                @click="onSort('provider_message')"
                :sorted="sortKey === 'provider_message'"
                :sort-order
                class="sticky top-0 z-10 cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Provider Message</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 hidden cursor-pointer bg-background/90 pl-0 font-bold text-foreground backdrop-blur md:table-cell"
                @click="onSort('submission_datetime')"
                :sorted="sortKey === 'submission_datetime'"
                :sort-order
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
  import { onMounted, ref } from "vue";

  const userStore = useUserStore();
  const users = ref<any[]>([]);
  const totalUsers = ref<number>(0);
  const searchTerm = ref<string>("");

  const sortKey = ref<string>("");
  const sortOrder: Ref<"asc" | "desc" | ""> = ref("");

  const limit = 10;

  const fetchPaginatedUsers = async (page: number) => {
    const offset = (page - 1) * limit;
    const { results, total } = await userStore.fetchUsers({ offset, limit });
    users.value = results;
    totalUsers.value = total;
  };

  const onSearch = async () => {
    await userStore.searchUsers(searchTerm.value);
    users.value = userStore.users;
    totalUsers.value = userStore.totalUsers;
  };

  const onSort = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value =
        sortOrder.value === "asc" ? "desc" : sortOrder.value === "desc" ? "" : "asc";
    } else {
      sortKey.value = key;
      sortOrder.value = "asc";
    }

    if (sortKey.value && sortOrder.value) {
      userStore.sortUsers(sortKey.value, sortOrder.value);
      fetchPaginatedUsers(1); // Reset to the first page after sorting
    }
  };

  const onUpdatePage = (pageNumber: number) => {
    fetchPaginatedUsers(pageNumber);
  };

  onMounted(() => {
    fetchPaginatedUsers(1);
  });
</script>

<style>
  *::-webkit-scrollbar {
    z-index: 11;
    width: 3px;
  }
  *::-webkit-scrollbar:horizontal {
    height: 3px;
  }
  *::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  *::-webkit-scrollbar-corner {
    background: #fff;
  }
  *::-webkit-scrollbar-track {
    background: #fff;
  }
  *::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
</style>
