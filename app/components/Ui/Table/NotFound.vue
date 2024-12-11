<template>
  <div class="notFound flex flex-col items-center justify-center py-10 text-center">
    <p class="text-lg font-semibold text-muted-foreground">No matching results found.</p>
    <p class="text-sm text-muted-foreground">
      Try adjusting your search or filter criteria to find what you're looking for.
    </p>
  </div>
</template>
<style scoped>
  .notFound {
    @apply flex flex-col items-center justify-center py-10 text-center;
  }

  .notFound img {
    @apply mb-4 h-24 w-24 opacity-70;
  }

  .notFound p {
    @apply text-muted-foreground;
  }

  .notFound p:first-child {
    @apply text-lg font-semibold;
  }

  .notFound p:last-child {
    @apply text-sm;
  }
</style>
