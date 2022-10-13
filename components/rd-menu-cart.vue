<template>
  <div
    class="rd-component"
    ref="rdComponent"
    :class="animationState === 'active' ? 'rd-menu-action-active' : ''"
  >
    <div
      :class="
        animationAction ? `rd-menu-actions-container-${animationAction}` : ''
      "
      class="rd-menu-actions-container"
    >
      <div
        class="rd-menu-action"
        :class="animationState === 'active' ? 'rd-menu-action-active' : ''"
        @click="emit('note')"
      >
        <div class="rd-menu-action-icon-container">
          <rd-svg class="rd-menu-action-icon" name="pencil" color="secondary" />
        </div>
      </div>
      <div
        class="rd-menu-action"
        :class="animationState === 'active' ? 'rd-menu-action-active' : ''"
        @click="emit('delete')"
      >
        <div class="rd-menu-action-icon-container">
          <rd-svg class="rd-menu-action-icon" name="delete" color="secondary" />
        </div>
      </div>
    </div>
    <div ref="rdMenu" class="rd-menu-container">
      <div class="rd-menu-image-container">
        <img
          :src="data.image_url || '/menu-default.svg'"
          class="rd-menu-image"
        />
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
        class="rd-menu-quantity-container"
        :class="data ? 'rd-menu-quantity-container-active' : ''"
      >
        <div class="rd-menu-quantity rd-menu-quantity-add">
          <rd-input-button-smaller icon="plus" @clicked="emits('add', data)" />
        </div>
        <div class="rd-menu-quantity rd-menu-quantity-subtract">
          <rd-input-button-smaller
            icon="minus"
            @clicked="emits('subtract', data)"
          />
        </div>
        <div class="rd-menu-quantity-main" @click="emits('add', data)">
          <span class="rd-menu-quantity-main-quantity rd-headline-6">{{
            data.quantity
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";
  import { MenuCart } from "~~/interfaces/menus";

  const rdComponent = ref<HTMLDivElement>(null);
  const rdMenu = ref<HTMLDivElement>(null);

  const { viewMode } = useMain();
  const props = defineProps<{
    data: MenuCart;
  }>();
  const emits = defineEmits(["add", "subtract", "note", "delete", "drag"]);

  const animationAction = ref<"note" | "delete">(null);
  const animationState = ref<"active" | "inactive">("inactive");

  let animationInterval: NodeJS.Timer = null;
  let animationTimeout: NodeJS.Timeout = null;
  let animationEventLast: MouseEvent | TouchEvent = null;
  let animationEventCurr: MouseEvent | TouchEvent = null;

  const rem: ComputedRef<number> = computed(
    () => parseInt(getComputedStyle(document.documentElement)?.fontSize) || 24
  );

  function dragStart(e: MouseEvent | TouchEvent): void {
    if (viewMode.value === "mobile") {
      document.documentElement.addEventListener("touchmove", dragHandler);
      document.documentElement.addEventListener("touchend", dragEnd);
    } else {
      document.documentElement.addEventListener("mousemove", dragHandler);
      document.documentElement.addEventListener("mouseup", dragEnd);
    }

    if (!animationTimeout) {
      animationTimeout = setTimeout(() => {
        dragEnd();
        emits("drag", e);
      }, 250);
    }

    if (!animationInterval) {
      animationInterval = setInterval(() => {
        if (animationEventCurr && animationEventLast) {
          const x: number =
            rdMenu.value.getBoundingClientRect().x -
            rdComponent.value.getBoundingClientRect().x;

          let dx: number = 0;
          if (
            animationEventCurr instanceof TouchEvent &&
            animationEventLast instanceof TouchEvent
          ) {
            dx =
              animationEventCurr.touches[0].clientX -
              animationEventLast.touches[0].clientX;
          } else if (
            animationEventCurr instanceof MouseEvent &&
            animationEventLast instanceof MouseEvent
          ) {
            dx = animationEventCurr.x - animationEventLast.x;
          }

          if (x > 0) {
            animationAction.value = "note";
          } else {
            animationAction.value = "delete";
          }

          if (x >= 4 * rem.value || x <= -4 * rem.value) {
            dx *= 0.25;
            animationState.value = "active";
          } else {
            animationState.value = "inactive";
          }

          gsap.to(rdMenu.value, {
            x: `+=${dx}`,
            duration: 0,
          });
        }
        animationEventLast = animationEventCurr;
      }, 50 / 3);
    }
  }
  function dragHandler(e: MouseEvent | TouchEvent): void {
    animationEventCurr = e;

    clearTimeout(animationTimeout);
  }
  function dragEnd(): void {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }

    if (viewMode.value === "desktop") {
      document.documentElement.removeEventListener("mousemove", dragHandler);
      document.documentElement.removeEventListener("mouseup", dragEnd);
    } else if (viewMode.value === "mobile") {
      document.documentElement.removeEventListener("touchmove", dragHandler);
      document.documentElement.removeEventListener("touchend", dragEnd);
    }

    animationEventCurr = null;
    animationEventLast = null;

    if (animationState.value === "active") {
      gsap.to(rdMenu.value, {
        x: animationAction.value === "note" ? 4 * rem.value : -4 * rem.value,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(rdMenu.value, {
        x: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }

  function emit(name: "note" | "delete") {
    animationState.value = "inactive";
    dragEnd();
    emits(name, props.data);
  }

  onMounted(() => {
    rdMenu.value.addEventListener(
      viewMode.value === "desktop" ? "mousedown" : "touchstart",
      dragStart
    );
  });
  onBeforeUnmount(() => {
    rdMenu.value.removeEventListener(
      viewMode.value === "desktop" ? "mousedown" : "touchstart",
      dragStart
    );
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    height: calc(5.5rem + 2px) !important;
    overflow: hidden !important;
    display: flex;
    justify-content: space-between;
    .rd-menu-actions-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-menu-action {
        position: relative;
        width: 4rem;
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 1.5rem;
        box-sizing: border-box;
        transform: scale(0.875);
        opacity: 0.5;
        transition: transform 0.25s, opacity 0.25s;
        &.rd-menu-action-active {
          transform: scale(1);
          opacity: 1;
        }
      }
      &.rd-menu-actions-container-note {
        background: var(--primary-color);
      }
      &.rd-menu-actions-container-delete {
        background: var(--error-color);
      }
    }
    .rd-menu-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0.75rem;
      border: var(--border);
      border-radius: 0.75rem;
      box-sizing: border-box;
      background: var(--background-depth-one-color);
      display: flex;
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
      .rd-menu-quantity-container {
        position: relative;
        width: 2rem;
        height: 4rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .rd-menu-quantity-main {
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
          span.rd-menu-quantity-main-quantity {
            position: relative;
            line-height: 1;
            color: #fff;
          }
        }
        .rd-menu-quantity {
          position: absolute;
          width: 100%;
          height: 1rem;
          transition: 0.25s transform;
          &.rd-menu-quantity-add {
            top: 0;
            transform: translateY(100%);
          }
          &.rd-menu-quantity-subtract {
            bottom: 0;
            transform: translateY(-100%);
          }
        }
        &.rd-menu-quantity-container-active {
          .rd-menu-quantity {
            transform: translateY(0);
          }
        }
      }
    }
  }
</style>
