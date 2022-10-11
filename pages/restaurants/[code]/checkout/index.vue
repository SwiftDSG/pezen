<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-page">
      <div class="rd-page-header">
        <rd-input-button-small icon="arrow-left" />
        <span v-if="viewMode === 'desktop'" class="rd-page-name rd-headline-3">
          Checkout
        </span>
      </div>
      <div v-if="cart" class="rd-page-body">
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

  onMounted(() => {
    loadCart(route.params.code.toString());
    if (!cart.value) {
      emits("change-page", `/restaurants/${route.params.code}?type=dine-in`);
    }
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
        position: relative;
        width: 100%;
        height: 4rem;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
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
          span.rd-page-name {
            position: relative;
            opacity: 1;
            margin-left: 1rem;
            transform: none;
          }
        }
        .rd-page-body {
          position: relative;
          width: 100%;
          height: calc(100vh - 6rem);
          margin-top: 6rem;
          display: flex;
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
