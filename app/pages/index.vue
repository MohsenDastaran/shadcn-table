<template>
  <UiContainer class="py-5" :key="appKey">
    <h1 class="mb-1 text-2xl font-bold">Users</h1>

    <!-- Search Input -->
    <UiInput
      v-model="searchTerm"
      type="text"
      placeholder="Search users by name, email, or phone..."
      class="mb-5 w-full rounded-md border p-2"
      @input="onSearch"
    />
    <SearchBuilder @updateFilters="handleFilters" />
    <UiGradientDivider class="my-3" />

    <div class="my-3 flex gap-1">
      <UiButton variant="outline" @click="copyToClipboard(userStore.allUsers)">Copy</UiButton>
      <UiButton variant="outline" @click="exportToCSV(userStore.allUsers)">CSV</UiButton>
      <UiButton variant="outline" @click="exportToExcel(userStore.allUsers)">Excel</UiButton>
      <UiButton variant="outline" @click="printTable(userStore.allUsers)">Print</UiButton>
      <UiButton variant="gooeyLeft" class="ml-auto" @click="resetApp">Reset</UiButton>
    </div>
    <UiGradientDivider />
    <div class="h-[650px] overflow-y-auto">
      <UiTableNotFound v-if="!users.length"> </UiTableNotFound>
      <div v-else class="mt-2">
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
                    <p class="hidden font-medium lg:block">{{ user.first_name }}</p>
                    <UiAccordion class="lg:hidden">
                      <UiAccordionItem :value="user.first_name">
                        <UiAccordionHeader>
                          <UiAccordionTrigger
                            class="mb-2 rounded-md px-3 text-left text-sm underline-offset-2 hover:bg-muted hover:no-underline"
                            ><p class="font-medium">{{ user.first_name }}</p></UiAccordionTrigger
                          >
                        </UiAccordionHeader>
                        <UiAccordionContent>
                          <p class="text-muted-foreground">
                            <strong class="mx-2">ID:</strong>{{ user.id }}
                          </p>
                          <p class="text-muted-foreground">
                            <strong class="mx-2">Order Type:</strong>{{ user.order_type }}
                          </p>
                          <p class="text-muted-foreground">
                            <strong class="mx-2">Datetime:</strong>{{ user.submission_datetime }}
                          </p>
                        </UiAccordionContent>
                      </UiAccordionItem>
                    </UiAccordion>
                  </div>
                </UiTableCell>
                <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">{{
                  user.id
                }}</UiTableCell>
                <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">{{
                  user.order_type
                }}</UiTableCell>
                <UiTableCell class="pl-0 text-muted-foreground">
                  <UiButton
                    :to="`tel:${user.phone_number}`"
                    variant="linkHover2"
                    class="phone-number"
                  >
                    {{ user.phone_number }}</UiButton
                  >
                  <!-- {{ user.phone_number }} -->
                </UiTableCell>
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
  import debounce from "lodash";
  import { onMounted, ref } from "vue";

  const userStore = useUserStore();
  const appKey = ref<number>(0);
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
  const onSearch = debounce.debounce(async () => {
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

  const resetApp = async () => {
    appKey.value++;
    searchTerm.value = "";

    // Re-fetch initial data
    await fetchPaginatedUsers(1);
    onSearch();
    handleFilters([]);
    push.success({
      title: "Success",
      message: "Reset Table data",
    });
  };
  onMounted(() => {
    fetchPaginatedUsers(1);
  });
</script>

<style src="../assets/css/styles.css"></style>
