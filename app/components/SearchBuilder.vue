<template>
  <div>
    <div
      v-for="(filter, index) in filters"
      :key="index"
      class="mb-2 flex w-full items-center space-x-2 md:w-6/12"
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
            :disabled="
              !condition.type.includes(
                columns.find((c) => c.value === filter.column)?.type as string
              )
            "
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
        size="sm"
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
    { label: "Name", value: "first_name", type: "string" },
    { label: "ID", value: "id", type: "number" },
    { label: "Order Type", value: "order_type", type: "string" },
    { label: "Phone Number", value: "phone_number", type: "string" },
    { label: "Provider Message", value: "provider_message", type: "string" },
    { label: "Submission Datetime", value: "submission_datetime", type: "string" },
  ];
  const conditions = [
    { label: "Equals", value: "equals", type: ["string", "number"] },
    { label: "Contains", value: "contains", type: ["string"] },
    { label: "Starts With", value: "starts with", type: ["string"] },
    { label: "Ends With", value: "ends with", type: ["string"] },
    { label: "Greater Than", value: "greater than", type: ["number"] },
    { label: "Less Than", value: "less than", type: ["number"] },
  ];

  const emit = defineEmits(["updateFilters"]);

  const addFilter = () => {
    filters.value.push({ column: "", condition: "", value: "" });
  };

  const removeFilter = (index: number) => {
    filters.value.splice(index, 1);
  };

  const applyFilters = () => {
    filters.value.forEach((e, i) => {
      const selectedColumn = columns.find((c) => c.value === e.column);
      const selectedCondition = conditions.find((c) => c.value === e.condition);
      if (!selectedCondition?.type.includes(selectedColumn?.type as string)) {
        push.error({
          title: "Conflict Detected",
          message: "invalid filter removed!",
          duration: Infinity,
        });
        removeFilter(i);
      }
    });

    emit("updateFilters", filters.value);
  };
</script>
