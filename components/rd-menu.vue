<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-menu-image-container">
      <img :src="data.image_url || '/menu-default.svg'" class="rd-menu-image" />
      <div v-if="data.make_duration" class="rd-menu-tag" style="top: -0.5rem">
        <div class="rd-menu-tag-icon-container">
          <rd-svg
            class="rd-menu-tag-icon"
            name="clock-outline"
            color="secondary"
          />
        </div>
        <span class="rd-menu-tag-name rd-headline-6">{{
          `${data.make_duration} hari`
        }}</span>
      </div>
      <div
        v-if="data.eligible_promos"
        class="rd-menu-tag rd-menu-tag-promo"
        style="bottom: -0.5rem"
      >
        <div class="rd-menu-tag-icon-container">
          <rd-svg
            class="rd-menu-tag-icon"
            name="alert-decagram"
            color="secondary"
          />
        </div>
        <span class="rd-menu-tag-name rd-headline-6">promo</span>
      </div>
    </div>
    <div class="rd-menu-details-container">
      <div class="rd-menu-details">
        <span class="rd-menu-name rd-headline-5">{{ data.name }}</span>
        <span
          v-if="data.description"
          class="rd-menu-description rd-caption-text"
          >{{
            `${data.description?.slice(0, viewMode === "mobile" ? 55 : 75)}...`
          }}</span
        >
        <span
          v-else
          class="rd-menu-description rd-menu-description-empty rd-caption-text"
          >Tidak ada deskripsi</span
        >
      </div>
      <span class="rd-menu-price rd-headline-5">{{
        `Rp ${(data.markup_price || data.price).toLocaleString("de-DE")}`
      }}</span>
    </div>
    <div
      class="rd-menu-actions-container"
      :class="cart ? 'rd-menu-actions-container-active' : ''"
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
        <rd-svg v-if="!cart" name="plus" color="secondary" />
        <span v-else class="rd-menu-action-main-quantity rd-headline-6">{{
          cart.quantity
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Menu, MenuCart } from "~~/interfaces/menus";

  const { viewMode } = useMain();
  const props = defineProps<{
    data: Menu;
    cart?: MenuCart;
  }>();
  const emits = defineEmits(["add", "subtract"]);
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    padding: 0.75rem;
    border: var(--border);
    background: var(--background-depth-one-color);
    border-radius: 0.75rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .rd-menu-image-container {
      position: relative;
      width: 4rem;
      height: 4rem;
      border-radius: 0.5rem;
      background: var(--background-depth-two-color);
      display: flex;
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
      position: relative;
      width: calc(100% - 5.5rem);
      height: 4rem;
      padding: 0 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .rd-menu-details {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        span.rd-menu-name {
          position: relative;
        }
        span.rd-menu-description {
          position: relative;
          width: 100%;
          margin-top: 0.125rem;
          word-break: break-all;
          &.rd-menu-description-empty {
            font-style: italic;
          }
        }
      }
      span.rd-menu-price {
        position: relative;
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
