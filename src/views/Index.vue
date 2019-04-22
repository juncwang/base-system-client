<template>
    <div class="index">
        <HeadContent></HeadContent>
        <NavLeft></NavLeft>
        <router-view></router-view>
    </div>
</template>

<script>
import HeadContent from '../components/HeadContent'
import NavLeft from '../components/NavLeft'

export default {
    name: 'index',
    components: {
        HeadContent,
        NavLeft
    }
}
</script>

<style scoped>
.index{
    width: 100%;
    height: 100%;
}
</style>


