<template>
  <div class="rd-panel" ref="rdPanel">
    <div
      v-if="label"
      class="rd-panel-header"
      :class="headerActive ? 'rd-panel-header-active' : ''"
    >
      <rd-input-button-small
        class="rd-panel-button"
        :icon="'arrow-left'"
        @clicked="exit"
      />
      <h2 v-if="label" class="rd-panel-title rd-headline-5">{{ label }}</h2>
    </div>
    <div
      class="rd-panel-body"
      @scroll="scrollHandler"
      :class="!label ? 'rd-panel-body-full' : ''"
    >
      <h2 v-if="label" class="rd-panel-title rd-headline-3">{{ label }}</h2>
      <div class="rd-panel-content">
        <slot />
      </div>
    </div>
    <div
      class="rd-panel-overlay"
      :class="loading ? 'rd-panel-overlay-active' : ''"
    >
      <rd-progress-bar
        :state="loading ? 'show' : 'hide'"
        class="rd-panel-overlay-loading"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";
  import { ViewMode } from "~~/interfaces/general";

  const { viewMode } = useMain();
  const props = defineProps<{
    label?: string;
    state: "idle" | "hide";
    loading?: boolean;
  }>();
  const emits = defineEmits(["exit"]);

  const rdPanel = ref<HTMLDivElement>(null);

  const scrollValue = ref<number>(0);
  const scrollThreshold = ref<number>(0);

  const rem: ComputedRef<number> = computed((): number =>
    typeof getComputedStyle === "function"
      ? parseInt(getComputedStyle(document.body).fontSize)
      : 0
  );
  const headerActive: ComputedRef<boolean> = computed(
    (): boolean => scrollValue.value >= scrollThreshold.value
  );

  const animate = {
    init(rdPanel: HTMLElement): void {
      const tl: GSAPTimeline = gsap.timeline();

      tl.to(rdPanel, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
      });
    },
    exit(viewMode: ViewMode, rdPanel: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      if (viewMode === "mobile") {
        tl.to(rdPanel, {
          y: "125%",
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else {
        tl.to(rdPanel, {
          x: "125%",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    },
  };

  function scrollHandler({ target }: Event): void {
    if (target instanceof HTMLElement) {
      scrollValue.value = target.scrollTop;
    }
  }

  function exit(): void {
    animate.exit(viewMode.value, rdPanel.value, () => {
      emits("exit");
    });
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") exit();
    }
  );

  onMounted(() => {
    scrollThreshold.value = 2 * rem.value;
    animate.init(rdPanel.value);
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--background-depth-one-color);
    overflow-y: hidden;
    overflow-x: visible;
    display: flex;
    flex-direction: column;
    transform: translateY(125%);
    .rd-panel-header {
      z-index: 2;
      position: relative;
      width: 100%;
      height: 4rem;
      background: var(--background-depth-one-color);
      padding: 1rem;
      box-sizing: border-box;
      box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-one-color);
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      .rd-panel-button {
        position: absolute;
        top: 1rem;
        left: 1rem;
      }
      .rd-panel-title {
        position: relative;
        opacity: 0;
        transform: scale(0.875);
        transition: 0.25s opacity, 0.25s transform;
      }
      &.rd-panel-header-active {
        box-shadow: none;
        .rd-panel-title {
          opacity: 1;
          transform: scale(1);
        }
        &::after {
          opacity: 0.05;
        }
      }
      &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--font-color);
        opacity: 0;
        transition: 0.25s opacity;
      }
    }
    .rd-panel-body {
      z-index: 1;
      position: relative;
      width: 100%;
      height: calc(100% - 4rem);
      padding: 1rem 1rem 0 1rem;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      h2.rd-panel-title {
        position: relative;
        width: 100%;
        height: 1rem;
        margin-bottom: 1rem;
        display: flex;
        flex-shrink: 0;
        align-items: center;
      }
      .rd-panel-content {
        position: relative;
        width: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
      }
      &.rd-panel-body-full {
        height: 100%;
      }
    }
    .rd-panel-overlay {
      pointer-events: none;
      z-index: 999999;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 1rem;
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.25s opacity;
      .rd-panel-overlay-loading {
        z-index: 2;
      }
      &::before {
        z-index: 0;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
      }
      &::after {
        z-index: 1;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--font-color);
        opacity: 0.25;
      }
      &.rd-panel-overlay-active {
        pointer-events: all;
        opacity: 1;
      }
    }
    @media only screen and (min-width: 1025px) {
      left: auto;
      top: 0;
      right: 0;
      width: 20rem;
      border-left: var(--border);
      box-sizing: border-box;
      transform: translateX(125%);
      .rd-panel-header {
        height: 6rem;
        padding: 2rem;
        .rd-panel-button {
          top: 2rem;
          left: 2rem;
        }
      }
      .rd-panel-body {
        padding: 1rem 2rem;
        height: calc(100% - 6rem);
      }
    }
  }
</style>
