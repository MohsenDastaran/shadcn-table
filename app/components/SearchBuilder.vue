<template>
  <div>
    <div
      v-for="(filter, index) in filters"
      :key="index"
      class="flex w-full items-center space-x-2 md:w-6/12"
    >
      <UiSelect v-model="filter.column">
        <UiSelectTrigger placeholder="Column" />
        <UiSelectContent>
          <UiSelectLabel>Select Column</UiSelectLabel>
          <UiSelectSeparator />
          <UiSelectItem
            v-for="(column, i) in columns"
            :key="i"
            :value="column.value"
            :text="column.label"
          />
        </UiSelectContent>
      </UiSelect>
      <UiSelect v-model="filter.condition">
        <UiSelectTrigger placeholder="Condition" />
        <UiSelectContent>
          <UiSelectLabel>Select Condition</UiSelectLabel>
          <UiSelectSeparator />
          <UiSelectItem
            v-for="(condition, i) in conditions"
            :key="i"
            :value="condition.value"
            :text="condition.label"
          />
        </UiSelectContent>
      </UiSelect>
      <UiInput
        v-model="filter.value"
        type="text"
        placeholder="Value"
        class="rounded-md border p-2"
      />
      <UiButton
        size="xs"
        @click="removeFilter(index)"
        variant="secondary"
        class="hover:text-red-800"
        >Delete</UiButton
      >
    </div>
    <div class="my-3 gap-3">
      <UiButton class="me-2" @click="addFilter" variant="outline">Add Condition</UiButton>
      <UiButton class="me-2" @click="applyFilters" variant="gooeyRight">Apply Filters</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineEmits, ref } from "vue";

  const filters = ref<{ column: string; condition: string; value: string }[]>([
    { column: "", condition: "", value: "" },
  ]);
  const columns = [
    { label: "Name", value: "first_name" },
    { label: "ID", value: "id" },
    { label: "Order Type", value: "order_type" },
    { label: "Phone Number", value: "phone_number" },
    { label: "Provider Message", value: "provider_message" },
    { label: "Submission Datetime", value: "submission_datetime" },
  ];
  const conditions = [
    { label: "Equals", value: "equals" },
    { label: "Contains", value: "contains" },
    { label: "Starts With", value: "starts with" },
    { label: "Ends With", value: "ends with" },
    { label: "Greater Than", value: "greater than" },
    { label: "Less Than", value: "less than" },
  ];

  const emit = defineEmits(["updateFilters"]);

  const addFilter = () => {
    filters.value.push({ column: "", condition: "", value: "" });
  };

  const removeFilter = (index: number) => {
    filters.value.splice(index, 1);
  };

  const applyFilters = () => {
    emit("updateFilters", filters.value);
  };
</script>
