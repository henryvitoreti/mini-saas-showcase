<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import ShowcaseHomeFeatures from './components/ShowcaseHomeFeatures.vue';

const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <DefaultLayout>
    <template #home-features-before>
      <ShowcaseHomeFeatures />
    </template>
  </DefaultLayout>
</template>
