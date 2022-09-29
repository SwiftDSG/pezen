<template>
  <div class="rd-layout" ref="rdLayout">
    <header v-if="viewMode === 'mobile'" class="rd-header" ref="rdHeader">
      <rd-input-button-small class="rd-search-cancel" icon="arrow-left" />
      <rd-input-search class="rd-search" :input="searchInput" />
      <rd-input-button-small class="rd-profile" image="/user-default.svg" />
    </header>
    <header v-else class="rd-header" ref="rdHeader">
      <div class="rd-greet-container">
        <rd-input-button-small class="rd-profile" image="/user-default.svg" />
        <div class="rd-greet">
          <h3 class="rd-greet-subtitle rd-subtitle-text">Selamat pagi</h3>
          <h1 class="rd-greet-title rd-headline-2">Kemal Dwi Heldy</h1>
        </div>
      </div>
      <div class="rd-search-container">
        <rd-input-search class="rd-search" :input="searchInput" />
        <rd-input-button-small class="rd-search-code" icon="qr-code" />
      </div>
    </header>
    <main class="rd-body">
      <nuxt-page />
    </main>
    <nav class="rd-navigation"></nav>
  </div>
</template>

<script lang="ts" setup>
  import { InputSearchOption } from "./interfaces/general";

  const { viewMode } = useMain();

  const searchInput = ref<InputSearchOption>({
    name: "query",
    placeholder: "Cari resto atau makanan...",
    model: "",
    type: "secondary",
  });

  function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
    if (e.matches) viewMode.value = "mobile";
    else viewMode.value = "desktop";
  }

  watch(
    () => viewMode.value,
    (val, oldVal) => {
      if (val && oldVal) location.reload();
    }
  );

  onMounted(async () => {
    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 1024px)");
    mediaQuery.addEventListener("change", resizeHandler);
    resizeHandler(mediaQuery);
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
        transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
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
            width: 12.5rem;
            margin-right: 0.5rem;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  :root {
    --primary-color: #ffa84c;
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
    @media only screen and (max-width: 1919px) and (min-width: 1600px) {
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
  }
  .rd-button-text {
    font-family: "Quicksand";
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.125rem;
    transform: translateX(0.0625rem);
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
</style>
