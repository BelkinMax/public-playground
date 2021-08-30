<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list>
        <v-list-item to="/" router exact>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group
          v-for="(categoriy, i) in categories"
          :key="i"
          no-action
          sub-group
          :value="false"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ categoriy.title }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in categoriy.items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="title" />
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>Maxim Belkin {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      categories: [
        {
          title: "Challenges",
          items: [
            {
              title: "Exclude cells",
              to: "/challenges/exclude"
            }
          ]
        },
        {
          title: "Games",
          items: [
            {
              title: "Exclude cells",
              to: "/challenges/exclude"
            }
          ]
        }
      ],
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: "My JavaScript Playground"
    };
  }
};
</script>
