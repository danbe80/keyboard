const path = require("path");
// js 압축 plugin
const TerserPlugin = require("terser-webpack-plugin");
// html 관련 plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
// css 관련 plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css 압축 plugin
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js", // JS 진입점
  output: {
    // 빌드 했을 때 번들 파일 관련 속성
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"), //번들 파일 생성 경로
    clean: true, // 번들 파일 생성할 경로에 다른 파일이 있다면 삭제하는 속성 그 후 번들 파일 생성
  },
  devtool: "source-map", // 빌드한 파일과 원본 파일을 연결
  mode: "development", // default로 production과 development가 있다.
  devServer: {
    host: "localhost",
    port: 8080,
    open: true, // 브라우저 새창을 열어라
    watchFiles: "index.html", // html 변화를 감지한다.
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "keyboard", // 브라우저 탭 제목
      template: "./index.html", // 빌드 시 템플릿은 index.html을 사용한다. lodash문법을 사용할 수 있게 해줌
      inject: "body", // 파일 번들했을 때(빌드했을 때) js를 body 부분에 넣어준다. 설정하지 않을시 head 부분으로 들어감
      favicon: "./favicon.ico",
    }),
    // html에 css를 inject 해주기 위한 플러그인
    new MiniCssExtractPlugin({ filename: "style.css" }),
  ],
  module: {
    rules: [
      {
        // css 파일을 loader를 사용해 읽어들이겠다는 의미
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};

/* 
중요 포인트
경로에 상대경로를 넣어주면 웹팩이 찾아줄 수 없기 때문에 Path 모듈을 사용하므로써
절대 경로를 사용해 웹팩이 경로를 찾을 수 있게 해줌.

lodash 문법이란?
util 성 method나 template 관련 method들을 제공해주는 라이브러리


*/
