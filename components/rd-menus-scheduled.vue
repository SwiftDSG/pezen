<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-header">
      <span class="rd-title rd-headline-3">{{ label }}</span>
    </div>
    <div class="rd-body">
      <div class="rd-day-selector-container">
        <div
          v-for="n in availableDates"
          :class="n === selectedDate ? 'rd-day-selector-active' : ''"
          :key="n"
          @click="selectedDate = n"
          class="rd-day-selector"
        >
          <div class="rd-day-selector-circle"></div>
          <span class="rd-day-selector-name rd-headline-6">
            {{ days[new Date(n).getDay()].slice(0, 3) }}
          </span>
          <div class="rd-day-selector-indicator"></div>
        </div>
      </div>
      <div v-if="dates[selectedDate]?.length" class="rd-menus-container">
        <div
          v-for="menu in dates[selectedDate] || []"
          :key="menu._id"
          class="rd-menu"
        >
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
            <div class="rd-menu-details-row">
              <div class="rd-menu-detail">
                <span class="rd-menu-placeholder rd-caption-text">Porsi</span>
                <span class="rd-menu-value rd-headline-5">{{
                  `${menu.portion} orang`
                }}</span>
              </div>
              <div class="rd-menu-detail">
                <span class="rd-menu-placeholder rd-caption-text">Stock</span>
                <span class="rd-menu-value rd-headline-5">{{
                  menu.stock?.available
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="rd-menu-empty">
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
  import { ComputedRef } from "vue";
  import { HomeData } from "~~/interfaces/general";
  import { MenuPack } from "~~/interfaces/menus";

  const props = defineProps<{
    label: string;
    data: HomeData["menus"]["pack"];
  }>();

  const selectedDate = ref<number>(
    new Date().setHours(23, 59, 59, 999) + 86400000
  );

  const availableDates: ComputedRef<number[]> = computed(() => {
    let arr: number[] = [];
    for (let i = 0; i < 7; i++) {
      arr.push(
        new Date(new Date().getTime() + i * 86400000).setHours(23, 59, 59, 999)
      );
    }
    return arr;
  });
  const dates: ComputedRef<{ [key: number]: MenuPack[] }> = computed(() => {
    const obj: { [key: number]: MenuPack[] } = {};
    for (const { date, items } of props.data) {
      if (obj[new Date(date).getTime()])
        obj[new Date(date).getTime()].push(...items);
      else obj[new Date(date).getTime()] = items;
    }
    return obj;
  });

  const days: string[] = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
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
      width: calc(100% + 1rem);
      height: 15rem;
      border-top-left-radius: 0.75rem;
      border-bottom-left-radius: 0.75rem;
      overflow: hidden;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .rd-day-selector-container {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        width: 2.5rem;
        height: 100%;
        border-radius: 0.75rem;
        background: var(--primary-color);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .rd-day-selector {
          cursor: pointer;
          position: relative;
          width: 100%;
          height: 100%;
          flex-shrink: 1;
          opacity: 0.5;
          overflow: hidden;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: 0.2s opacity;
          .rd-day-selector-circle {
            position: relative;
            width: 0.25rem;
            height: 0.25rem;
            border-radius: 50%;
            background: #fff;
            margin-bottom: 0.25rem;
            transition: 0.2s background-color;
          }
          .rd-day-selector-name {
            line-height: 1;
            color: #fff;
          }
          .rd-day-selector-indicator {
            position: absolute;
            top: calc(50% - 0.375rem);
            right: 0;
            height: 0.75rem;
            width: 3px;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            background: #fff;
            transition: 0.2s transform;
            transform: translateX(100%);
          }
          &.rd-day-selector-active {
            opacity: 1;
            .rd-day-selector-indicator {
              transform: translateX(0);
            }
          }
        }
      }
      .rd-menus-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-x: auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .rd-menu {
          position: relative;
          width: 10rem;
          height: 100%;
          padding: 0.75rem;
          box-sizing: border-box;
          background: var(--primary-color);
          border-radius: 0.75rem;
          margin-right: 0.5rem;
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
              padding-right: 30%;
              line-height: 1.2;
              box-sizing: border-box;
              margin-top: 0.125rem;
              text-align: left;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
            }
          }
          &:first-child {
            margin-left: 3rem;
          }
          &:last-child {
            margin-right: 1rem;
          }
        }
      }
      .rd-menu-empty {
        position: relative;
        width: 10rem;
        height: 100%;
        padding: 0.75rem;
        box-sizing: border-box;
        background: var(--primary-color);
        border-radius: 0.75rem;
        margin-left: 3rem;
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
    }
    @media only screen and (min-width: 1025px) {
      height: 100%;
      .rd-header {
        height: 2rem;
      }
      .rd-body {
        width: 100%;
        height: calc(100% - 2rem);
      }
    }
  }
</style>
