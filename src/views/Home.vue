<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <FileUploader
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
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import FileUploader from "@/components/file-uploader.vue"; // @ is an alias to /src

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
      }
    };
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
    fileUpload: function() {
      console.log(this.$refs.fileUploader.fileUpload());
    }
  },
})
export default class Home extends Vue {}
</script>
