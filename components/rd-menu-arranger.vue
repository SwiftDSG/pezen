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
          @drag="dragStart"
        />
      </div>
      <div class="rd-group-footer"></div>
      <div
        :class="classHandler(group.code)"
        @mouseenter="dragEnter"
        @mouseleave="dragLeave"
        @mouseup="dragRelease(i)"
        class="rd-group-overlay"
        ref="rdGroupOverlay"
      >
        <span class="rd-group-overlay-message rd-headline-6">drop disini</span>
      </div>
    </div>
    <div
      :class="animationNewGroup ? 'rd-overlay-active' : ''"
      @mouseenter="dragEnter"
      @mouseleave="dragLeave"
      @mouseup="dragRelease(-2)"
      class="rd-overlay"
      ref="rdOverlay"
    >
      <span class="rd-overlay-message rd-headline-6">grup baru</span>
    </div>
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
  const animationNewGroup = ref<boolean>(false);

  let animationInterval: NodeJS.Timer = null;
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
          if (viewMode === "mobile") {
            gsap.to(rdGroup, {
              height: "auto",
              duration: 0,
            });
          }

          if (cb) cb();
        },
      });

      const rdGroup: HTMLElement = rdMenu.parentElement;
      const rdMenusAfter: HTMLElement[] = gsap.utils.toArray(
        rdGroup.querySelectorAll(
          `.rd-group-menu[data-menu-id='${id}'] ~ .rd-group-menu`
        )
      );

      tl.to(rdMenusAfter, {
        y: `-=${((viewMode === "desktop" ? 1 : 0.75) + 5.5) * rem.value + 2}`,
        duration: 0.5,
        ease: "power2.inOut",
      });

      if (viewMode === "mobile") {
        tl.to(
          rdGroup,
          {
            height: `-=${6.25 * rem.value}`,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<0"
        );
      }
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
      } else {
        tl.to(
          rdGroupsAfter,
          {
            y: `-=${rdGroup.getBoundingClientRect().height + 0.75 * rem.value}`,
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
    if (viewMode.value === "mobile") {
      document.documentElement.addEventListener("touchmove", dragHandler);
      document.documentElement.addEventListener("touchend", dragEnd);
    } else {
      document.documentElement.addEventListener("mousemove", dragHandler);
      document.documentElement.addEventListener("mouseup", dragEnd);
    }
    if (
      e?.target instanceof HTMLElement &&
      !e?.target.parentElement.classList.contains("rd-menu-action-active")
    ) {
      animationDragging.value = true;
      animationScrollPos =
        viewMode.value === "mobile"
          ? document.documentElement.scrollTop
          : rdComponent.value.scrollLeft;
      animationGroupIndex = -1;

      rdMenuTarget.value =
        e.target instanceof HTMLElement ? e.target.parentElement : null;
      const { x, y }: DOMRect = rdMenuTarget.value.getBoundingClientRect();

      animationGroupCode.value = rdMenuTarget.value.dataset.groupCode;
      animationMenuId.value = rdMenuTarget.value.dataset.menuId;

      const group: MenuGroup = groups.value.find(
        (a) => a.code === animationGroupCode.value
      );
      const menu: MenuCart = group?.items.find(
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

      if (
        groups.value.find((a) => a.code === animationGroupCode.value).items
          .length > 1
      ) {
        animationNewGroup.value = true;
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
    }
  }

  function dragEnd(): void {
    clearInterval(animationInterval);

    if (viewMode.value === "desktop") {
      document.documentElement.removeEventListener("mousemove", dragHandler);
      document.documentElement.removeEventListener("mouseup", dragEnd);
    } else if (
      viewMode.value === "mobile" &&
      animationEventLast instanceof TouchEvent
    ) {
      document.documentElement.removeEventListener("touchmove", dragHandler);
      document.documentElement.removeEventListener("touchend", dragEnd);

      const position: number = animationEventLast.touches[0].clientY;
      const boundaries: [number, number][] = [];

      if (position >= window.innerHeight - 7.5 * rem.value) {
        dragRelease(-2);
      } else {
        for (const rdOverlay of rdGroupOverlay.value || []) {
          if (rdOverlay.classList.contains("rd-group-overlay-active")) {
            const { top, bottom }: DOMRect = rdOverlay.getBoundingClientRect();

            boundaries.push([top, bottom]);
          } else {
            boundaries.push([2, 1]);
          }
        }
        const index: number = boundaries.findIndex(
          (a) => position >= a[0] && position <= a[1]
        );
        if (index > -1) dragRelease(index);
      }
    }

    animationEventCurr = null;
    animationEventLast = null;
    animationScrollDir = null;

    animationDragging.value = false;
    animationNewGroup.value = false;
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
    animationEventCurr = e;

    if (viewMode.value === "mobile" && e instanceof TouchEvent) {
      const { clientY } = e.touches[0];
      if (clientY <= 10 * rem.value) scrollBy("up");
      else if (clientY >= window.innerHeight - 10 * rem.value) scrollBy("down");
      else scrollBy(null);
    } else if (viewMode.value === "desktop" && e instanceof MouseEvent) {
      const { clientX } = e;
      if (clientX <= 10 * rem.value) scrollBy("left");
      else if (clientX >= window.innerWidth - 30 * rem.value) scrollBy("right");
      else scrollBy(null);
    }
  }

  function dragRelease(index?: number): void {
    const groupRemoveIndex: number = groups.value.findIndex(
      (a) => a.code === animationGroupCode.value
    );
    const rdGroupBodyRemove: HTMLElement =
      rdGroup.value[groupRemoveIndex].querySelector(".rd-group-body");

    animationGroupIndex = index;
    const group: MenuGroup = groups.value[index];

    if (group) {
      let groupRemove: boolean = false;
      if (groups.value[groupRemoveIndex].items.length <= 1) groupRemove = true;

      const rdGroupBody: HTMLElement =
        rdGroup.value[index].querySelector(".rd-group-body"); // body element
      const { height, bottom, left }: DOMRect =
        rdGroupBody.getBoundingClientRect(); // get body height, bottom and left

      if (viewMode.value === "desktop") {
        // Handle desktop drag-release
        let scrollToBottom: boolean = false; // Variable to determine wether the body element should scroll to bottom or not

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
          const { y: originTop }: DOMRect = rdGroupBodyRemove
            .querySelector(
              `.rd-group-menu[data-menu-id='${animationMenuId.value}']`
            )
            .getBoundingClientRect();
          const { y: targetTop, height }: DOMRect = rdGroupBody
            .querySelector(".rd-group-menu:last-child")
            .getBoundingClientRect();

          y = targetTop - originTop + height + rem.value;
        }

        gsap.to(rdMenuDecoy.value, {
          x,
          y,
          duration: 0.5,
          ease: "power2.out",
          onComplete() {
            groups.value[index].items.push(animationDecoy.value);
            animationDecoy.value = null;

            gsap.to(rdGroupBodyRemove, {
              scrollTo: 0,
              duration: 0.5,
              ease: "power2.inOut",
            });

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
                dx = width + 2 * rem.value;
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
        const x: number = 0;
        let y: number = 0;

        y = bottom - parseInt(getComputedStyle(rdMenuDecoy.value).top);

        gsap.to(rdGroupBody, {
          paddingBottom: 7 * rem.value + 2,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(rdMenuDecoy.value, {
          x,
          y,
          duration: 0.5,
          ease: "power2.out",
          onComplete() {
            gsap.to(rdGroupBody, {
              paddingBottom: 0.75 * rem.value,
              duration: 0,
            });

            groups.value[index].items.push(animationDecoy.value);
            animationDecoy.value = null;

            gsap.to(document.documentElement, {
              // scroll the body
              scrollTo: `-=${rdGroupBodyRemove.getBoundingClientRect().height}`,
              duration: 0.5,
              ease: "power2.inOut",
            });

            if (groupRemove) {
              const rdGroupRemove: HTMLElement =
                rdGroup.value[groupRemoveIndex];

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
      }
    } else if (index === -2) {
      gsap.to(rdMenuDecoy.value, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete() {
          const groupItemRemoveIndex: number = groups.value[
            groupRemoveIndex
          ].items.findIndex((a) => a._id === animationMenuId.value);
          const rdMenu: HTMLElement = rdGroup.value[
            groupRemoveIndex
          ].querySelector(
            `.rd-group-menu[data-menu-id='${animationMenuId.value}']`
          );
          animationDecoy.value = null;

          groups.value.push({
            code: genRandomStr(),
            items: [groups.value[groupRemoveIndex].items[groupItemRemoveIndex]],
          });

          if (viewMode.value === "desktop") {
            gsap.to(rdComponent.value, {
              scrollTo: {
                x: "max",
              },
              duration: 0.5,
              ease: "power2.inOut",
            });
            gsap.to(rdGroupBodyRemove, {
              scrollTo: 0,
              duration: 0.5,
              ease: "power2.inOut",
            });
          } else {
            gsap.to(document.documentElement, {
              scrollTo: "max",
              duration: 0.5,
              ease: "power2.inOut",
            });
          }
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
        },
      });
    }
  }
  function dragEnter(e: MouseEvent | TouchEvent): void {
    if (animationDragging.value) {
      if (e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target;
        if (target.classList.contains("rd-overlay")) {
          target.classList.add("rd-overlay-hovered");
        } else {
          target.classList.add("rd-group-overlay-hovered");
        }
      }
    }
  }
  function dragLeave(e: MouseEvent | TouchEvent): void {
    if (animationDragging.value) {
      if (e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target;
        target.classList.remove("rd-group-overlay-hovered");
        target.classList.remove("rd-overlay-hovered");
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
    padding: 0 1rem 1rem 1rem;
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
      .rd-group-overlay {
        pointer-events: none;
        touch-action: none;
        z-index: 2;
        position: absolute;
        bottom: 4.25rem;
        width: calc(100% - 1.5rem);
        height: calc(100% - 8.5rem);
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
    .rd-overlay {
      z-index: 3;
      pointer-events: none;
      touch-action: none;
      z-index: 2;
      position: fixed;
      bottom: 1rem;
      width: calc(100vw - 2rem);
      height: 6.5rem;
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
      span.rd-overlay-message {
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
      &.rd-overlay-active {
        pointer-events: auto;
        z-index: 4;
        opacity: 1;
        &.rd-overlay-hovered {
          filter: grayscale(0);
        }
      }
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
        }
        .rd-group-footer {
          left: -1rem;
          width: calc(100% + 2rem);
          height: 4rem;
          padding: 1rem;
        }
        .rd-group-overlay {
          bottom: 5rem;
          width: calc(100% - 2rem);
          height: calc(100% - 10rem);
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
      .rd-overlay {
        bottom: 2rem;
        left: calc((100vw - 20rem) / 2 - 10rem);
        width: 19rem;
      }
    }
  }
</style>
