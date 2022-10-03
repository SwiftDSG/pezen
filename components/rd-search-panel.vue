<template>
  <rd-panel
    class="rd-panel"
    :state="panelState"
    :loading="dataLoading"
    style="z-index: 10"
    @exit="emits('exit')"
  >
    <div v-if="searchData?.['menu-packs']?.length" class="rd-panel-row">
      <rd-menus-scheduled
        label="Jadwal Menu"
        :data="searchData?.['menu-packs']"
      />
    </div>
    <div v-if="searchData?.['menus']?.length" class="rd-panel-row">
      <rd-menus-list label="Menu" :data="searchData?.['menus']" />
    </div>
    <div v-if="searchData?.['restaurants']?.length" class="rd-panel-row">
      <rd-restaurants-list
        label="Restoran"
        :data="searchData?.['restaurants']"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  const { searchLoading, searchData } = useMain();
  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const dataLoading = ref<boolean>(false);

  const panelState = ref<"idle" | "hide">("idle");

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );
  watch(
    () => searchLoading.value,
    (val) => {
      if (val) dataLoading.value = true;
      else
        setTimeout(() => {
          dataLoading.value = false;
        }, 500);
    }
  );
  watch(
    () => searchData.value,
    (val) => {
      console.log(val);
    }
  );
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-row {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      &:first-child {
        margin-top: 3rem;
      }
    }
  }
</style>
