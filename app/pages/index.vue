<template>
  <UiContainer class="py-5">
    <h1 class="mb-1 text-2xl font-bold">Users</h1>
    <div class="h-[600px] overflow-y-auto">
      <div class="mt-10">
        <UiTable>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead
                class="sticky top-0 z-10 bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Name</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 hidden bg-background/90 pl-0 font-bold text-foreground backdrop-blur lg:table-cell"
                >ID</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 hidden bg-background/90 pl-0 font-bold text-foreground backdrop-blur md:table-cell"
                >Order Type</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Phone Number</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 bg-background/90 pl-0 font-bold text-foreground backdrop-blur"
                >Provider Message</UiTableHead
              >
              <UiTableHead
                class="sticky top-0 z-10 hidden bg-background/90 pl-0 font-bold text-foreground backdrop-blur md:table-cell"
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
  const limit = 10;

  const fetchPaginatedUsers = async (page: number) => {
    const offset = (page - 1) * limit;
    const { results, total } = await userStore.fetchUsers({ offset, limit });
    users.value = results;
    totalUsers.value = total;
  };

  const onUpdatePage = (pageNumber: number) => {
    fetchPaginatedUsers(pageNumber);
  };

  // Fetch initial data on mount
  onMounted(() => {
    fetchPaginatedUsers(1);
  });
</script>

<style>
  *::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  *::-webkit-scrollbar:horizontal {
    height: 6px;
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
