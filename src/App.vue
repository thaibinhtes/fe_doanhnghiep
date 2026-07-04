<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <ImportToast />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import ImportToast from './components/common/ImportToast.vue'
</script>
