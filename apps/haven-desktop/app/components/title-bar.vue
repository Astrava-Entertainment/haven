<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {getCurrentWindow}                from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();
const isMaximized = ref(false);
const avatar = 'https://0.gravatar.com/avatar/cf8934eda9cd1a658be4928118d3718f759e5812086486ca024e661d93dffabd?size=256&d=initials';

let unlistenResized: null | (() => void) = null;

async function syncWindowState()
{
  try
  {
    isMaximized.value = await appWindow.isMaximized();
  } catch (error)
  {
    console.error('Failed to read window state:', error);
  }
}

async function minimize()
{
  try
  {
    await appWindow.minimize();
  } catch (error)
  {
    console.error('Failed to minimize window:', error);
  }
}

async function toggleMaximize()
{
  try
  {
    await appWindow.toggleMaximize();
    await syncWindowState();
  } catch (error)
  {
    console.error('Failed to toggle maximize state:', error);
  }
}

async function closeWindow()
{
  try
  {
    await appWindow.close();
  } catch (error)
  {
    console.error('Failed to close window:', error);
  }
}

onMounted(async () =>
{
  await syncWindowState();

  try
  {
    unlistenResized = await appWindow.onResized(async () =>
    {
      await syncWindowState();
    });
  } catch (error)
  {
    console.error('Failed to listen to resize events:', error);
  }
});

onBeforeUnmount(() =>
{
  unlistenResized?.();
});
</script>

<template>
  <header class="app-titlebar">
    <div
      class="app-titlebar__drag-region"
      data-tauri-drag-region
      @dblclick="toggleMaximize"
    >
      <div class="app-titlebar__brand">
        <span class="app-titlebar-logo" aria-hidden="true">
          <haven-logo/>
        </span>
      </div>
    </div>
    <div class='app-titlebar__extras'
         data-tauri-drag-region
         @dblclick="toggleMaximize"
    >
    </div>
    <div class='app-titlebar__window-right'>
<!--      <div class='app-titlebar__notifications mr-3'>-->
<!--        <Button size='medium' variant='outlined' aria-label='Notifications'>-->
<!--          <PhBellVue weight='regular' size='1.2rem'/>-->
<!--        </Button>-->
<!--        <OverlayBadge value='3' severity='danger' class='overlay-badge' size='small'/>-->
<!--      </div>-->

<!--      <div class='app-titlebar__avatar mr-3'>-->
<!--        <Avatar class="avatar" size='normal' shape='square' aria-label='My user'-->
<!--                image='https://gravatar.com/avatar/cf8934eda9cd1a658be4928118d3718f759e5812086486ca024e661d93dffabd.png'-->
<!--        />-->
<!--      </div>-->
      <div class="app-titlebar__window-controls" aria-label="Window controls">
        <button
          class="app-titlebar__control app-titlebar__control--minimize"
          type="button"
          aria-label="Minimize window"
          title="Minimize"
          @click="minimize"
        >
          <span class="app-titlebar__control-glyph app-titlebar__control-glyph--minimize"/>
        </button>

        <button
          class="app-titlebar__control app-titlebar__control--maximize"
          type="button"
          :aria-label="isMaximized ? 'Restore window' : 'Maximize window'"
          :title="isMaximized ? 'Restore' : 'Maximize'"
          @click="toggleMaximize"
        >
          <span
            v-if="!isMaximized"
            class="app-titlebar__control-glyph app-titlebar__control-glyph--maximize"
          />
          <span
            v-else
            class="app-titlebar__control-glyph app-titlebar__control-glyph--restore"
          />
        </button>

        <button
          class="app-titlebar__control app-titlebar__control--close"
          type="button"
          aria-label="Close window"
          title="Close"
          @click="closeWindow"
        >
          <span class="app-titlebar__control-glyph app-titlebar__control-glyph--close"/>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang='css'>

