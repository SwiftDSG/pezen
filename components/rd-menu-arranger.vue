<template>
  <div
    class="rd-component"
    ref="rdComponent"
    :class="animationDragging ? 'rd-component-dragging' : ''"
  >
    <div
      v-for="(group, i) in groups"
      :key="group.code"
      class="rd-group"
      ref="rdGroup"
      :data-group-code="group.code"
      :style="`${
        viewMode === 'desktop' && i === groups.length - 1
          ? 'margin-right: 0;'
          : ''
      } ${
        viewMode === 'mobile' && i === groups.length - 1
          ? 'margin-bottom: 4.75rem; '
          : ''
      }`"
    >
      <div class="rd-group-header">
        <div class="rd-group-name-container">
          <span class="rd-group-name rd-headline-4">Group #1</span>
        </div>
        <div class="rd-group-icon-container"></div>
      </div>
      <div class="rd-group-body">
        <rd-menu-cart
          class="rd-group-menu"
          v-for="(menu, j) in group.items"
          :data="menu"
          :key="menu._id"
          :data-group-code="group.code"
          :data-menu-id="menu._id"
          :style="j === group.items.length - 1 ? 'margin-bottom: 0' : ''"
          @mousedown="dragStart"
          @touchstart="dragStart"
        />
        <div
          :class="classHandler(group.code)"
          @mouseenter="dragEnter"
          @mouseleave="dragLeave"
          @mouseup="dragRelease(i)"
          class="rd-group-overlay"
          ref="rdGroupOverlay"
        >
          <span class="rd-group-overlay-message rd-headline-6"
            >drop disini</span
          >
        </div>
      </div>
      <div class="rd-group-footer"></div>
    </div>
    <div
      v-if="viewMode === 'desktop' && animationDragging"
      class="rd-group-scroll-area rd-group-scroll-area-left"
      @mouseenter="scrollBy('left')"
      @mouseleave="scrollBy(null)"
    ></div>
    <div
      v-if="viewMode === 'desktop' && animationDragging"
      class="rd-group-scroll-area rd-group-scroll-area-right"
      @mouseenter="scrollBy('right')"
      @mouseleave="scrollBy(null)"
    ></div>
    <rd-menu-cart
      v-if="animationDecoy"
      class="rd-group-menu-decoy"
      :data="animationDecoy"
      style="pointer-events: none"
    />
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import ScrollToPlugin from "gsap/ScrollToPlugin";
  import { ComputedRef } from "vue";
  import { ViewMode } from "~~/interfaces/general";
  import { MenuCart, MenuGroup } from "~~/interfaces/menus";

  type AnimationScrollDirection = "up" | "right" | "down" | "left";

  const { viewMode } = useMain();
  const props = defineProps<{
    data: MenuCart[];
  }>();

  const rdComponent = ref<HTMLDivElement>(null);
  const rdMenuDecoy = ref<HTMLElement>(null);
  const rdMenuTarget = ref<HTMLElement>(null);
  const rdGroup = ref<HTMLDivElement[]>(null);
  const rdGroupOverlay = ref<HTMLDivElement[]>(null);

  const groups = ref<MenuGroup[]>([]);

  const animationDecoy = ref<MenuCart>(null);
  const animationDragging = ref<boolean>(false);
  const animationGroupCode = ref<string>("");
  const animationMenuId = ref<string>("");

  let animationInterval: NodeJS.Timer = null;
  let animationTimeout: NodeJS.Timeout = null;
  let animationEventLast: MouseEvent | TouchEvent = null;
  let animationEventCurr: MouseEvent | TouchEvent = null;
  let animationScrollDir: AnimationScrollDirection = null;
  let animationScrollPos: number = 0;
  let animationGroupIndex: number = -1;

  const rem: ComputedRef<number> = computed(
    () => parseInt(getComputedStyle(document.documentElement)?.fontSize) || 24
  );

  const animate = {
    groupItemRemove(
      viewMode: ViewMode,
      id: string,
      rdMenu: HTMLElement,
      cb?: () => void
    ): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          gsap.to(rdMenusAfter, {
            y: 0,
            duration: 0,
          });

          if (cb) cb();
        },
      });

      const rdMenusAfter: HTMLElement[] = gsap.utils.toArray(
        rdMenu.parentElement.querySelectorAll(
          `.rd-group-menu[data-menu-id='${id}'] ~ .rd-group-menu`
        )
      );

      tl.to(rdMenusAfter, {
        y: `-=${((viewMode === "desktop" ? 1 : 0.75) + 5.5) * rem.value + 2}`,
        duration: 0.5,
        ease: "power2.inOut",
      });
    },
    groupRemove(
      viewMode: ViewMode,
      code: string,
      rdGroup: HTMLElement,
      cb?: () => void
    ): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          gsap.to(rdGroupsAfter, {
            x: 0,
            y: 0,
            duration: 0,
          });

          if (cb) cb();
        },
      });

      const rdGroupsAfter: HTMLElement[] = gsap.utils.toArray(
        rdGroup.parentElement.querySelectorAll(
          `.rd-group[data-group-code='${code}'] ~ .rd-group`
        )
      );

      tl.to(rdGroup, {
        scale: 0.875,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });

      if (viewMode === "desktop") {
        tl.to(
          rdGroupsAfter,
          {
            x: `-=${rdGroup.getBoundingClientRect().width + 2 * rem.value}`,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<0"
        );
      }
    },
  };

  function genRandomStr(): string {
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let str: string = "";
    for (let i = 0; i < 5; i++) {
      str +=
        characters[
          Math.round(Math.floor(Math.random() * (characters.length - 1)))
        ];
    }
    return str;
  }

  function classHandler(code: string): string {
    let str = "";

    if (animationDragging.value) {
      if (code !== animationGroupCode.value) {
        str += "rd-group-overlay-active ";
      }
    }

    return str;
  }

  function dragStart(e: MouseEvent | TouchEvent): void {
    if (viewMode.value === "desktop") {
      document.documentElement.addEventListener("mousemove", dragHandler);
      document.documentElement.addEventListener("mouseup", dragEnd);
    } else {
      document.documentElement.addEventListener("touchmove", dragHandler);
      document.documentElement.addEventListener("touchend", dragEnd);
    }
    animationTimeout = setTimeout(
      () => {
        animationDragging.value = true;
        animationScrollPos =
          viewMode.value === "mobile"
            ? document.documentElement.scrollTop
            : rdComponent.value.scrollLeft;
        animationGroupIndex = -1;

        if (e.target instanceof HTMLElement) {
          rdMenuTarget.value = e.target;
          const { x, y }: DOMRect = rdMenuTarget.value.getBoundingClientRect();

          animationGroupCode.value = rdMenuTarget.value.dataset.groupCode;
          animationMenuId.value = rdMenuTarget.value.dataset.menuId;

          const group: MenuGroup = groups.value.find(
            (a) => a.code === animationGroupCode.value
          );
          const menu: MenuCart = group.items.find(
            (a) => a._id === animationMenuId.value
          );
          if (menu) {
            animationDecoy.value = menu;
            setTimeout(() => {
              rdMenuDecoy.value = rdComponent.value.querySelector(
                ".rd-group-menu-decoy"
              );

              gsap.to(rdMenuTarget.value, {
                opacity: 0,
                duration: 0,
              });
              gsap.to(rdMenuDecoy.value, {
                left: x,
                top: y,
                opacity: 1,
                duration: 0,
              });
            }, 100);
          }
        }

        animationInterval = setInterval(() => {
          if (animationEventCurr && animationEventLast && rdMenuDecoy.value) {
            let dx: number = 0;
            let dy: number = 0;
            if (
              animationEventCurr instanceof TouchEvent &&
              animationEventLast instanceof TouchEvent
            ) {
              dx =
                animationEventCurr.touches[0].clientX -
                animationEventLast.touches[0].clientX;
              dy =
                animationEventCurr.touches[0].clientY -
                animationEventLast.touches[0].clientY;
            } else if (
              animationEventCurr instanceof MouseEvent &&
              animationEventLast instanceof MouseEvent
            ) {
              dx = animationEventCurr.x - animationEventLast.x;
              dy = animationEventCurr.y - animationEventLast.y;
            }

            gsap.to(rdMenuDecoy.value, {
              x: `+=${dx}`,
              y: `+=${dy}`,
              duration: 0,
            });
          }
          animationEventLast = animationEventCurr;
        }, 50 / 3);
      },
      viewMode.value === "mobile" ? 250 : 125
    );
  }

  function dragEnd(): void {
    clearTimeout(animationTimeout);
    clearInterval(animationInterval);

    if (viewMode.value === "desktop") {
      document.documentElement.removeEventListener("mousemove", dragHandler);
      document.documentElement.removeEventListener("mouseup", dragEnd);
    } else if (viewMode.value && animationEventLast instanceof TouchEvent) {
      document.documentElement.removeEventListener("touchmove", dragHandler);
      document.documentElement.removeEventListener("touchend", dragEnd);

      const position: number = animationEventLast.touches[0].clientY;
      const boundaries: [number, number][] = [];
      for (const rdOverlay of rdGroupOverlay.value || []) {
        const { top, bottom }: DOMRect = rdOverlay.getBoundingClientRect();

        boundaries.push([top, bottom]);
      }
      const index: number = boundaries.findIndex(
        (a) => position >= a[0] && position <= a[1]
      );
      if (index > -1) dragRelease(index);
    }

    animationEventCurr = null;
    animationEventLast = null;
    animationScrollDir = null;

    animationDragging.value = false;
    setTimeout(() => {
      if (rdMenuDecoy.value && animationGroupIndex === -1) {
        const x: number =
          viewMode.value === "desktop"
            ? animationScrollPos - rdComponent.value.scrollLeft
            : 0;
        const y: number =
          viewMode.value === "mobile"
            ? animationScrollPos - document.documentElement.scrollTop
            : 0;
        gsap.to(rdMenuDecoy.value, {
          x,
          y,
          duration: 0.5,
          ease: "power2.out",
          onComplete() {
            gsap.to(rdMenuTarget.value, {
              opacity: 1,
              duration: 0,
            });
            animationDecoy.value = null;
            rdMenuDecoy.value = null;
          },
        });
      }
    }, 100);
  }
  function dragHandler(e: MouseEvent | TouchEvent): void {
    clearTimeout(animationTimeout);
    animationEventCurr = e;

    if (viewMode.value === "mobile" && e instanceof TouchEvent) {
      const { clientY } = e.touches[0];
      if (clientY <= 10 * rem.value) scrollBy("up");
      else if (clientY >= window.innerHeight - 10 * rem.value) scrollBy("down");
      else scrollBy(null);
    }
  }

  function dragRelease(index: number): void {
    animationGroupIndex = index;
    const group: MenuGroup = groups.value[index];
    if (group) {
      const groupRemoveIndex: number = groups.value.findIndex(
        (a) => a.code === animationGroupCode.value
      );
      let groupRemove: boolean = false;
      if (groups.value[groupRemoveIndex].items.length <= 1) groupRemove = true;

      if (viewMode.value === "desktop") {
        // Handle desktop drag-release
        let scrollToBottom: boolean = false; // Variable to determine wether the body element should scroll to bottom or not
        const rdGroupBody: HTMLElement =
          rdGroup.value[index].querySelector(".rd-group-body"); // body element
        const { height, bottom, left }: DOMRect =
          rdGroupBody.getBoundingClientRect(); // get body height, bottom and left

        if (
          (group.items.length + 1) * (5.5 * rem.value + 2) +
            group.items.length * rem.value >=
          height
        )
          scrollToBottom = true; // If total item's height greater than body's height

        const x: number =
          left - parseInt(getComputedStyle(rdMenuDecoy.value).left); // get distance to target's x

        let y: number = 0; // distance to target's y
        if (scrollToBottom) {
          // will scroll body to bottom
          gsap.to(rdGroupBody, {
            // add padding to be able to scroll to bottom with extra space for another item
            paddingBottom: 7.5 * rem.value + 2,
            duration: 0,
            onComplete() {
              gsap.to(rdGroupBody, {
                // scroll the body
                scrollTo: "max",
                duration: 0.5,
                ease: "power2.inOut",
              });
            },
          });
          y =
            bottom -
            (5.5 * rem.value + 2 + rem.value) -
            parseInt(getComputedStyle(rdMenuDecoy.value).top);
        } else {
          y =
            group.items.length * (5.5 * rem.value + 2) +
            group.items.length * rem.value;
        }

        gsap.to(rdMenuDecoy.value, {
          x,
          y,
          duration: 0.5,
          ease: "power2.out",
          onComplete() {
            groups.value[index].items.push(animationDecoy.value);
            animationDecoy.value = null;

            if (scrollToBottom) {
              gsap.to(rdGroupBody, {
                paddingBottom: rem.value,
              });
            }

            if (groupRemove) {
              const rdGroupRemove: HTMLElement =
                rdGroup.value[groupRemoveIndex];

              const {
                right: groupRight,
                left: groupLeft,
                width,
              }: DOMRect = rdGroupRemove.getBoundingClientRect();
              const { right: componentRight }: DOMRect =
                rdComponent.value.getBoundingClientRect();

              let dx: number = 0;
              if (groupLeft <= componentRight && groupRight > componentRight) {
                dx = componentRight - groupLeft;
              } else {
                dx = width;
              }
              gsap.to(rdComponent.value, {
                scrollTo: {
                  x: `-=${dx}`,
                },
                duration: 0.5,
                ease: "power2.out",
              });

              animate.groupRemove(
                viewMode.value,
                animationGroupCode.value,
                rdGroupRemove,
                () => {
                  groups.value.splice(groupRemoveIndex, 1);
                }
              );
            } else {
              const groupItemRemoveIndex: number = groups.value[
                groupRemoveIndex
              ].items.findIndex((a) => a._id === animationMenuId.value);
              const rdMenu: HTMLElement = rdGroup.value[
                groupRemoveIndex
              ].querySelector(
                `.rd-group-menu[data-menu-id='${animationMenuId.value}']`
              );
              animate.groupItemRemove(
                viewMode.value,
                animationMenuId.value,
                rdMenu,
                () => {
                  groups.value[groupRemoveIndex].items.splice(
                    groupItemRemoveIndex,
                    1
                  );
                }
              );
            }
          },
        });
      } else {
      }
    }
  }
  function dragEnter(e: MouseEvent | TouchEvent): void {
    if (animationDragging.value) {
      if (e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target;
        target.classList.add("rd-group-overlay-hovered");
      }
    }
  }
  function dragLeave(e: MouseEvent | TouchEvent): void {
    if (animationDragging.value) {
      if (e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target;
        target.classList.remove("rd-group-overlay-hovered");
      }
    }
  }

  function scrollBy(dir?: AnimationScrollDirection): void {
    if (animationDragging.value && !animationScrollDir) {
      animationScrollDir = dir;
      scrollHandler();
    } else if (!dir) {
      animationScrollDir = null;
    }
  }

  function scrollHandler(): void {
    if (animationScrollDir) {
      if (animationScrollDir === "up") {
        window.scrollBy(0, -4);
      } else if (animationScrollDir === "right") {
        rdComponent.value.scrollBy(4, 0);
      } else if (animationScrollDir === "down") {
        window.scrollBy(0, 4);
      } else if (animationScrollDir === "left") {
        rdComponent.value.scrollBy(-4, 0);
      }
      requestAnimationFrame(scrollHandler);
    }
  }

  onMounted(() => {
    gsap.registerPlugin(ScrollToPlugin);
    for (const menu of props.data) {
      groups.value.push({
        code: genRandomStr(),
        items: [menu],
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    * {
      user-select: none;
    }
    .rd-group {
      position: relative;
      width: 100%;
      background: var(--background-depth-one-color);
      margin-bottom: 0.75rem;
      padding: 0 0.75rem;
      border: var(--border);
      border-radius: 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-group-header {
        position: relative;
        left: -0.75rem;
        width: calc(100% + 1.5rem);
        height: 3.5rem;
        padding: 0.75rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rd-group-icon-container {
          position: relative;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: var(--border);
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .rd-group-body {
        position: relative;
        width: 100%;
        padding: 0.75rem 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-group-menu {
          touch-action: none;
          z-index: 1;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
        }
        .rd-group-overlay {
          pointer-events: none;
          touch-action: none;
          z-index: 2;
          position: absolute;
          bottom: 0.75rem;
          width: 100%;
          height: calc(100% - 1.5rem);
          border: 1px solid var(--primary-color);
          box-sizing: border-box;
          border-radius: 0.75rem;
          color: var(--primary-color);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.25s opacity, 0.25s color, 0.25s filter;
          opacity: 0;
          filter: grayscale(1);
          span.rd-group-overlay-message {
            position: relative;
            color: inherit;
          }
          &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 0.75rem;
            background: #fff7ee;
          }
          &.rd-group-overlay-active {
            pointer-events: auto;
            z-index: 4;
            opacity: 1;
            &.rd-group-overlay-hovered {
              filter: grayscale(0);
            }
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .rd-group-footer {
        position: relative;
        left: -0.75rem;
        width: calc(100% + 1.5rem);
        height: 3.5rem;
        padding: 0.75rem;
        border-top: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .rd-group-menu-decoy {
      pointer-events: none;
      z-index: 5;
      position: fixed;
      top: 0;
      left: 0;
      width: calc(100% - 3.5rem - 2px);
      opacity: 0;
      box-shadow: var(--box-shadow);
    }
    @media only screen and (min-width: 1025px) {
      height: 100%;
      padding: 2rem;
      overflow-x: auto;
      flex-direction: row;
      .rd-group {
        width: 20rem;
        height: 100%;
        padding: 0 1rem;
        border-radius: 1rem;
        margin-right: 2rem;
        margin-bottom: 0;
        flex-shrink: 0;
        .rd-group-header {
          left: -1rem;
          width: calc(100% + 2rem);
          height: 4rem;
          padding: 1rem;
        }
        .rd-group-body {
          height: calc(100% - 8rem);
          padding: 1rem 0;
          box-sizing: border-box;
          overflow-y: auto;
          .rd-group-menu {
            position: relative;
            margin-bottom: 1rem;
          }
          .rd-group-overlay {
            top: 1rem;
            height: calc(100% - 2rem);
          }
        }
        .rd-group-footer {
          left: -1rem;
          width: calc(100% + 2rem);
          height: 4rem;
          padding: 1rem;
        }
      }
      .rd-group-scroll-area {
        z-index: 1000;
        position: fixed;
        top: 0;
        width: 10rem;
        height: 100vh;
        &.rd-group-scroll-area-left {
          left: 0;
        }
        &.rd-group-scroll-area-right {
          right: 20rem;
        }
      }
      .rd-group-menu-decoy {
        width: calc(18rem - 2px);
      }
    }
  }
</style>
