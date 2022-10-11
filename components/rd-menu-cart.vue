<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-menu-image-container">
      <img :src="data.image_url || '/menu-default.svg'" class="rd-menu-image" />
    </div>
    <div class="rd-menu-details-container">
      <div class="rd-menu-details">
        <span class="rd-menu-name rd-headline-5">{{ data.name }}</span>
        <span class="rd-menu-price rd-caption-text">{{
          `Rp ${(data.markup_price || data.price).toLocaleString("de-DE")}`
        }}</span>
      </div>
    </div>
    <div
      class="rd-menu-actions-container"
      :class="data ? 'rd-menu-actions-container-active' : ''"
    >
      <div class="rd-menu-action rd-menu-action-add">
        <rd-input-button-smaller icon="plus" @clicked="emits('add', data)" />
      </div>
      <div class="rd-menu-action rd-menu-action-subtract">
        <rd-input-button-smaller
          icon="minus"
          @clicked="emits('subtract', data)"
        />
      </div>
      <div class="rd-menu-action-main" @click="emits('add', data)">
        <span class="rd-menu-action-main-quantity rd-headline-6">{{
          data.quantity
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { MenuCart } from "~~/interfaces/menus";

  const { viewMode } = useMain();
  const props = defineProps<{
    data: MenuCart;
  }>();
  const emits = defineEmits(["add", "subtract"]);
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    height: calc(5.5rem + 2px) !important;
    padding: 0.75rem !important;
    border: var(--border);
    background: var(--background-depth-one-color);
    border-radius: 0.75rem;
    box-sizing: border-box;
    overflow: hidden !important;
    display: flex;
    flex-direction: row !important;
    justify-content: space-between;
    .rd-menu-image-container {
      pointer-events: none;
      position: relative;
      width: 4rem;
      height: 4rem;
      border-radius: 0.5rem;
      background: var(--background-depth-two-color);
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      img.rd-menu-image {
        z-index: 0;
        position: relative;
        width: 4rem;
        height: 4rem;
        border-radius: 0.5rem;
        object-fit: cover;
      }
      .rd-menu-tag {
        position: absolute;
        left: 50%;
        height: 1rem;
        padding: 0 0.25rem 0 0;
        margin-right: 0.25rem;
        border-radius: 0.25rem;
        background: var(--primary-color);
        display: flex;
        flex-shrink: 0;
        align-items: center;
        transform: translateX(-50%);
        .rd-menu-tag-icon-container {
          position: relative;
          width: 1rem;
          height: 1rem;
          padding: 0 0.125rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        span.rd-menu-tag-name {
          position: relative;
          white-space: nowrap;
          color: #fff;
        }
        &.rd-menu-tag-promo {
          background: var(--error-color);
        }
      }
      &::before {
        z-index: 1;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        background: #555;
        opacity: 0.05;
      }
    }
    .rd-menu-details-container {
      pointer-events: none;
      position: relative;
      width: calc(100% - 6rem);
      height: 4rem;
      padding: 0 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      justify-content: center;
      .rd-menu-details {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        span.rd-menu-name {
          position: relative;
        }
        span.rd-menu-price {
          position: relative;
          margin-top: 0.125rem;
        }
      }
    }
    .rd-menu-actions-container {
      position: relative;
      width: 2rem;
      height: 4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .rd-menu-action-main {
        cursor: pointer;
        position: relative;
        width: 2rem;
        height: 2rem;
        background: var(--primary-color);
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        span.rd-menu-action-main-quantity {
          position: relative;
          line-height: 1;
          color: #fff;
        }
      }
      .rd-menu-action {
        position: absolute;
        width: 100%;
        height: 1rem;
        transition: 0.25s transform;
        &.rd-menu-action-add {
          top: 0;
          transform: translateY(100%);
        }
        &.rd-menu-action-subtract {
          bottom: 0;
          transform: translateY(-100%);
        }
      }
      &.rd-menu-actions-container-active {
        .rd-menu-action {
          transform: translateY(0);
        }
      }
    }
  }
</style>