.app-titlebar {
  --titlebar-height: 62px;
  --titlebar-control-width: 46px;
  --titlebar-inline-padding: 0.875rem;
  --titlebar-brand-gap: 0.625rem;
  --titlebar-transition: 160ms ease;
  //--titlebar-fg: #1c1913;
  --titlebar-fg: #f7f4e6;

  @media (prefers-color-scheme: dark) {
    /** .app-titlebar {
      --titlebar-fg: #f7f4e6;
    }
   */
  }

  height: var(--titlebar-height);
  display: grid;
  grid-template-columns: [first] 1fr [second] 1fr [third] auto;
  align-items: stretch;
  background: var(--titlebar-fg);
  color: var(--p-surface-0);
  //border-bottom: 1px solid var(--p-surface-200);
  user-select: none;
  position: relative;
  z-index: 20;
}

.app-titlebar__extras {
  display: flex;
  align-items: center;
}

.overlay-badge {
  position: absolute;
  bottom: 1.2rem;
  right: 0.1rem;
  transform: scale(80%);
}

.app-titlebar__notifications {
  display: flex;
  position: relative;
  align-items: center;
  &>button {
    padding: 0;
    width: 2rem;
    height: 2rem;
  }
}

.app-titlebar__avatar {
  display: flex;
  position: relative;
  align-items: center;

  .avatar {
    width: 1.65rem;
    height: 1.65rem;
    padding: 2px;
    box-sizing: content-box;
    border: solid 1px var(--p-primary-400);
    //border-radius: 10px;

    &:hover {
      border: solid 1px var(--p-primary-200);
    }
  }

  //display: flex;
  //align-items: center;
  //padding-right: var(--titlebar-inline-padding);
}

.app-titlebar__drag-region {
  min-width: 0;
  display: flex;
  align-items: center;
  padding-inline: 1rem var(--titlebar-inline-padding);
}

.app-titlebar__brand {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--titlebar-brand-gap);
}

.app-titlebar-logo {
  width: 1.6rem;
  height: 1.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.app-titlebar__window-right {
  display: flex;
  align-items: stretch;
  flex: 0 0 auto;
}

.app-titlebar__window-controls {
  //display: flex;
  //align-items: stretch;
  //flex: 0 0 auto;
}

.app-titlebar__control {
  width: var(--titlebar-control-width);
  height: var(--titlebar-height);
  appearance: none;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: background-color var(--titlebar-transition),
  color var(--titlebar-transition),
  opacity var(--titlebar-transition);
  position: relative;
}

.app-titlebar__control:hover {
  background: var(--p-surface-200);
}

.app-titlebar__control:active {
  background: var(--p-surface-200);
}

.app-titlebar__control:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 1px var(--p-primary-400);
  background: var(--p-surface-100);
}

.app-titlebar__control--close:hover {
  background: #c42b1c;
  color: #ffffff;
}

.app-titlebar__control--close:active {
  background: #a1271b;
  color: #ffffff;
}

.app-titlebar__control-glyph {
  position: relative;
  display: block;
  width: 12px;
  height: 12px;
  opacity: 0.95;
}

.app-titlebar__control-glyph--minimize::before {
  content: '';
  position: absolute;
  left: 1px;
  right: 1px;
  bottom: 3px;
  height: 1.5px;
  background: currentColor;
  border-radius: 999px;
}

.app-titlebar__control-glyph--maximize::before {
  content: '';
  position: absolute;
  inset: 1px;
  border: 1.5px solid currentColor;
  border-radius: 1px;
}

.app-titlebar__control-glyph--restore::before,
.app-titlebar__control-glyph--restore::after {
  content: '';
  position: absolute;
  box-sizing: border-box;
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  border-radius: 1px;
  background: transparent;
}

.app-titlebar__control-glyph--restore::before {
  top: 1px;
  right: 1px;
}

.app-titlebar__control-glyph--restore::after {
  left: 1px;
  bottom: 1px;
  background: var(--p-surface-0);
}

.app-titlebar__control-glyph--close::before,
.app-titlebar__control-glyph--close::after {
  content: '';
  position: absolute;
  top: 0.75px;
  left: 5.25px;
  width: 1.5px;
  height: 10.5px;
  background: currentColor;
  border-radius: 999px;
  transform-origin: center;
}

.app-titlebar__control-glyph--close::before {
  transform: rotate(45deg);
}

.app-titlebar__control-glyph--close::after {
  transform: rotate(-45deg);
}

@media (prefers-reduced-motion: reduce) {
  .app-titlebar__control {
    transition: none;
  }
}

</style>
