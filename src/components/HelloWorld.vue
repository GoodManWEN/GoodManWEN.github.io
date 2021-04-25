<template>
  <v-container>
    <v-app-bar app color="primary" dark >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <div class="tw-h-40"></div>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3 animate__animated animate__bounce animate__infinite tw-text-blue-500">
          Welcome to Vuetify
        </h1>
        <p class="tw-font-bold"> This sentence was newly added via tailwind, If you see three evenly distributed divs below, then tailwind is working correctly. </p>
        <p class="tw-font-bold"> And if the following text color is <span class="tw-bg-red-500 tw-text-gray-50">RGB</span>, SCSS module is working correctly. </p>
        <div class="tw-w-full tw-px-12 tw-flex tw-justify-evenly">
          <p class="x-color-1"> P-1-RED </p>
          <p class="x-color-2"> P-2-GREEN </p>
          <p class="x-color-3"> P-3-BLUE </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => ({
    }),
    created(){
      this.$utils.dynamic_append_link("https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css")
    },
    mounted(){
    },
    watch:{
    },
    computed:{
    },
    methods:{
    }
  }
</script>


<style scoped lang="scss">
$color1 : #f00;
$color2 : #0f0;
$color3 : #00f;

.x-color-1 {
  color: $color1;
}

.x-color-2 {
  color: $color2;
}

.x-color-3 {
  color: $color3;
}
</style>