<template>
  <th :class="styles({ class: props.class })" class="hover:bg-muted/50">
    <slot />
    <span style="display: inline-block" v-if="sortOrder">
      <svg
        fill="#000000"
        height="10px"
        width="10px"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 330 330"
        xml:space="preserve"
        class="ms-2"
        :style="sortOrder === 'asc' ? '' : sortOrder === 'desc' ? 'rotate: 180deg;' : ''"
        :class="{ scaled: isStroke }"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            :class="{ stroke: isStroke }"
            id="XMLID_224_"
            d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
          ></path>
        </g>
      </svg>
      <!-- <span v-if="sortOrder === 'asc'">▲</span>
      <span v-else-if="sortOrder === 'desc'">▼</span> -->
    </span>
  </th>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    class?: string;
    isStroke?: boolean;
    sortOrder?: "asc" | "desc" | "";
  }>();

  const styles = tv({
    base: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
  });
</script>
<style>
  .stroke {
    stroke: #000000;
    stroke-width: 30px;
  }
  .scaled {
    scale: 1.1;
  }
</style>
