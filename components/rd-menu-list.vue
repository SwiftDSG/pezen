<template>
  <div class="rd-component" ref="rdComponent">
    <rd-menu-cart
      class="rd-menu"
      v-for="menu in data"
      :data="menu"
      :key="menu._id"
      :data-id="menu._id"
      @change="eventHandler"
    />
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import ScrollToPlugin from "gsap/ScrollToPlugin";
  import { ComputedRef } from "vue";
  import { ViewMode } from "~~/interfaces/general";
  import { MenuCart } from "~~/interfaces/menus";

  const { viewMode } = useMain();
  const props = defineProps<{
    data: MenuCart[];
  }>();
  const emits = defineEmits([
    "add",
    "subtract",
    "note",
    "delete",
    "change",
    "open-panel",
  ]);

  const rdComponent = ref<HTMLDivElement>(null);

  const rem: ComputedRef<number> = computed(
    () => parseInt(getComputedStyle(document.documentElement)?.fontSize) || 24
  );

  const animate = {
    arrange(rdComponent: HTMLElement, instant?: boolean): GSAPTimeline {
      const tl: GSAPTimeline = gsap.timeline({ paused: true });

      const rdMenus: HTMLElement[] = gsap.utils.toArray(
        rdComponent.querySelectorAll(".rd-menu")
      );

      for (let i: number = 0; i < rdMenus.length; i++) {
        const rdMenu: HTMLElement = rdMenus[i];

        const x: number = parseInt(rdMenu.dataset.x);
        const y: number = parseInt(rdMenu.dataset.y);

        tl.to(
          rdMenu,
          {
            top: y,
            left: x,
            duration: instant ? 0 : 0.5,
            ease: "power2.inOut",
          },
          "<0"
        );
      }

      return tl;
    },
    remove(rdComponent: HTMLElement, id: string, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      const rdMenu: HTMLElement = rdComponent.querySelector(
        `.rd-menu[data-id='${id}']`
      );

      tl.to(rdMenu, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    },
  };

  function arrange(instant?: boolean): void {
    const rdMenus: HTMLDivElement[] = gsap.utils.toArray(
      rdComponent.value.querySelectorAll(".rd-menu")
    );

    for (let i: number = 0; i < rdMenus.length; i++) {
      const rdMenu: HTMLDivElement = rdMenus[i];
      const { width, height }: DOMRect = rdMenu.getBoundingClientRect();

      if (viewMode.value === "mobile") {
        rdMenu.setAttribute("data-x", rem.value.toString());
        rdMenu.setAttribute("data-y", (i * height + i * rem.value).toString());
      } else {
        const x: number = i % 3;
        const y: number = Math.floor(i / 3);
        rdMenu.setAttribute(
          "data-x",
          (x * width + (x + 1) * 2 * rem.value).toString()
        );
        rdMenu.setAttribute(
          "data-y",
          (y * height + (y + 1) * 2 * rem.value).toString()
        );
      }
      if (i === rdMenus.length - 1) {
        const tl: GSAPTimeline = animate.arrange(rdComponent.value, instant);
        tl.play();
      }
    }
  }

  function eventHandler(data: {
    name: "add" | "subtract" | "note" | "delete";
    menu: MenuCart;
  }): void {
    if (
      data.name !== "delete" &&
      (data.name !== "subtract" || data.menu.quantity > 1)
    ) {
      emits(data.name, data.menu);
    } else if (data.name !== "subtract" || data.menu.quantity <= 1) {
      deleteHandler(data.menu);
    }
  }
  function deleteHandler(data: MenuCart): void {
    const index: number = props.data.findIndex((a) => a._id === data._id);
    if (index > -1) {
      animate.remove(rdComponent.value, data._id, () => {
        props.data.splice(index, 1);
        setTimeout(() => {
          arrange(false);
        }, 100);
      });
    }
  }

  onMounted(() => {
    arrange(true);
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 1rem 1rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    * {
      user-select: none;
    }
    .rd-menu {
      z-index: 1;
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: calc(100% - 2rem);
      touch-action: none;
      flex-shrink: 0;
    }
    @media only screen and (min-width: 1025px) {
      height: 100%;
      padding: 2rem;
      overflow-x: auto;
      flex-direction: row;
      .rd-menu {
        top: 2rem;
        left: 2rem;
        width: calc((100% - 8rem) / 3);
      }
    }
  }
</style>
