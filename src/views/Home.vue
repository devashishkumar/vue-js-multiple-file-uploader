<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <!-- <FileUploader
      ref="fileUploader"
      :multiple="true"
      :config="config"
      @fileUploadEmitter="fileUploadHandler($event)"
      @filesEmitter="handleFiles($event)"
    />

    <button
      v-if="files.length > 0"
      class="btn btn-info btn-sm resetBtn afu-reset-btn"
      v-on:click="fileUpload()"
    >
      Upload Files
    </button> -->

    <input type="text" ref="input" />

    <button
      class="btn btn-info btn-sm resetBtn afu-reset-btn"
      v-on:click="handleInput()"
    >
      handle Input
    </button>

    <div ref="block">
      <p>first para</p>
      <p>second para</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import FileUploader from "@/components/file-uploader.vue"; // @ is an alias to /src
import axios from "axios";

@Options({
  components: {
    FileUploader,
  },
  data() {
    return {
      files: [],
      config: {
        maxSize: 10,
        uploadConfig: {
          url: "test url",
          method: "POST",
          userRef: "test user",
        },
        formatsAllowed: ".jpg, .png, .mp4",
        multipleUpload: true,
      },
    };
  },
  created() {
    // .style.backgroundColor = 'green'
    axios
      .get("/users/allusers")
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // execute always
      });
    setTimeout(() => {
      console.log(this.$refs);
      // this.$refs.block.style.backgroundColor = 'yellow';
      const paras = this.$refs.block.querySelectorAll("p");
      if (paras.length > 0) {
        paras.forEach((e: any, index: number) => {
          e.innerText = `${e.innerText} ${index}`;
          e.style.color = "green";
        });
      }
    }, 1000);
  },
  methods: {
    fileUploadHandler(data: any) {
      console.log(data, "36");
    },
    handleFiles: function (data: any) {
      console.log(data, "34");
      console.log(this.$refs.fileUploader);
      this.files = data.validFiles;
    },
    fileUpload: function () {
      console.log(this.$refs.fileUploader.fileUpload());
    },
    handleInput: function () {
      this.$refs.input.value = "ashish";
      console.log(this.$refs.input.focus());
    },
  },
})
export default class Home extends Vue {}
</script>
