<template>
  <th :class="styles({ class: props.class })" class="hover:bg-muted/50">
    <slot />
    <span v-if="sorted">
      <span v-if="sortOrder === 'asc'">▲</span>
      <span v-else-if="sortOrder === 'desc'">▼</span>
    </span>
  </th>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    class?: any;
    sorted?: boolean;
    sortOrder?: string;
  }>();

  const styles = tv({
    base: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
  });
</script>
