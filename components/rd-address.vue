<template>
  <div
    class="rd-component"
    ref="rdComponent"
    :class="`${loading ? 'rd-component-loading' : ''} ${
      active ? 'rd-component-active' : ''
    } ${size === 'desktop' ? 'rd-component-desktop' : ''}`"
    @click="emits('clicked')"
  >
    <div class="rd-address-icon-container">
      <rd-svg
        class="rd-address-icon"
        :name="iconHandler(type)"
        :color="active ? 'secondary' : ''"
      />
    </div>
    <div class="rd-address-details-container">
      <span class="rd-address-name rd-headline-5">{{ data.name }}</span>
      <span class="rd-address-detail rd-caption-text">{{ data.address }}</span>
    </div>
    <rd-progress-bar
      type="overlay"
      :state="loading ? 'show' : 'hide'"
      style="border-radius: 0.75rem"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Position } from "~~/interfaces/general";

  type AddressType = "prompt" | "current" | "home" | "office" | "apartment";

  const props = defineProps<{
    data: Position;
    type: AddressType;
    loading?: boolean;
    active?: boolean;
    size?: "desktop" | "mobile";
  }>();
  const emits = defineEmits(["clicked"]);

  function iconHandler(type: AddressType): string {
    let str: string = "";
    if (type === "prompt") str = "crosshairs-question";
    else if (type === "current") str = "crosshairs-gps";
    else if (type === "home") str = "home";
    else str = "building";
    return str;
  }
</script>

<style lang="scss" scoped>
  .rd-component {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 3rem;
    border-radius: 0.75rem;
    border: var(--border);
    background: var(--background-depth-one-color);
    padding-right: 0.75rem;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .rd-address-icon-container {
      position: relative;
      width: 3rem;
      height: 3rem;
      padding: 0 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .rd-address-details-container {
      position: relative;
      width: calc(100% - 3rem);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      span.rd-address-name {
        position: relative;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span.rd-address-detail {
        position: relative;
        width: 100%;
        margin-top: 0.125rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &.rd-component-active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #fff;
    }
    &.rd-component-loading {
      pointer-events: none;
    }
    &.rd-component-desktop {
      height: calc(100% - 5.5rem);
      border-radius: 0.5rem;
      padding: 0.75rem;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .rd-address-icon-container {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.25rem;
        border-radius: 0.5rem;
        background: var(--background-depth-three-color);
      }
      .rd-address-details-container {
        width: 100%;
        height: auto;
      }
    }
  }
</style>
