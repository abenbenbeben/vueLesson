<template>
  <div>
    <slot name="header">
      <h2>何もない場合</h2>
    </slot>
    <slot name="main">
      <h2>何もない場合</h2>
    </slot>
  </div>
</template>
<style scoped>
div {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  padding: 16px;
}
</style>
