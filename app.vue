<template>
  <div class="rd-layout" ref="rdLayout">
    <rd-alert />
    <header
      v-if="viewMode === 'mobile'"
      class="rd-header"
      ref="rdHeader"
      :class="`${
        !searchVisible && !(panelOpened === 'search' && panelState === 'idle')
          ? 'rd-header-hidden'
          : ''
      } ${
        panelOpened === 'search' && panelState === 'idle'
          ? 'rd-header-searching'
          : ''
      } ${scrollValue > 0 ? 'rd-header-active' : ''}`"
    >
      <rd-input-button-small
        class="rd-search-cancel"
        icon="arrow-left"
        @clicked="panelHandler({ state: 'hide' })"
      />
      <rd-input-search class="rd-search" :input="searchInput" />
      <rd-input-button-small class="rd-profile" image="/user-default.svg" />
    </header>
    <header
      v-else
      class="rd-header"
      ref="rdHeader"
      :class="`${scrollValue > 0 ? 'rd-header-active' : ''} ${
        !searchVisible ? 'rd-header-hidden' : ''
      }`"
    >
      <div class="rd-greet-container">
        <rd-input-button-small class="rd-profile" image="/user-default.svg" />
        <div class="rd-greet">
          <h3 class="rd-greet-subtitle rd-subtitle-text">Selamat pagi</h3>
          <h1 class="rd-greet-title rd-headline-2">
            {{ user ? user.name : "Food Lovers!" }}
          </h1>
        </div>
      </div>
      <div class="rd-search-container">
        <rd-input-search class="rd-search" :input="searchInput" />
        <rd-input-button-small
          class="rd-search-code"
          icon="qr-code"
          @clicked="
            panelHandler({
              state: 'show',
              type: 'scanner',
            })
          "
        />
      </div>
    </header>
    <main class="rd-body" ref="rdBody">
      <nuxt-page
        @shake="shake"
        @open-panel="panelHandler"
        @change-page="changeHandler"
      />
    </main>
    <nav
      class="rd-navigation"
      :class="!navigationVisible ? 'rd-navigation-hidden' : ''"
    >
      <a
        v-for="link in navigationLinks"
        :key="link.to"
        :class="route.path === link.to ? 'rd-navigation-button-active' : ''"
        :href="link.to === '/profile' && !user ? '/auth' : link.to"
        class="rd-navigation-button"
      >
        <div class="rd-navigation-button-icon-container">
          <rd-svg
            class="rd-navigation-button-icon"
            :name="link.to === '/profile' && !user ? 'login' : link.icon"
            :color="route.path === link.to ? 'primary' : 'secondary'"
          />
        </div>
        <span class="rd-navigation-button-label rd-headline-6">{{
          link.to === "/profile" && !user ? "Masuk" : link.name
        }}</span>
        <span class="rd-navigation-button-indicator"></span>
      </a>
    </nav>
    <rd-addresses-panel
      v-if="panelOpened === 'addresses'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
    />
    <rd-addresses-add-panel
      v-if="panelOpened === 'addresses-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
    />
    <rd-booking-panel
      v-if="panelOpened === 'booking'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @change-page="changeHandler"
    />
    <rd-delivery-panel
      v-if="panelOpened === 'delivery'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
    />
    <rd-search-panel
      v-if="panelOpened === 'search'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
    />
    <rd-scanner-panel
      v-if="panelOpened === 'scanner'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @change-page="changeHandler"
    />
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";

  import { InputSearchOption } from "./interfaces/general";

  interface PanelHandlerOption {
    state: "show" | "hide";
    type?: PanelType;
    data?: any;
  }
  interface NavigationLink {
    name: string;
    to: string;
    icon: string;
  }

  type PanelType =
    | "addresses"
    | "addresses-add"
    | "booking"
    | "delivery"
    | "search"
    | "scanner";

  const { initSocket } = useSockets();
  const { user, refresh } = useUser();
  const { searchData, viewMode, loadPermissions, getSearchData } = useMain();
  const route = useRoute();
  const router = useRouter();

  const scrollValue = ref<number>(0);

  const searchFocused = ref<boolean>(false);
  const searchTimeout = ref<NodeJS.Timeout>(null);

  const rdLayout = ref<HTMLDivElement>(null);
  const rdHeader = ref<HTMLElement>(null);
  const rdBody = ref<HTMLDivElement>(null);

  const searchInput = ref<InputSearchOption>({
    name: "query",
    placeholder: "Cari resto atau makanan...",
    model: "",
    type: "secondary",
  });

  const panelState = ref<"idle" | "hide">("idle");
  const panelData = ref<any[]>([]);
  const panelOpened = ref<PanelType>(null);
  const panelSequence = ref<PanelType[]>([]);

  const navigationVisible: ComputedRef<boolean> = computed(
    () =>
      route.path === "/" ||
      route.path === "/orders" ||
      route.path === "/profile"
  );
  const searchVisible: ComputedRef<boolean> = computed(
    () =>
      (route.path === "/" && viewMode.value === "desktop") ||
      route.path === "/orders" ||
      route.path === "/profile"
  );
  const searchQuery: ComputedRef<string> = computed(
    () => searchInput.value.model
  );

  const navigationLinks: NavigationLink[] = [
    {
      name: "Home",
      to: "/",
      icon: "home",
    },
    {
      name: "Pesanan",
      to: "/orders",
      icon: "timer",
    },
    {
      name: "profile",
      to: "/profile",
      icon: "account",
    },
  ];

  const animate = {
    exitPage(rdBody: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
          setTimeout(() => {
            gsap.to(rdBody, {
              opacity: 1,
              duration: 0,
            });
          }, 50);
        },
      });

      tl.to(rdBody, {
        opacity: 0,
        duration: 0.5,
      });
    },
  };

  function shake(): void {
    rdLayout.value.classList.add("rd-layout-shake");
    setTimeout(() => {
      rdLayout.value.classList.remove("rd-layout-shake");
    }, 500);
  }

  function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
    if (e.matches) viewMode.value = "mobile";
    else viewMode.value = "desktop";
  }
  function panelHandler({ state, type, data }: PanelHandlerOption): void {
    if (state === "show") {
      if (panelSequence.value.length === 0) {
        panelState.value = "idle";
        panelSequence.value.unshift(type);
        panelData.value.unshift(data || {});
        panelOpened.value = panelSequence.value[0];
      } else {
        panelState.value = "hide";
        panelSequence.value.push(type);
        panelData.value.push(data || {});
      }
      if (type === "search") {
        const rdInput: HTMLInputElement =
          rdHeader.value.querySelector("input.rd-input");
        if (rdInput) rdInput.focus();
      }
    } else {
      panelOpened.value = null;
      let sequence: PanelHandlerOption["type"] = null;
      let payload: PanelHandlerOption["data"] = null;
      if (panelState.value === "hide") {
        panelState.value = "idle";
        sequence = panelSequence.value.pop();
        payload = panelData.value.pop();
        if (sequence === panelSequence.value[0]) {
          panelData.value.splice(0, 1);
          panelSequence.value.splice(0, 1);
        }
      } else {
        panelState.value = "hide";
        panelData.value.splice(0, 1);
        panelSequence.value.splice(0, 1);
        sequence = panelSequence.value.pop();
        payload = panelData.value.pop();
      }
      if (sequence) {
        setTimeout(() => {
          panelState.value = "idle";
          panelSequence.value.unshift(sequence);
          panelData.value.unshift(payload || {});
          panelOpened.value = panelSequence.value[0];
        }, 50);
      }
    }
  }
  function scrollHandler(): void {
    scrollValue.value = document.documentElement.scrollTop;
  }
  function changeHandler(to: string): void {
    const [path, queryString]: string[] = to.split("?");
    if (route.path !== path) {
      animate.exitPage(rdBody.value, () => {
        router.push(to);
      });
    } else if (queryString) {
      const queries: Record<string, string> = {};
      for (const query of queryString.split("&")) {
        const [key, value]: string[] = query.split("=");
        queries[key] = value;
      }
      router.replace({ query: queries });
    }
  }

  watch(
    () => viewMode.value,
    (val, oldVal) => {
      if (val && oldVal) location.reload();
    }
  );

  watch(
    () => searchQuery.value,
    (val) => {
      clearTimeout(searchTimeout.value);
      if (val.length >= 3) {
        searchTimeout.value = setTimeout(() => {
          getSearchData({
            text: val,
          });
        }, 500);
      } else {
        searchData.value = null;
      }
    }
  );

  onMounted(async () => {
    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 1024px)");
    mediaQuery.addEventListener("change", resizeHandler);
    resizeHandler(mediaQuery);

    document.addEventListener("scroll", scrollHandler);

    await refresh();

    loadPermissions();
    initSocket();
  });
</script>

<style lang="scss" scoped>
  .rd-layout {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: var(--background-depth-two-color);
    display: flex;
    flex-direction: column;
    header.rd-header {
      z-index: 100000;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4rem;
      padding: 1rem;
      box-sizing: border-box;
      overflow: visible;
      box-shadow: 1px 0 0 0 rgba(170, 113, 156, 0.1);
      transition: background-color 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
        box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
        transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
        opacity 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex;
      align-items: center;
      > * {
        transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
          opacity 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        flex-shrink: 0;
      }
      .rd-search-cancel {
        position: absolute;
        top: 1rem;
        left: 1rem;
        opacity: 0;
      }
      .rd-search {
        width: calc(100vw - 4.5rem);
      }
      .rd-profile {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }
      &.rd-header-searching {
        box-shadow: var(--box-shadow);
        background: #fff;
        .rd-search-cancel {
          opacity: 1;
        }
        .rd-search {
          transform: translateX(2.5rem);
        }
        .rd-profile {
          opacity: 0;
        }
      }
      &.rd-header-active {
        box-shadow: var(--box-shadow);
        background: #fff;
      }
      &.rd-header-hidden {
        transform: translateY(-125%);
        opacity: 0;
        transition: background-color 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
          box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
          transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
          opacity 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
    }
    nav.rd-navigation {
      z-index: 10;
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      width: calc(100vw - 2rem);
      height: 2.5rem;
      background: rgba(43, 25, 6, 0.5);
      backdrop-filter: blur(10px);
      border-radius: 0.75rem;
      transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-navigation-button {
        cursor: pointer;
        position: relative;
        width: calc(100% / 3);
        height: 100%;
        text-decoration: none;
        overflow: hidden;
        color: #fff;
        opacity: 0.5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .rd-navigation-button-icon-container {
          position: relative;
          width: 1rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          .rd-navigation-button-icon {
            position: relative;
            width: 100%;
            height: 100%;
          }
        }
        span.rd-navigation-button-label {
          position: relative;
          line-height: 1;
          margin-top: 0.125rem;
        }
        .rd-navigation-button-indicator {
          position: absolute;
          bottom: 0;
          left: calc(50% - 0.375rem);
          height: 3px;
          width: 0.75rem;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          background: var(--primary-color);
          transition: 0.2s transform;
          transform: translateY(100%);
        }
        &.rd-navigation-button-active {
          opacity: 1;
          .rd-navigation-button-indicator {
            transform: translateY(0);
          }
        }
      }
      &.rd-navigation-hidden {
        transform: translateY(150%);
      }
    }
    &.rd-layout-shake {
      animation: rd-shake 0.25s infinite;
    }
    @media only screen and (min-width: 1025px) {
      header.rd-header {
        height: 6rem;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rd-greet-container {
          position: relative;
          height: 2rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .rd-profile {
            position: relative;
            top: 0;
            left: 0;
          }
          .rd-greet {
            position: relative;
            height: 2rem;
            margin-left: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
        .rd-search-container {
          position: relative;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-search {
            width: calc(25vw - 4.25rem);
            margin-right: 0.5rem;
          }
        }
      }
      nav.rd-navigation {
        left: 50%;
        width: 12rem;
        transform: translateX(-50%);
        &.rd-navigation-hidden {
          transform: translateX(-50%) translateY(4.5rem);
        }
      }
    }
  }
</style>

<style lang="scss">
  :root {
    --primary-color: #ffa84c;
    --secondary-color: #fff;
    --error-color: #ff584c;
    --warning-color: #ffc904;
    --success-color: #6bc785;
    --border-color: #ececec;
    --font-main-color: #000;
    --font-secondary-color: #7f7f7f;
    --background-depth-one-color: #fff;
    --background-depth-two-color: #f8f8f8;
    --background-depth-three-color: #ececec;
    --border: 1px solid var(--border-color);
    --box-shadow: 0 0.5rem 1rem rgba(199, 199, 199, 0.125);
  }

  html,
  body {
    position: relative;
    width: 100vw;
    margin: 0;
    padding: 0;
    font-size: 24px;
    font-family: "Quicksand", -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--font-color);
    overflow-x: hidden;
    @media only screen and (max-width: 1900px) and (min-width: 1600px) {
      font-size: 22px;
    }
    @media only screen and (max-width: 1599px) and (min-width: 1480px) {
      font-size: 21px;
    }
    @media only screen and (max-width: 1479px) and (min-width: 1380px) {
      font-size: 20px;
    }
    @media only screen and (max-width: 1379px) and (min-width: 1320px) {
      font-size: 19px;
    }
    @media only screen and (max-width: 1319px) and (min-width: 1024px) {
      font-size: 18px;
    }
    @media only screen and (max-width: 640px) {
      font-size: 24px;
    }
    @media only screen and (max-width: 320px) {
      font-size: 17px;
    }
    @media only screen and (max-width: 1024px) {
      height: auto;
      overflow-y: auto;
    }
  }

  .rd-headline-1 {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-2 {
    font-size: 1rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-3 {
    font-size: 0.85rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-4 {
    font-size: 0.75rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-5 {
    font-size: 0.65rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-headline-6 {
    font-size: 0.55rem;
    font-weight: 700;
    font-family: "Quicksand";
  }
  .rd-subtitle-text {
    font-size: 0.65rem;
    font-weight: 500;
    font-family: "Quicksand";
  }
  .rd-body-text {
    font-size: 0.6rem;
    font-weight: 500;
    font-family: "Quicksand";
  }
  .rd-caption-text {
    font-size: 0.55rem;
    font-family: "Quicksand";
    font-weight: 500;
    color: var(--font-color);
    opacity: 0.5;
  }
  .rd-button-text {
    font-family: "Quicksand";
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.125rem;
    transform: translateX(0.0625rem);
  }

  span.rd-text-wrapper,
  span.rd-word-wrapper,
  span.rd-letter-wrapper,
  span.rd-image-wrapper {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    span.rd-text-container,
    span.rd-word-container,
    span.rd-letter-container,
    span.rd-image-container {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      &.rd-text-container-up,
      &.rd-word-container-up,
      &.rd-letter-container-up,
      &.rd-image-container-up {
        transform: translateY(-100%);
        span.rd-text,
        span.rd-word,
        span.rd-letter,
        img.rd-image {
          transform: translateY(100%);
          &.rd-image:not(.rd-image-contain) {
            transform: translateY(100%) scale(1.25);
          }
          &.rd-image-contain {
            object-fit: contain;
            transform: translateY(100%) scale(1);
          }
        }
      }
      &.rd-text-container-down,
      &.rd-word-container-down,
      &.rd-letter-container-down,
      &.rd-image-container-down {
        transform: translateY(100%);
        span.rd-text,
        span.rd-word,
        span.rd-letter,
        img.rd-image {
          transform: translateY(-100%);
          &.rd-image:not(.rd-image-contain) {
            transform: translateY(-100%) scale(1.25);
          }
          &.rd-image-contain {
            object-fit: contain;
            transform: translateY(-100%) scale(1);
          }
        }
      }
      &.rd-text-container-left,
      &.rd-word-container-left,
      &.rd-letter-container-left,
      &.rd-image-container-left {
        transform: translateX(-100%);
        span.rd-text,
        span.rd-word,
        span.rd-letter,
        img.rd-image {
          transform: translateX(100%);
          &.rd-image:not(.rd-image-contain) {
            transform: translateX(100%) scale(1.25);
          }
          &.rd-image-contain {
            object-fit: contain;
            transform: translateX(100%) scale(1);
          }
        }
      }
      &.rd-text-container-right,
      &.rd-word-container-right,
      &.rd-letter-container-right,
      &.rd-image-container-right {
        transform: translateX(100%);
        span.rd-text,
        span.rd-word,
        span.rd-letter,
        img.rd-image {
          transform: translateX(-100%);
          &.rd-image:not(.rd-image-contain) {
            transform: translateX(-100%) scale(1.25);
          }
          &.rd-image-contain {
            object-fit: contain;
            transform: translateX(-100%) scale(1);
          }
        }
      }
    }
  }
  span.rd-image-wrapper {
    width: 100%;
    height: 100%;
    span.rd-image-container {
      width: 100%;
      height: 100%;
      img.rd-image {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.25);
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
    padding: 0;
  }

  @keyframes rd-loading {
    0% {
      left: 0;
      right: 100%;
    }
    50% {
      left: 0;
      right: 0;
    }
    100% {
      left: 100%;
      right: 0;
    }
  }
  @keyframes rd-shake {
    0% {
      transform: translate(1px, 1px);
    }
    10% {
      transform: translate(-1px, -2px);
    }
    20% {
      transform: translate(-3px, 0px);
    }
    30% {
      transform: translate(3px, 2px);
    }
    40% {
      transform: translate(1px, -1px);
    }
    50% {
      transform: translate(-1px, 2px);
    }
    60% {
      transform: translate(-3px, 1px);
    }
    70% {
      transform: translate(3px, 1px);
    }
    80% {
      transform: translate(-1px, -1px);
    }
    90% {
      transform: translate(1px, 2px);
    }
    100% {
      transform: translate(1px, -2px);
    }
  }
  @keyframes rd-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes rd-circular-rotate {
    0% {
      transform: rotate(0);
    }
    50% {
      transform: rotate(-140deg);
    }
    100% {
      transform: rotate(0);
    }
  }
</style>
