<template>
  <div class="container">
    <input
      type="file"
      :id="divId"
      style="display: none"
      title="Select file"
      name="files[]"
      :multiple="multiple"
      :accept="config.formatsAllowed"
      v-on:change="onChange($event)"
    />

    <button
      class="btn btn-primary btn-sm afu-select-btn"
      v-on:click="triggerFilesControl()"
    >
      Select Files
    </button>
    <button
      v-if="allowedFiles.length > 0"
      class="btn btn-info btn-sm resetBtn afu-reset-btn"
      v-on:click="resetFileUpload()"
    >
      Reset
    </button>
    <p class="constraints-info afu-constraints-info">
      ({{ config.formatsAllowed }}) Size Limit: {{ config.maxSize }} MB
    </p>

    <div class="allowed-files">
      <div v-if="allowedFiles.length > 0">Alowed Files</div>
      <div
        class="row afu-valid-file"
        v-for="(sf, index) in allowedFiles"
        :key="sf.size"
      >
        <p class="col-xs-3 textOverflow">
          <span class="text-primary">{{ sf.name }}</span>
        </p>
        <p class="col-xs-3 padMarg sizeC">
          <strong>({{ convertSize(sf.size) }}) MB</strong
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
        <button
          type="button"
          class="close"
          aria-label="Close"
          v-on:click="removeRecord(index)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <div class="allowed-files">
      <div v-if="notAllowedFiles.length > 0">Invalid Files</div>
      <div
        class="row afu-valid-file"
        v-for="nf in notAllowedFiles"
        :key="nf.size"
      >
        <p class="col-xs-3 textOverflow">
          <span class="text-primary">{{ nf.fileName }}</span>
        </p>
        <p class="col-xs-3 padMarg sizeC">
          <strong>({{ nf.fileSize }}) MB</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
        <p class="col-xs-3 padMarg sizeC">
          <strong>{{ nf.errorMsg }}</strong
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {
      divId: "",
      allowedFiles: [],
      notAllowedFiles: [],
    };
  },
  props: {
    config: {},
    multiple: false,
  },
  created() {
    this.loadData();
    this.divId = this.generateDynamicString(8);
  },
  methods: {
    removeRecord(index: any) {
      this.allowedFiles.splice(index, 1);
      this.$emit("filesEmitter", {
        validFiles: this.allowedFiles,
        invalidFiles: this.notAllowedFiles,
      });
    },
    triggerFilesControl() {
      const element = document.getElementById(this.divId);
      if (element) {
        element.click();
      }
    },
    generateDynamicString(length: number) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    loadData() {
      return "test";
    },
    resetFileUpload() {
      this.allowedFiles = [];
      this.notAllowedFiles = [];
      this.$emit("filesEmitter", {
        validFiles: this.allowedFiles,
        invalidFiles: this.notAllowedFiles,
      });
    },

    convertSize(fileSize: number): string {
      //   return fileSize < 1024000
      //     ? (fileSize / 1024).toFixed(2) + " KB"
      //     : (fileSize / 1024000).toFixed(2) + " MB";
      return (fileSize / 1024000).toFixed(2);
    },

    // When user selects files.
    onChange(event: any) {
      this.notAllowedFiles = [];
      let fileList: FileList;
      this.allowedFiles = [];
      this.Caption = [];

      if (event.type === "drop") {
        fileList = event.dataTransfer.files;
      } else {
        fileList = event.target.files || event.srcElement.files;
      }

      for (let i = 0; i < fileList.length; i++) {
        // const currentFileExt = fileExtRegExp.exec(fileList[i].name)[1].toLowerCase(); // Get file extension.
        const currentFileName = fileList[i].name.split(".");
        let currentFileExt = "";
        if (currentFileName && currentFileName.length > 0) {
          currentFileExt = currentFileName[currentFileName.length - 1];
        }
        const isFormatValid = this.config.formatsAllowed.includes(
          currentFileExt
        );
        const fSize = this.convertSize(fileList[i].size);
        const isSizeValid = fSize <= this.config.maxSize;

        // Check whether current file format and size is correct as specified in the configurations.
        if (isFormatValid && isSizeValid) {
          this.allowedFiles.push(fileList[i]);
        } else {
          this.notAllowedFiles.push({
            fileName: fileList[i].name,
            fileSize: this.convertSize(fileList[i].size),
            errorMsg: !isFormatValid ? "Invalid format" : "Invalid size",
          });
        }
      }

      // If there's any allowedFiles.
      if (this.allowedFiles.length > 0) {
        this.enableUploadBtn = true;
      } else {
        this.enableUploadBtn = false;
      }

      this.$emit("filesEmitter", {
        validFiles: this.allowedFiles,
        invalidFiles: this.notAllowedFiles,
      });
    },
    createFormData() {
      const formData = new FormData();
      for (let i = 0; i < this.allowedFiles.length; i++) {
        formData.append("files", this.allowedFiles[i]);
      }
      return formData;
    },
    fileUpload() {
      const formData = this.createFormData();
      fetch(this.config.uploadConfig.url, {
        method: this.config.uploadConfig.method,
        body: formData,
        headers: {
          "Content-Type": "application/json",
          Bearer: this.config.uploadConfig.userRef,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.$emit("fileUploadEmitter", { succes: result });
        })
        .catch((error) => {
          this.$emit("fileUploadEmitter", { error: error });
        });
    },
  },
})
export default class FileUploader extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.ashish-google-maps {
  position: inherit !important;
}
</style>
