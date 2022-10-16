<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-page">
      <div
        class="rd-page-header"
        :class="headerActive ? 'rd-page-header-active' : ''"
      >
        <rd-input-button-small icon="arrow-left" />
        <h2
          class="rd-page-name"
          :class="viewMode === 'desktop' ? 'rd-headline-3' : 'rd-headline-5'"
        >
          Checkout
        </h2>
      </div>
      <div v-if="cart" class="rd-page-body">
        <h2 v-if="viewMode === 'mobile'" class="rd-page-title rd-headline-3">
          Checkout
        </h2>
        <rd-menu-arranger
          v-if="cart.method.type === 'pre-order'"
          :data="cart.items"
          @note="editNoteBackdrop"
          @add="addQuantity"
          @subtract="subtractQuantity"
          @change="groupsHandler"
          @open-panel="deliveryHandler"
        />
      </div>
    </div>
    <div class="rd-panel"></div>
    <rd-backdrop
      v-if="backdropIndex !== -1"
      class="rd-backdrop"
      :state="backdropState"
      @exit="
        backdropState = 'idle';
        backdropIndex = -1;
      "
    >
      <div class="rd-backdrop-header">
        <span class="rd-backdrop-title rd-headline-3">Metode pemesanan</span>
      </div>
      <div v-if="backdropIndex === 0" class="rd-backdrop-body">
        <div class="rd-backdrop-input-wrapper">
          <rd-input-textarea class="rd-backdrop-input" :input="noteInput" />
        </div>
        <div
          class="rd-backdrop-input-wrapper"
          v-if="
            (cart.method.type === 'dine-in' && cart.method.table) ||
            (cart.method.type === 'booking' && cart.method.guest)
          "
        >
          <span class="rd-backdrop-input-label rd-headline-6">Take away?</span>
          <rd-input-toggle :input="takeAwayInput" />
        </div>
        <div class="rd-backdrop-button-wrapper">
          <rd-input-button
            class="rd-backdrop-button"
            label="simpan"
            @clicked="addNote"
          />
        </div>
      </div>
    </rd-backdrop>
  </div>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputOption } from "~~/interfaces/general";
  import { MenuCart, MenuGroup } from "~~/interfaces/menus";
  import { OrderCart } from "~~/interfaces/orders";

  definePageMeta({
    middleware: ["auth"],
  });
  const route = useRoute();
  const { viewMode } = useMain();
  const { cart, loadCart } = useOrders();
  const emits = defineEmits(["open-panel", "change-page"]);

  const backdropState = ref<"hide" | "idle">("idle");
  const backdropIndex = ref<number>(-1);
  const backdropData = ref<MenuCart>(null);

  const scrollValue = ref<number>(0);
  const scrollThreshold = ref<number>(0);

  const cartGroups = ref<MenuGroup[]>(null);

  const noteInput = ref<InputOption>({
    name: "note",
    placeholder: "Ekstra pedas!",
    label: "Catatan",
    model: "",
  });
  const takeAwayInput = ref<{ model: boolean }>({
    model: false,
  });

  const rem: ComputedRef<number> = computed((): number =>
    typeof getComputedStyle === "function"
      ? parseInt(getComputedStyle(document.body).fontSize)
      : 0
  );
  const headerActive: ComputedRef<boolean> = computed(
    (): boolean => scrollValue.value >= scrollThreshold.value
  );
  const note: ComputedRef<string> = computed(() => noteInput.value.model);
  const takeAway: ComputedRef<boolean> = computed(
    () => takeAwayInput.value.model
  );

  const cartGroupItems: ComputedRef<OrderCart["items"]> = computed(() =>
    cartGroups.value?.map((a) => a.items).flat()
  );

  function scrollHandler(): void {
    scrollValue.value = document.documentElement.scrollTop;
  }

  function editNoteBackdrop(data: MenuCart): void {
    backdropIndex.value = 0;
    backdropData.value = data;
    if (data.take_away) takeAwayInput.value.model = data.take_away;
    else takeAwayInput.value.model = false;
    if (data.note) noteInput.value.model = data.note;
    else noteInput.value.model = "";
  }

  function addNote(): void {
    const index: number = cart.value?.items.findIndex(
      (a) => a._id === backdropData.value?._id
    );
    if (index > -1) {
      cart.value.items[index].note = note.value;
      cart.value.items[index].take_away = takeAway.value;
    }
    backdropState.value = "hide";
  }
  function addQuantity(data: MenuCart): void {
    const index: number = cart.value?.items.findIndex(
      (a) => a._id === data?._id
    );
    if (index > -1) {
      cart.value.items[index].quantity++;
    }
  }
  function subtractQuantity(data: MenuCart): void {
    const index: number = cart.value?.items.findIndex(
      (a) => a._id === data?._id
    );
    if (index > -1) {
      cart.value.items[index].quantity--;
    }
  }

  function groupsHandler(data: MenuGroup[]): void {
    cartGroups.value = data;
  }

  function deliveryHandler(data: MenuGroup): void {
    emits("open-panel", {
      state: "show",
      type: "delivery",
      data: {
        group: data,
        restaurant: cart.value.restaurant,
      },
    });
  }

  watch(
    () => cartGroupItems.value,
    (val) => {
      cart.value.items = [...val];
    }
  );

  onMounted(() => {
    scrollThreshold.value = 2 * rem.value;
    loadCart(route.params.code.toString());

    window.addEventListener("scroll", scrollHandler);

    if (!cart.value) {
      emits("change-page", `/restaurants/${route.params.code}?type=dine-in`);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", scrollHandler);
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    .rd-page {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-page-header {
        z-index: 2;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4rem;
        padding: 1rem;
        background: var(--background-depth-two-color);
        box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-two-color);
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        h2.rd-page-name {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transform: scale(0.875);
          transition: 0.25s opacity, 0.25s transform;
        }
        &.rd-page-header-active {
          box-shadow: none;
          h2.rd-page-name {
            opacity: 1;
            transform: scale(1);
          }

          &::before {
            opacity: 1;
          }
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--background-depth-one-color);
          border-bottom: var(--border);
          opacity: 0;
          transition: 0.25s opacity;
        }
      }
      .rd-page-body {
        z-index: 1;
        position: relative;
        width: 100%;
        margin-top: 5rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        h2.rd-page-title {
          position: relative;
          width: 100%;
          height: 1rem;
          padding: 0 1rem;
          margin-bottom: 1rem;
          box-sizing: border-box;
          display: flex;
          flex-shrink: 0;
          align-items: center;
        }
      }
    }
    .rd-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      background: var(--background-depth-one-color);
    }
    .rd-backdrop {
      .rd-backdrop-header {
        position: relative;
        width: 100%;
        margin: 1rem 0;
        display: flex;
        .rd-backdrop-title {
          position: relative;
          width: 100%;
          height: 1rem;
          display: flex;
          flex-shrink: 0;
          align-items: center;
        }
      }
      .rd-backdrop-body {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        .rd-backdrop-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span.rd-backdrop-input-label {
            position: relative;
            opacity: 0.5;
          }
          .rd-backdrop-input {
            width: 100%;
          }
        }
        .rd-backdrop-button-wrapper {
          position: relative;
          width: 100%;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          .rd-backdrop-button {
            width: 100%;
          }
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      height: 100vh;
      flex-direction: row;
      .rd-page {
        position: elative;
        width: calc(100% - 20rem);
        height: 100%;
        display: flex;
        flex-direction: column;
        .rd-page-header {
          position: fixed;
          top: 0;
          left: 0;
          height: 6rem;
          border-bottom: var(--border);
          background: var(--background-depth-one-color);
          padding: 2rem;
          box-sizing: border-box;
          h2.rd-page-name {
            position: relative;
            width: auto;
            opacity: 1;
            margin-left: 1rem;
            transform: none;
          }
        }
        .rd-page-body {
          height: calc(100vh - 6rem);
          margin-top: 6rem;
        }
      }
      .rd-panel {
        position: relative;
        width: 20rem;
        height: 100%;
        padding: 2rem;
        border-left: var(--border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .rd-backdrop {
        height: 100%;
        padding: 0 2rem;
        .rd-backdrop-body {
          height: 100%;
          .rd-backdrop-button-wrapper {
            position: absolute;
            left: -2rem;
            bottom: 0;
            width: calc(100% + 4rem);
            height: 6rem;
            margin: 0;
            padding: 2rem 2rem 2rem 2rem;
            box-sizing: border-box;
            flex-shrink: 0;
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 1px;
              background: var(--border-color);
            }
          }
        }
      }
    }
  }
</style>
