<script setup lang="ts">
import { Blocks, Database, Globe, Layers3, ServerCog, ShieldCheck } from '@lucide/vue';
import { useData } from 'vitepress';
import { VPLink } from 'vitepress/theme';
import { computed, type Component } from 'vue';

const iconComponents = {
  blocks: Blocks,
  database: Database,
  globe: Globe,
  'layers-3': Layers3,
  'server-cog': ServerCog,
  'shield-check': ShieldCheck,
} as const;

type IconName = keyof typeof iconComponents;

type ShowcaseFeature = {
  details: string;
  icon: IconName;
  link?: string;
  title: string;
};

const { frontmatter } = useData();
const features = computed(() => (frontmatter.value.showcaseFeatures ?? []) as ShowcaseFeature[]);

function getIcon(icon: IconName): Component {
  return iconComponents[icon];
}
</script>

<template>
  <div v-if="features.length" class="ShowcaseHomeFeatures">
    <div class="container">
      <div class="items">
        <div v-for="feature in features" :key="feature.title" class="item grid-6">
          <VPLink
            class="ShowcaseFeature"
            :href="feature.link"
            :no-icon="true"
            :tag="feature.link ? 'a' : 'div'"
          >
            <article class="box">
              <div class="icon" aria-hidden="true">
                <component :is="getIcon(feature.icon)" :size="22" :stroke-width="1.8" />
              </div>
              <h2 class="title">{{ feature.title }}</h2>
              <p class="details">{{ feature.details }}</p>
            </article>
          </VPLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ShowcaseHomeFeatures {
  position: relative;
  padding: 0 24px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  width: 100%;
  padding: 8px;
}

.ShowcaseFeature {
  display: block;
  height: 100%;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}

.ShowcaseFeature.link:hover {
  border-color: var(--vp-c-brand-1);
}

.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
  color: var(--vp-c-brand-1);
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
}

@media (min-width: 640px) {
  .ShowcaseHomeFeatures {
    padding: 0 48px;
  }

  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .ShowcaseHomeFeatures {
    padding: 0 64px;
  }
}
</style>
