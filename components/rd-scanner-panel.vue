<template>
  <rd-panel
    class="rd-panel"
    label="Pilih Lokasi"
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
  </rd-panel>
</template>

<script lang="ts" setup>
  import gsap from "gsap";

  const { viewMode } = useMain();
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
</script>
