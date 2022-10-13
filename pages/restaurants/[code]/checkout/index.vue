<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-page">
      <div
        class="rd-page-header"
        :class="headerActive ? 'rd-page-header-active' : ''"
      >
        <rd-input-button-small icon="arrow-left" />
        <h2
          class="rd-page-name"
          :class="viewMode === 'desktop' ? 'rd-headline-3' : 'rd-headline-5'"
        >
          Checkout
        </h2>
      </div>
      <div v-if="cart" class="rd-page-body">
        <h2 v-if="viewMode === 'mobile'" class="rd-page-title rd-headline-3">
          Checkout
        </h2>
        <rd-menu-arranger
          v-if="cart.method.type === 'pre-order'"
          :data="cart.items"
        />
      </div>
    </div>
    <div class="rd-panel"></div>
  </div>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";

  const route = useRoute();
  const { viewMode } = useMain();
  const { cart, loadCart } = useOrders();
  const emits = defineEmits(["open-panel", "change-page"]);

  const scrollValue = ref<number>(0);
  const scrollThreshold = ref<number>(0);

  function scrollHandler(): void {
    scrollValue.value = document.documentElement.scrollTop;
  }

  const rem: ComputedRef<number> = computed((): number =>
    typeof getComputedStyle === "function"
      ? parseInt(getComputedStyle(document.body).fontSize)
      : 0
  );
  const headerActive: ComputedRef<boolean> = computed(
    (): boolean => scrollValue.value >= scrollThreshold.value
  );

  onMounted(() => {
    scrollThreshold.value = 2 * rem.value;
    loadCart(route.params.code.toString());

    window.addEventListener("scroll", scrollHandler);

    if (!cart.value) {
      emits("change-page", `/restaurants/${route.params.code}?type=dine-in`);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", scrollHandler);
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    .rd-page {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-page-header {
        z-index: 2;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4rem;
        padding: 1rem;
        background: var(--background-depth-two-color);
        box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-two-color);
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        h2.rd-page-name {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transform: scale(0.875);
          transition: 0.25s opacity, 0.25s transform;
        }
        &.rd-page-header-active {
          box-shadow: none;
          h2.rd-page-name {
            opacity: 1;
            transform: scale(1);
          }

          &::before {
            opacity: 1;
          }
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--background-depth-one-color);
          border-bottom: var(--border);
          opacity: 0;
          transition: 0.25s opacity;
        }
      }
      .rd-page-body {
        z-index: 1;
        position: relative;
        width: 100%;
        margin-top: 5rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        h2.rd-page-title {
          position: relative;
          width: 100%;
          height: 1rem;
          padding: 0 1rem;
          margin-bottom: 1rem;
          box-sizing: border-box;
          display: flex;
          flex-shrink: 0;
          align-items: center;
        }
      }
    }
    .rd-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      background: var(--background-depth-one-color);
    }
    @media only screen and (min-width: 1025px) {
      height: 100vh;
      flex-direction: row;
      .rd-page {
        position: elative;
        width: calc(100% - 20rem);
        height: 100%;
        display: flex;
        flex-direction: column;
        .rd-page-header {
          position: fixed;
          top: 0;
          left: 0;
          height: 6rem;
          border-bottom: var(--border);
          background: var(--background-depth-one-color);
          padding: 2rem;
          box-sizing: border-box;
          h2.rd-page-name {
            position: relative;
            width: auto;
            opacity: 1;
            margin-left: 1rem;
            transform: none;
          }
        }
        .rd-page-body {
          height: calc(100vh - 6rem);
          margin-top: 6rem;
        }
      }
      .rd-panel {
        position: relative;
        width: 20rem;
        height: 100%;
        padding: 2rem;
        border-left: var(--border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
