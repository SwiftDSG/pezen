<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-header">
      <span class="rd-title rd-headline-3">{{ label }}</span>
    </div>
    <div class="rd-body">
      <div v-for="menu in data || []" :key="menu._id" class="rd-menu">
        <div class="rd-menu-background">
          <img
            :src="menu.image_url || '/menu-default.svg'"
            class="rd-menu-background-image"
          />
        </div>
        <div class="rd-menu-details">
          <span class="rd-menu-price rd-headline-6">{{
            `Rp ${menu.markup_price.toLocaleString("de-DE")}`
          }}</span>
        </div>
        <div class="rd-menu-details">
          <span class="rd-menu-restaurant-name rd-caption-text">{{
            menu.restaurant.name
          }}</span>
          <span class="rd-menu-name rd-headline-5">{{ menu.name }}</span>
        </div>
      </div>
      <div v-if="!data.length" class="rd-menu-empty">
        <div class="rd-menu-empty-details">
          <span class="rd-menu-empty-value rd-headline-5"
            >Tidak ada jadwal untuk hari ini</span
          >
          <span class="rd-menu-empty-placeholder rd-caption-text"
            >Coba hari lainnya</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Menu } from "~~/interfaces/menus";

  const props = defineProps<{
    label: string;
    data: Menu[];
  }>();
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .rd-header {
      position: relative;
      width: 100%;
      height: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .rd-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 0.5rem;
      .rd-menu {
        position: relative;
        width: calc((100vw - 2.5rem) / 2);
        height: calc((100vw - 2.5rem) / 2);
        padding: 0.75rem;
        box-sizing: border-box;
        background: var(--primary-color);
        border-radius: 0.75rem;
        overflow: hidden;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .rd-menu-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img.rd-menu-background-image {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 0.75rem;
            object-fit: cover;
          }
          &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.375);
            border-radius: 0.75rem;
          }
        }
        .rd-menu-details {
          position: relative;
          width: 100%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .rd-menu-details-row {
            position: relative;
            width: 100%;
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            .rd-menu-detail {
              position: relative;
              width: 50%;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              .rd-menu-placeholder {
                position: relative;
                margin-bottom: 0.125rem;
              }
            }
          }
          span.rd-menu-price {
            position: relative;
            height: 1rem;
            padding: 0 0.375rem;
            margin-right: 0.5rem;
            background: rgba(0, 0, 0, 0.25);
            color: inherit;
            backdrop-filter: blur(10px);
            border-radius: 0.5rem;
            white-space: nowrap;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          span.rd-menu-name {
            width: 100%;
            padding-right: 10%;
            line-height: 1.2;
            box-sizing: border-box;
            margin-top: 0.125rem;
            text-align: left;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
          }
        }
      }
    }
    .rd-menu-empty {
      position: relative;
      width: 100%;
      height: calc((100vw - 2.5rem) / 2);
      padding: 0.75rem;
      box-sizing: border-box;
      background: var(--primary-color);
      border-radius: 0.75rem;
      overflow: hidden;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      .rd-menu-empty-details {
        position: relative;
        width: 100%;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        span.rd-menu-empty-value {
          position: relative;
          width: 100%;
          padding-right: 15%;
          margin-bottom: 0.25rem;
          text-align: left;
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      .rd-header {
        height: 2rem;
        flex-shrink: 0;
      }
      .rd-body {
        flex-shrink: 0;
        .rd-menu {
          width: calc((((100vw - 7rem) / 4) - 0.5rem) / 2);
          height: calc((((100vw - 7rem) / 4) - 0.5rem) / 2);
          flex-shrink: 0;
        }
      }
    }
  }
</style>
