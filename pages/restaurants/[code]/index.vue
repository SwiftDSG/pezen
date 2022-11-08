<template>
  <div class="rd-container" ref="rdContainer">
    <div
      v-if="restaurant"
      class="rd-header"
      :class="scrollValue > 0 ? 'rd-header-active' : ''"
    >
      <div class="rd-restaurant-name-container">
        <rd-input-button-small icon="arrow-left" />
        <span
          class="rd-restaurant-name"
          :class="viewMode === 'mobile' ? 'rd-headline-5' : 'rd-headline-3'"
        >
          {{ restaurant.name }}
        </span>
        <rd-input-button-small
          v-if="viewMode === 'mobile'"
          icon="information"
        />
      </div>
      <div
        v-if="viewMode === 'desktop'"
        @click="backdropIndex = 0"
        class="rd-restaurant-order-method"
      >
        <div class="rd-restaurant-order-method-details">
          <span class="rd-restaurant-order-method-value rd-headline-5">{{
            `${restaurantSelectedMethod.name}${
              restaurantSelectedMethod.type === "dine-in"
                ? ` (${
                    restaurantSelectedMethod.table
                      ? `meja ${restaurantSelectedMethod.table}`
                      : "take away"
                  })`
                : ""
            }`
          }}</span>
          <span
            class="rd-restaurant-order-method-placeholder rd-caption-text"
            >{{ restaurantSelectedMethod.message }}</span
          >
        </div>
        <div class="rd-restaurant-order-method-icon-container">
          <rd-svg
            class="rd-restaurant-order-method-icon"
            :name="restaurantSelectedMethod.icon"
          />
        </div>
      </div>
    </div>
    <div v-if="restaurant" class="rd-body">
      <div class="rd-restaurant-jumbotron">
        <div class="rd-restaurant-jumbotron-image-container">
          <img src="/background.svg" class="rd-restaurant-jumbotron-image" />
        </div>
        <div class="rd-restaurant-jumbotron-details">
          <div class="rd-restaurant-jumbotron-main-details">
            <div class="rd-restaurant-jumbotron-categories">
              <span
                v-for="n in restaurant.categories"
                :key="n"
                class="rd-restaurant-jumbotron-category rd-headline-6"
                >{{ restaurantTypes[n] }}</span
              >
            </div>
            <h1 class="rd-restaurant-jumbotron-name rd-headline-3">
              {{ restaurant.name }}
            </h1>
          </div>
          <div class="rd-restaurant-jumbotron-secondary-details">
            <div class="rd-restaurant-jumbotron-detail">
              <div class="rd-restaurant-jumbotron-icon-container">
                <rd-svg
                  class="rd-restaurant-jumbotron-icon"
                  name="star"
                  color="primary"
                />
              </div>
              <span class="rd-restaurant-jumbotron-value rd-headline-6"
                >4.8</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="rd-restaurant-details">
        <div class="rd-restaurant-details-row">
          <div class="rd-restaurant-detail rd-restaurant-detail-small">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="currency" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-placeholder rd-caption-text"
                >Harga</span
              >
              <span class="rd-restaurant-detail-value rd-headline-5">{{
                restaurantPriceLevels[restaurant.price_level]
              }}</span>
            </div>
          </div>
          <div class="rd-restaurant-detail rd-restaurant-detail-small">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="map-marker" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-placeholder rd-caption-text">{{
                restaurant.distance ? "Jarak" : "Lokasi"
              }}</span>
              <span class="rd-restaurant-detail-value rd-headline-5">{{
                restaurant.distance
                  ? `${(restaurant.distance / 1000).toFixed(2)}km`
                  : restaurantCity
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="viewMode === 'desktop'" class="rd-restaurant-details-row">
          <div class="rd-restaurant-detail rd-restaurant-detail-large">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="map-marker" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-placeholder rd-caption-text"
                >Alamat</span
              >
              <span class="rd-restaurant-detail-value rd-headline-5">{{
                restaurant.address
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="viewMode === 'desktop'" class="rd-restaurant-details-row">
          <div class="rd-restaurant-detail rd-restaurant-detail-large">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="calendar" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-value rd-headline-5"
                >Jadwal Operasional</span
              >
            </div>
            <div
              v-for="(hour, i) in restaurant.opening_hours"
              :key="i"
              class="rd-restaurant-detail-day-container"
              :style="i === 0 ? 'margin-top: 0.75rem' : ''"
              :class="
                i === new Date().getDay()
                  ? 'rd-restaurant-detail-day-container-active'
                  : ''
              "
            >
              <div class="rd-restaurant-detail-day-icon-container">
                <span class="rd-restaurant-detail-day-icon rd-headline-3">{{
                  days[i][0]
                }}</span>
              </div>
              <div class="rd-restaurant-detail-value-container">
                <span
                  class="rd-restaurant-detail-placeholder rd-caption-text"
                  >{{ days[i] }}</span
                >
                <span class="rd-restaurant-detail-value rd-headline-5">{{
                  hour === "opened"
                    ? "24 jam"
                    : hour === "closed"
                    ? "Libur"
                    : `${hour.open} - ${hour.close}`
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="viewMode === 'mobile'"
          @click="backdropIndex = 0"
          class="rd-restaurant-order-method"
        >
          <div class="rd-restaurant-order-method-icon-container">
            <rd-svg
              class="rd-restaurant-order-method-icon"
              :name="restaurantSelectedMethod.icon"
            />
          </div>
          <div class="rd-restaurant-order-method-details">
            <span class="rd-restaurant-order-method-value rd-headline-5">{{
              `${restaurantSelectedMethod.name}${
                restaurantSelectedMethod.type === "dine-in"
                  ? ` (${
                      restaurantSelectedMethod.table
                        ? `meja ${restaurantSelectedMethod.table}`
                        : "take away"
                    })`
                  : ""
              }`
            }}</span>
            <span
              class="rd-restaurant-order-method-placeholder rd-caption-text"
              >{{ restaurantSelectedMethod.message }}</span
            >
          </div>
        </div>
      </div>
      <div
        v-for="(menus, i) in visibleMenus"
        :key="`${i}-${menus.category}`"
        class="rd-restaurant-menus"
      >
        <div class="rd-restaurant-menus-header">
          <span class="rd-restaurant-menus-category rd-headline-4">{{
            menus.category
          }}</span>
          <span class="rd-restaurant-menus-count rd-headline-5">{{
            `${menus.menus?.length} item`
          }}</span>
        </div>
        <div class="rd-restaurant-menus-body">
          <rd-menu
            @add="addToCart"
            @subtract="subtractFromCart"
            v-for="menu in menus.menus"
            :key="menu._id"
            :data="menu"
            :cart="restaurantCart?.find((a) => a._id === menu._id)"
            class="rd-restaurant-menu"
          />
        </div>
      </div>
    </div>
    <div
      class="rd-notification-container"
      :style="!restaurantCart.length ? 'pointer-events: none' : ''"
      @click="
        emits('change-page', `/restaurants/${route.params.code}/checkout`)
      "
    >
      <div
        :style="restaurantCart.length ? 'transform: translateY(0)' : ''"
        class="rd-notification"
      >
        <div class="rd-notification-icon-container">
          <rd-svg class="rd-notification-icon" name="basket" color="primary" />
        </div>
        <div class="rd-notification-details">
          <span class="rd-notification-value rd-headline-5">
            {{ `${restaurantCartTotal.count} item` }}
          </span>
          <span class="rd-notification-placeholder rd-caption-text">
            {{ restaurantSelectedMethod.name }}
          </span>
          <span class="rd-notification-price rd-headline-6">
            {{ `Rp ${restaurantCartTotal.value.toLocaleString("de-DE")}` }}
          </span>
        </div>
      </div>
    </div>
    <rd-progress-bar
      type="overlay"
      style="height: 100vh"
      :state="restaurantLoading ? 'show' : 'hide'"
    />
    <rd-backdrop
      class="rd-backdrop"
      v-if="backdropIndex !== -1"
      :state="backdropState"
      @exit="
        backdropIndex = -1;
        backdropState = 'idle';
      "
    >
      <div class="rd-backdrop-header">
        <span class="rd-backdrop-title rd-headline-3">Metode pemesanan</span>
      </div>
      <div v-if="backdropIndex === 0" class="rd-backdrop-body">
        <div
          v-for="method in restaurantOrderMethods"
          :key="method.type"
          class="rd-backdrop-order-method"
          @click="changeMethod(method.type)"
        >
          <div class="rd-backdrop-order-method-icon-container">
            <rd-svg class="rd-backdrop-order-method-icon" :name="method.icon" />
          </div>
          <div class="rd-backdrop-order-method-details">
            <span class="rd-backdrop-order-method-value rd-headline-5">{{
              method.name
            }}</span>
            <span
              class="rd-backdrop-order-method-placeholder rd-caption-text"
              >{{ method.message }}</span
            >
          </div>
        </div>
      </div>
    </rd-backdrop>
  </div>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import {
    RestaurantMenuCategories,
    RestaurantMenusResponse,
  } from "~~/interfaces/general";
  import { Menu, MenuCart, MenuPack } from "~~/interfaces/menus";
  import { OrderMethod } from "~~/interfaces/orders";
  import { RestaurantDetails } from "~~/interfaces/restaurants";

  const route = useRoute();
  const router = useRouter();
  const { viewMode } = useMain();
  const { setAlert } = useAlert();
  const { restaurantTypes, getRestaurantDetails, getRestaurantMenus } =
    useRestaurants();
  const { cart, setCart, loadCart } = useOrders();
  const emits = defineEmits(["open-panel", "change-page"]);

  const scrollValue = ref<number>(0);

  const backdropIndex = ref<number>(-1);
  const backdropState = ref<"idle" | "hide">("idle");

  const restaurantCart = ref<MenuCart[]>([]);
  const restaurantMenus = ref<{
    "dine-in": RestaurantMenusResponse;
    "pre-order": RestaurantMenusResponse;
  }>({
    "dine-in": null,
    "pre-order": null,
  });
  const restaurantLoading = ref<boolean>(true);
  const restaurant = ref<RestaurantDetails>(null);

  const visibleMenus = ref<RestaurantMenuCategories[]>(null);
  const visibleMenuPacks = ref<MenuPack[]>(null);

  const restaurantPriceLevels: string[] = [
    "< 25k",
    "25k ~ 50k",
    "50k ~ 100k",
    "> 100k",
  ];

  const days: string[] = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const restaurantOrderMethods: ComputedRef<OrderMethod[]> = computed(() => {
    let arr: OrderMethod[] = [
      {
        type: "dine-in",
        name: "Dine in",
        available: !!restaurant.value?.methods["dine-in"]?.count,
        message: `${
          restaurant.value?.methods["dine-in"]?.count || 0
        } menu tersedia`,
        icon: "silverware",
        table: route.query?.table?.toString(),
      },
      {
        type: "booking",
        name: "Reservasi",
        available: !!restaurant.value?.methods["dine-in"]?.count,
        message: `${
          restaurant.value?.methods["dine-in"]?.count || 0
        } menu tersedia`,
        icon: "table-chair",
        guest: parseInt(route.query?.guest?.toString() || "0"),
        date: parseInt(route.query?.date?.toString() || "0"),
      },
      {
        type: "pre-order",
        name: "Pre-order",
        available: !!restaurant.value?.methods["pre-order"]?.count,
        message: `${
          restaurant.value?.methods["pre-order"]?.count || 0
        } menu tersedia`,
        icon: "calendar",
      },
    ];
    return arr;
  });

  const restaurantSelectedMethod: ComputedRef<OrderMethod> = computed(() => {
    let str: string = route.query?.type?.toString() || "";
    if (str !== "booking" && str !== "dine-in" && str !== "pre-order")
      str = "dine-in";
    return restaurantOrderMethods.value.find((a) => a.type === str);
  });
  const restaurantMenuType: ComputedRef<"dine-in" | "pre-order"> = computed(
    () => {
      let str: string = route.query?.type?.toString() || "";
      if (str === "booking" || (str !== "dine-in" && str !== "pre-order"))
        return "dine-in";
      return str;
    }
  );
  const restaurantCity: ComputedRef<string> = computed(() => {
    let str: string = "";
    if (!restaurant.value) str = "Indonesia";
    const index: number = restaurant.value.formatted_address.findIndex((a) => {
      a = a.toLowerCase();
      return (
        a.includes("kota") || a.includes("kabupaten") || a.includes("kab.")
      );
    });
    if (index > -1) {
      str = restaurant.value.formatted_address[index];
      if (viewMode.value === "mobile") {
        str = str
          .toLowerCase()
          .replace(/(kota)|(kabupaten)|(kab\.)|(kab)|/g, "")
          .trim();
      }
    } else {
      str = restaurant.value.formatted_address[1];
    }
    return str;
  });
  const restaurantCartTotal: ComputedRef<{ count: number; value: number }> =
    computed(() => {
      const count: number =
        restaurantCart.value?.reduce((a, b) => a + b.quantity, 0) || 0;
      const value: number =
        restaurantCart.value?.reduce(
          (a, b) => a + b.quantity * (b.markup_price || b.price),
          0
        ) || 0;
      return { count, value };
    });

  function scrollHandler(): void {
    scrollValue.value = document.documentElement.scrollTop;
  }
  function addToCart(data: Menu): void {
    const index: number = restaurantCart.value.findIndex(
      (a) => a._id === data._id
    );
    if (index > -1) {
      restaurantCart.value[index].quantity++;
    } else {
      restaurantCart.value.push({
        _id: data._id,
        name: data.name,
        quantity: 1,
        price: data.price,
        markup_price: data.markup_price,
        image_url: data.image_url,
        make_duration: data.make_duration,
      });
    }
  }
  function subtractFromCart(data: Menu): void {
    const index: number = restaurantCart.value.findIndex(
      (a) => a._id === data._id
    );
    if (index > -1) {
      if (restaurantCart.value[index].quantity > 1) {
        restaurantCart.value[index].quantity--;
      } else {
        restaurantCart.value.splice(index, 1);
      }
    }
  }
  function changeMethod(type: OrderMethod["type"]): void {
    backdropState.value = "hide";
    if (type === "dine-in") {
      emits("open-panel", {
        state: "show",
        type: "scanner",
        data: route.params.code,
      });
    } else if (type === "booking") {
      emits("open-panel", {
        state: "show",
        type: "booking",
        data: {
          code: route.params.code,
          id: restaurant.value._id,
        },
      });
    } else if (type === "pre-order") {
      router.replace({
        query: {
          type,
        },
      });
    }
  }

  watch(
    () => restaurantCart.value,
    (val) => {
      if (val.length) {
        setCart({
          restaurant: {
            _id: restaurant.value._id,
            name: restaurant.value.name,
            logo_url: restaurant.value.logo_url,
            code: route.params.code.toString(),
          },
          method: {
            type: restaurantSelectedMethod.value.type,
            guest: restaurantSelectedMethod.value.guest,
            date: restaurantSelectedMethod.value.date,
            table: restaurantSelectedMethod.value.table,
          },
          items: val,
        });
      } else {
        setCart(null);
      }
    },
    { deep: true }
  );

  watch(
    () => restaurantMenuType.value,
    async (val) => {
      restaurantCart.value = [];
      if (!restaurantMenus.value[val]) {
        restaurantLoading.value = true;
        restaurantMenus.value[val] = await getRestaurantMenus(
          route.params.code.toString(),
          val
        );
        visibleMenus.value = restaurantMenus.value[val]?.categories;
        visibleMenuPacks.value = restaurantMenus.value[val]?.packs || [];
        setTimeout(() => {
          restaurantLoading.value = false;
        }, 500);
      } else {
        visibleMenus.value = restaurantMenus.value[val]?.categories;
        visibleMenuPacks.value = restaurantMenus.value[val]?.packs || [];
      }
    }
  );

  watch(
    () => restaurantSelectedMethod.value,
    (val) => {
      if (val.type === "booking" && !val.date) {
        emits("open-panel", {
          state: "show",
          type: "booking",
          data: {
            code: route.params.code,
            id: restaurant.value._id,
          },
        });
      }
    },
    { deep: true }
  );

  onMounted(async () => {
    try {
      restaurant.value = await getRestaurantDetails(
        route.params.code.toString()
      );
      if (!route.query.type) {
        if (restaurant.value.type !== "take-away") {
          router.replace({
            query: {
              type: "dine-in",
            },
          });
        } else {
          router.replace({
            query: {
              type: "pre-order",
            },
          });
        }
      }

      restaurantMenus.value[restaurantMenuType.value] =
        await getRestaurantMenus(
          route.params.code.toString(),
          restaurantMenuType.value
        );
      visibleMenus.value =
        restaurantMenus.value[restaurantMenuType.value].categories;
      visibleMenuPacks.value =
        restaurantMenus.value[restaurantMenuType.value].packs || [];
      setTimeout(() => {
        restaurantLoading.value = false;
        loadCart(route.params.code.toString());
        if (
          cart.value &&
          restaurantSelectedMethod.value.type === cart.value.method.type
        ) {
          restaurantCart.value = cart.value.items;
        } else {
          setCart(null);
        }
      }, 500);

      if (viewMode.value === "mobile") {
        document.addEventListener("scroll", scrollHandler);
      }
    } catch (e) {
      setAlert({
        type: "error",
        title: "Tidak dapat memuat restoran",
        message: "Terjadi masalah memuat restoran",
      });
    }
  });

  onBeforeUnmount(() => {
    if (viewMode.value === "mobile") {
      document.removeEventListener("scroll", scrollHandler);
    }
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100vw;
    display: flex;
    flex-direction: column;
    .rd-header {
      z-index: 2;
      position: fixed;
      width: 100%;
      height: 4rem;
      padding: 0 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-restaurant-name-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.rd-restaurant-name {
          position: relative;
          opacity: 0;
          transform: scale(0.875);
          transition: 0.25s opacity, 0.25s transform;
        }
      }
      &.rd-header-active {
        .rd-restaurant-name-container {
          span.rd-restaurant-name {
            opacity: 1;
            transform: scale(1);
          }
        }
        &::before {
          opacity: 1;
        }
        &::after {
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
        opacity: 0;
        transition: 0.25s opacity;
      }
      &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
        opacity: 0;
        transition: 0.25s opacity;
      }
    }
    .rd-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      > * {
        flex-shrink: 0;
      }
      .rd-restaurant-jumbotron {
        position: relative;
        width: 100%;
        height: 17.5rem;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
        overflow: hidden;
        background: var(--background-depth-three-color);
        display: flex;
        flex-shrink: 0;
        justify-content: flex-start;
        align-items: flex-start;
        .rd-restaurant-jumbotron-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          img.rd-restaurant-jumbotron-image {
            position: relative;
            width: 100%;
            height: 100%;
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
            object-fit: cover;
          }
        }
        .rd-restaurant-jumbotron-details {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          border-radius: 1rem;
          padding: 1rem 0;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-restaurant-jumbotron-main-details {
            position: relative;
            width: calc(100% - 3.5rem);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .rd-restaurant-jumbotron-categories {
              position: relative;
              width: 100%;
              height: 1rem;
              margin-bottom: 0.5rem;
              padding-left: 1rem;
              overflow-x: visible;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              span.rd-restaurant-jumbotron-category {
                position: relative;
                height: 1rem;
                padding: 0 0.375rem;
                margin-right: 0.5rem;
                color: #ccc;
                background: rgba(0, 0, 0, 0.25);
                border-radius: 0.5rem;
                white-space: nowrap;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            h1.rd-restaurant-jumbotron-name {
              position: relative;
              color: #fff;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 1.15;
              margin-left: 1rem;
            }
          }
          .rd-restaurant-jumbotron-secondary-details {
            position: relative;
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 1rem;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .rd-restaurant-jumbotron-detail {
              position: relative;
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 0.75rem;
              background: rgba(0, 0, 0, 0.25);
              backdrop-filter: blur(10px);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .rd-restaurant-jumbotron-icon-container {
                position: relative;
                width: 0.85rem;
                height: 0.85rem;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              span.rd-restaurant-jumbotron-value {
                position: relative;
                color: #ccc;
                margin-top: 0.125rem;
              }
            }
          }
        }
      }
      .rd-restaurant-details {
        position: relative;
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-restaurant-details-row {
          position: relative;
          width: 100%;
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .rd-restaurant-detail {
            position: relative;
            width: 100%;
            height: 2rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .rd-restaurant-detail-icon-container {
              position: relative;
              width: 2rem;
              height: 2rem;
              border-radius: 0.75rem;
              border: var(--border);
              padding: 0 0.5rem;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .rd-restaurant-detail-value-container {
              position: relative;
              width: calc(100% - 2rem);
              height: 100%;
              padding-left: 0.5rem;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              span.rd-restaurant-detail-placeholder {
                position: relative;
                margin-bottom: 0.125rem;
              }
            }
            &.rd-restaurant-detail-small {
              width: 50%;
              span.rd-restaurant-detail-value {
                position: relative;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            // &.rd-restaurant-detail-large {
            //   .rd-restaurant-detail-value-container {
            //     span.rd-restaurant-detail-value {
            //       position: relative;
            //       width: 100%;
            //       padding-right: 25%;
            //       box-sizing: border-box;
            //     }
            //   }
            // }
          }
        }
        .rd-restaurant-order-method {
          position: relative;
          width: 100%;
          border: var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .rd-restaurant-order-method-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border: var(--border);
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rd-restaurant-order-method-details {
            position: relative;
            width: calc(100% - 2rem);
            height: 100%;
            padding-left: 0.5rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            span.rd-restaurant-order-method-placeholder {
              position: relative;
              margin-top: 0.125rem;
            }
          }
        }
      }
      .rd-restaurant-menus {
        position: relative;
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .rd-restaurant-menus-header {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rd-restaurant-menus-body {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          .rd-restaurant-menu {
            margin-bottom: 0.75rem;
          }
        }
        &:last-child {
          margin: 0 0 1rem 0;
        }
      }
    }
    .rd-notification-container {
      z-index: 3;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4rem;
      padding: 0 1rem 1rem 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .rd-notification {
        cursor: pointer;
        position: relative;
        width: 100%;
        height: 3rem;
        padding: 0.5rem;
        border-radius: 0.75rem;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
        background: rgba(43, 25, 6, 0.5);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        transform: translateY(5rem);
        transform-origin: top center;
        transition: transform 0.25s ease-out;
        .rd-notification-icon-container {
          position: relative;
          width: 2rem;
          height: 2rem;
          flex-shrink: 0;
          border-radius: 0.5rem;
          padding: 0 0.5rem;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .rd-notification-details {
          position: relative;
          width: calc(100% - 2rem);
          height: 100%;
          color: #fff;
          padding-left: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          span {
            position: relative;
            color: inherit;
          }
          span.rd-notification-placeholder {
            margin-top: 0.125rem;
          }
          span.rd-notification-price {
            position: absolute;
            top: 0;
            right: 0.75rem;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        }
      }
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
        .rd-backdrop-order-method {
          cursor: pointer;
          position: relative;
          width: 100%;
          border: var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .rd-backdrop-order-method-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border: var(--border);
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rd-backdrop-order-method-details {
            position: relative;
            width: calc(100% - 2rem);
            height: 100%;
            padding-left: 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            flex-direction: column;
            span.rd-backdrop-order-method-placeholder {
              position: relative;
              margin-top: 0.125rem;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      height: 100vh;
      flex-direction: row;
      overflow-x: auto;
      .rd-header {
        position: fixed;
        top: 0;
        left: 0;
        height: 6rem;
        border-bottom: var(--border);
        background: var(--background-depth-one-color);
        padding: 2rem;
        box-sizing: border-box;
        justify-content: space-between;
        .rd-restaurant-name-container {
          width: auto;
          span.rd-restaurant-name {
            position: relative;
            opacity: 1;
            margin-left: 1rem;
            transform: none;
          }
        }
        .rd-restaurant-order-method {
          position: relative;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .rd-restaurant-order-method-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border: var(--border);
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rd-restaurant-order-method-details {
            position: relative;
            width: calc(100% - 2rem);
            height: 100%;
            padding-right: 1rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            span.rd-restaurant-order-method-placeholder {
              position: relative;
              margin-top: 0.125rem;
              text-align: right;
            }
            span.rd-restaurant-order-method-value {
              position: relative;
              text-align: right;
            }
          }
        }
      }
      .rd-body {
        position: absolute;
        bottom: 0;
        left: 0;
        width: auto;
        height: calc(100% - 6rem);
        flex-direction: row;
        .rd-restaurant-jumbotron {
          width: 30rem;
          height: calc(100vh - 6rem);
          border-radius: 0;
          .rd-restaurant-jumbotron-details {
            bottom: 2rem;
            left: 2rem;
            width: calc(100% - 4rem);
          }
        }
        .rd-restaurant-details {
          width: 20rem;
          height: calc(100% - 4rem);
          margin: 2rem 0 2rem 2rem;
          padding: 1rem;
          border: var(--border);
          border-radius: 1rem;
          overflow-y: auto;
          box-sizing: border-box;
          background: var(--background-depth-one-color);
          .rd-restaurant-details-row {
            .rd-restaurant-detail {
              height: auto;
              padding: 0.75rem;
              border-radius: 0.75rem;
              border: var(--border);
              background: var(--background-depth-one-color);
              box-sizing: border-box;
              flex-direction: column;
              align-items: flex-start;
              .rd-restaurant-detail-value-container {
                margin-top: 1rem;
                width: 100%;
                padding: 0;
                span.rd-restaurant-detail-placeholder {
                  margin-bottom: 0.125rem;
                }
              }
              .rd-restaurant-detail-day-container {
                position: relative;
                width: 100%;
                height: 2rem;
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                .rd-restaurant-detail-day-icon-container {
                  position: relative;
                  width: 2rem;
                  height: 2rem;
                  margin: 0 0.5rem 0 0;
                  border-radius: 0.5rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  span.rd-restaurant-detail-day-icon {
                    position: relative;
                    line-height: 1;
                  }
                  &::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 0.5rem;
                    background: var(--primary-color);
                    opacity: 0.1;
                    filter: grayscale(1);
                  }
                }
                .rd-restaurant-detail-value-container {
                  width: calc(100% - 2.5rem);
                  margin-top: 0;
                }
                &.rd-restaurant-detail-day-container-active {
                  .rd-restaurant-detail-day-icon-container {
                    span.rd-restaurant-detail-day-icon {
                      color: var(--primary-color);
                    }
                    &::before {
                      filter: grayscale(0);
                    }
                  }
                }
                &:last-child {
                  margin-bottom: 0;
                }
              }
              &.rd-restaurant-detail-small {
                width: calc(50% - 0.375rem);
              }
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .rd-restaurant-menus {
          width: 20rem;
          height: calc(100% - 4rem);
          margin: 2rem 0 2rem 2rem;
          padding: 1rem;
          border: var(--border);
          border-radius: 1rem;
          overflow-y: auto;
          box-sizing: border-box;
          background: var(--background-depth-one-color);
          .rd-restaurant-menus-header {
            top: -1rem;
            left: -1rem;
            width: calc(100% + 2rem);
            height: 3rem;
            padding: 1rem;
            border-bottom: var(--border);
            box-sizing: border-box;
          }
          &:last-child {
            margin: 2rem;
          }
        }
      }
      .rd-notification-container {
        height: 5rem;
        padding: 0 0 2rem 0;
        .rd-notification {
          width: 20rem;
        }
      }
      .rd-backdrop {
        padding: 0 2rem;
      }
    }
  }
</style>
