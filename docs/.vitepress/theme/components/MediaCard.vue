<script setup lang="ts">
import { withBase } from 'vitepress';
import { computed, nextTick, ref } from 'vue';

const props = defineProps<{
  alt: string;
  mediaType: 'image' | 'video';
  src: string;
  title: string;
  details?: string;
}>();

const unavailable = ref(false);
const expanded = ref(false);
const dialog = ref<HTMLElement | null>(null);
const mediaSrc = computed(() => withBase(props.src));
const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });
const isManipulating = ref(false);
const imageTransform = computed(() => `translate3d(${pan.value.x}px, ${pan.value.y}px, 0) scale(${zoom.value})`);
const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`);

const minZoom = 1;
const maxZoom = 4;
const zoomStep = 0.5;

type PointerPosition = { x: number; y: number };

const activePointers = new Map<number, PointerPosition>();
let panStart: { pointer: PointerPosition; offset: PointerPosition } | null = null;
let pinchStart: { distance: number; center: PointerPosition; offset: PointerPosition; zoom: number } | null = null;

function markUnavailable(): void {
  unavailable.value = true;
}

async function openExpanded(): Promise<void> {
  resetView();
  expanded.value = true;
  await nextTick();
  dialog.value?.focus();
}

function closeExpanded(): void {
  expanded.value = false;
  activePointers.clear();
  isManipulating.value = false;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function setZoom(value: number): number {
  const nextZoom = clamp(Math.round(value * 100) / 100, minZoom, maxZoom);
  zoom.value = nextZoom;

  if (nextZoom === minZoom) {
    pan.value = { x: 0, y: 0 };
  }

  return nextZoom;
}

function zoomIn(): void {
  setZoom(zoom.value + zoomStep);
}

function zoomOut(): void {
  setZoom(zoom.value - zoomStep);
}

function resetView(): void {
  zoom.value = minZoom;
  pan.value = { x: 0, y: 0 };
}

function toggleZoom(): void {
  if (zoom.value === minZoom) {
    setZoom(2);
    return;
  }

  resetView();
}

function distance(first: PointerPosition, second: PointerPosition): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function center(first: PointerPosition, second: PointerPosition): PointerPosition {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function beginPinch(): void {
  const [first, second] = Array.from(activePointers.values());

  if (!first || !second) {
    return;
  }

  pinchStart = {
    distance: distance(first, second),
    center: center(first, second),
    offset: { ...pan.value },
    zoom: zoom.value,
  };
  panStart = null;
}

function handlePointerDown(event: PointerEvent): void {
  const viewport = event.currentTarget as HTMLElement;
  viewport.setPointerCapture(event.pointerId);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  isManipulating.value = true;

  if (activePointers.size === 1) {
    panStart = {
      pointer: { x: event.clientX, y: event.clientY },
      offset: { ...pan.value },
    };
    return;
  }

  if (activePointers.size === 2) {
    beginPinch();
  }
}

function handlePointerMove(event: PointerEvent): void {
  if (!activePointers.has(event.pointerId)) {
    return;
  }

  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (activePointers.size === 1 && panStart && zoom.value > minZoom) {
    pan.value = {
      x: panStart.offset.x + event.clientX - panStart.pointer.x,
      y: panStart.offset.y + event.clientY - panStart.pointer.y,
    };
    return;
  }

  if (activePointers.size !== 2 || !pinchStart) {
    return;
  }

  const [first, second] = Array.from(activePointers.values());
  if (!first || !second || pinchStart.distance === 0) {
    return;
  }

  const currentCenter = center(first, second);
  const nextZoom = setZoom(pinchStart.zoom * (distance(first, second) / pinchStart.distance));

  if (nextZoom > minZoom) {
    pan.value = {
      x: pinchStart.offset.x + currentCenter.x - pinchStart.center.x,
      y: pinchStart.offset.y + currentCenter.y - pinchStart.center.y,
    };
  }
}

function handlePointerEnd(event: PointerEvent): void {
  activePointers.delete(event.pointerId);

  if (activePointers.size === 1) {
    const [remainingPointer] = Array.from(activePointers.values());
    if (remainingPointer) {
      panStart = {
        pointer: remainingPointer,
        offset: { ...pan.value },
      };
    }
  } else {
    panStart = null;
  }

  pinchStart = null;
  isManipulating.value = activePointers.size > 0;
}

function handleWheel(event: WheelEvent): void {
  event.preventDefault();
  setZoom(zoom.value + (event.deltaY < 0 ? zoomStep : -zoomStep));
}

function handleZoomKeyboard(event: KeyboardEvent): void {
  if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    zoomIn();
  } else if (event.key === '-' || event.key === '_') {
    event.preventDefault();
    zoomOut();
  } else if (event.key === '0') {
    event.preventDefault();
    resetView();
  }
}
</script>

<template>
  <figure class="media-card">
    <div v-if="!unavailable" class="media-card__preview">
      <img
        v-if="mediaType === 'image'"
        :src="mediaSrc"
        :alt="alt"
        loading="lazy"
        @error="markUnavailable"
      >
      <video
        v-else
        controls
        preload="metadata"
        @error="markUnavailable"
      >
        <source :src="mediaSrc" type="video/webm" @error="markUnavailable">
        Seu navegador não suporta vídeo WebM.
      </video>
      <button
        v-if="mediaType === 'image'"
        class="media-card__expand"
        type="button"
        :aria-label="`Ampliar ${title}`"
        @click="openExpanded"
      >
        <span aria-hidden="true">⤢</span>
        Ampliar
      </button>
    </div>
    <div v-else class="media-card__missing" role="status">
      <span>Mídia pendente</span>
    </div>
    <figcaption>
      <strong>{{ title }}</strong><span v-if="details"> · {{ details }}</span>
    </figcaption>
  </figure>

  <Teleport to="body">
    <div
      v-if="expanded"
      ref="dialog"
      class="media-lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="`Visualização ampliada: ${title}`"
      tabindex="-1"
      @click.self="closeExpanded"
      @keydown.esc="closeExpanded"
    >
      <div class="media-lightbox__content">
        <button class="media-lightbox__close" type="button" aria-label="Fechar visualização ampliada" @click="closeExpanded">×</button>
        <template v-if="mediaType === 'image'">
          <div
            class="media-lightbox__viewport"
            :class="{ 'is-manipulating': isManipulating }"
            role="group"
            :aria-label="`Imagem ${title}. Use pinça ou os controles para ampliar.`"
            tabindex="0"
            @dblclick="toggleZoom"
            @keydown="handleZoomKeyboard"
            @pointercancel="handlePointerEnd"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerEnd"
            @wheel="handleWheel"
          >
            <img
              :src="mediaSrc"
              :alt="alt"
              draggable="false"
              :style="{ transform: imageTransform }"
            >
          </div>
          <div class="media-lightbox__controls" aria-label="Controles de zoom">
            <button type="button" aria-label="Diminuir zoom" :disabled="zoom === minZoom" @click="zoomOut">−</button>
            <output aria-live="polite">{{ zoomLabel }}</output>
            <button type="button" aria-label="Aumentar zoom" :disabled="zoom === maxZoom" @click="zoomIn">+</button>
            <button type="button" :disabled="zoom === minZoom" @click="resetView">Redefinir</button>
          </div>
          <p class="media-lightbox__hint">Pinçe ou role para ampliar; arraste a imagem ampliada para navegar.</p>
        </template>
        <video v-else controls preload="metadata">
          <source :src="mediaSrc" type="video/webm">
          Seu navegador não suporta vídeo WebM.
        </video>
      </div>
    </div>
  </Teleport>
</template>
