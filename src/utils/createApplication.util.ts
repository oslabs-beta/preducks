import { format } from 'prettier/standalone.js';
import parserBabylon from 'prettier/parser-babylon.js';
import { createReduxFiles } from './createReduxFiles.util';
import { StoreConfigInterface, ReducersInterface } from './InterfaceDefinitions';

function createIndexHtml(path, appName, zip) {
  const filePath: string = 'index.html';
  const data: string = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>preducks app</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./build/bundle.js"></script>
  </body>
</html>
  `;
  zip.file(filePath, data);
}

export const createIndexTsx = (
  path: string,
  appName: string,
  hasRedux: boolean,
  hasAsync: boolean,
  zip: any,
): void => {
  const filePath = 'src/index.tsx';
  const reactText = `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './components/App';
    import "../styles.css";
    `;

  let reduxAndOrRemainingText;
  if (hasRedux) {
    if (hasAsync) {
      reduxAndOrRemainingText = `import { reducers } from './reducers';
        import { createStore, applyMiddleware } from 'redux';
        import { Provider } from 'react-redux';
        import thunk from 'redux-thunk';\n
        const store = createStore(reducers, applyMiddleware(thunk));\n
        ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));`;
    } else {
      reduxAndOrRemainingText = `import { reducers } from './reducers';
        import { createStore} from 'redux';
        import { Provider } from 'react-redux';\n
        const store = createStore(reducers);\n
        ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));`;
    }
  } else {
    reduxAndOrRemainingText = "ReactDOM.render(<App />, document.getElementById('root'));";
  }
  zip.file(
    filePath,
    format(reactText + reduxAndOrRemainingText, {
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      jsxBracketSameLine: true,
      parser: 'babel',
      plugins: [parserBabylon],
    }),
  );
};

const createPackage = (
  path: string,
  appName: string,
  hasRedux: boolean,
  hasAsync: boolean,
  zip: any,
) => {
  const filePath = 'package.json';
  const data = `
  {
    "name": "preducks",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "begin": "npm i && cross-env NODE_ENV=development webpack-dev-server --open",
      "start": "node server/server.js",
      "build": "cross-env NODE_ENV=production webpack",
      "dev": "cross-env NODE_ENV=development webpack-dev-server --open"
    },
    "nodemonConfig": {
      "ignore": [
        "build",
        "src"
      ]
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "dependencies": {
      "webpack": "^4.29.6",
      "@types/react": "^16.8.13",
      "@types/react-dom": "^16.8.4",
      "express": "^4.16.4",
      "react": "^16.8.6",
      "react-dom": "^16.8.6"
      ${
  hasRedux ? ',"react-redux": "^7.1.0","redux": "^4.0.1", "@types/react-redux": "^7.1.0"' : ''
}
      ${hasAsync ? ',"redux-thunk": "^2.3.0"' : ''}
    },
    "devDependencies": {
      "@babel/core": "^7.4.3",
      "@babel/preset-env": "^7.4.3",
      "@babel/preset-react": "^7.0.0",
      "@babel/preset-typescript": "^7.3.3",
      "babel-loader": "^8.0.5",
      "cross-env": "^5.2.0",
      "css-loader": "^2.1.1",
      "file-loader": "^3.0.1",
      "isomorphic-fetch": "^2.2.1",
      "node-sass": "^4.11.0",
      "nodemon": "^1.18.9",
      "postcss-loader": "^3.0.0",
      "sass-loader": "^7.1.0",
      "source-map-loader": "^0.2.4",
      "style-loader": "^0.23.1",
      "tslint": "^5.15.0",
      "tslint-config-prettier": "^1.18.0",
      "tslint-react": "^4.0.0",
      "typescript": "^3.4.3",
      "webpack": "^4.29.6",
      "webpack-cli": "^3.3.0",
      "webpack-dev-server": "^3.2.1"
    }
  }  
`;
  zip.file(filePath, data);
};

function createPreduckSVG(path, appName, zip) {
  const dir = path;
  const filePath: string = 'preduck.svg';
  const data: string = `<svg width="52" height="53" viewBox="0 0 52 53" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path d="M34.9406486 40c-.58593 0-1.0614673.4381061-1.0614673.9779154v8.1861299h-3.7151356c-.4755373 0-1.004148.2043843-1.133647.6268438-.129499.4214815.1857567 1.0131204.3630218 1.0131204-.0424587.1721131-.0350284.3559612.0307825.5339418v.0009779c.0074303.0195583.0148606.0381387.0233523.0567191.1029623.2298101.2897806.403879.5158731.5055822.0668725.0303154.1369293.0537854.2080476.069432.0838559.0195583.1698348.0293375.2568751.0293375.1082697 0 .2176008-.0156466.324809-.0469399.0222908-.0068454.0456431-.0146688.0679339-.0224921 1.9212558-.6835629 3.6801071-.0166246 3.6917832-.0127129.3279934.1320186.7069373.1026811 1.006271-.0772553.2993338-.1799364.4808447-.4889577.4808447-.8185152V40.9788933C36.0021159 40.4381061 35.5265785 40 34.9406486 40zM23.9406486 40c-.58593 0-1.0614673.4381061-1.0614673.9779154v8.1861299h-3.7151356c-.4755373 0-1.004148.2043843-1.133647.6268438-.129499.4214815.1857567 1.0131204.3630218 1.0131204-.0424587.1721131-.0350284.3559612.0307825.5339418v.0009779c.0074303.0195583.0148606.0381387.0233523.0567191.1029623.2298101.2897806.403879.5158731.5055822.0668725.0303154.1369293.0537854.2080476.069432.0838559.0195583.1698348.0293375.2568751.0293375.1082697 0 .2176008-.0156466.324809-.0469399.0222908-.0068454.0456431-.0146688.0679339-.0224921 1.9212558-.6835629 3.6801071-.0166246 3.6917832-.0127129.3279934.1320186.7069373.1026811 1.006271-.0772553.2993338-.1799364.4808447-.4889577.4808447-.8185152V40.9788933C25.0021159 40.4381061 24.5265785 40 23.9406486 40z" fill="#000" fill-rule="nonzero"/>
    <path d="M10 19H4.01932933v.5130543S3.34243126 23.8135898 10 22.8627291" stroke="#000" stroke-width="1.8" fill="rgb(255, 255, 165)" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 20H1c0-3.4969112 1.95015259-4.314456 9-3.9024134" stroke="#000" stroke-width="1.8" fill="rgb(255, 255, 165)" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M51 27.8420227v-4.1818916c0-4.5160817-2.4121756-4.6415284-3.9500998-4.6415284h-9.0239521c-4.491018 0-4.1536926-5.0158613-4.1536926-5.0158613C33.8722555 7.37313357 28.5279441 2 21.9361277 2 15.3433134 2 10 7.37413714 10 14.0027414v16.994517c0 6.6296078 5.3443114 12.0027414 11.9361277 12.0027414h12.4730539C38.2025948 43.0010033 51 39.6761637 51 27.8420227z" stroke="rgb(255, 255, 165)" stroke-width="2" fill="rgb(255, 255, 165)"/>
    <path d="M33 25h9.987655s.5078641 5.5443126-4.9912882 5.7053388c0 0-1.1030807 2.8126539-4.2345707 2.2100112" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle fill="#000" fill-rule="nonzero" cx="16.5" cy="14.5" r="1.5"/>
  </g>
 </svg>`;
  zip.file(filePath, data);
}

function createStylesCss(path, appName, zip) {
  const dir = path;
  const filePath: string = 'styles.css';
  const data: string = `body {
    background: rgb(251, 180, 167);
  }
  
  #App {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  #title {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    margin: 40px 0px 80px 0px;
    font-size: 3em;
    text-align: center;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  #preduck {
    animation: spin 6s linear infinite;
    width: 30vw;
  }  
  `;
  zip.file(filePath, data);
}

const createWebpack = (path, appName, zip) => {
  const filePath = 'webpack.config.js';
  const data = `
  const status = process.env.NODE_ENV;
  const path = require('path');
  
  module.exports = {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    mode: status,
    devServer: {
      publicPath: '/build/'
    },
    module: {
      rules: [
        { test: /.tsx?$/, exclude: /node-modules/, loader: 'babel-loader' },
        {
          enforce: 'pre',
          test: /.js$/,
          exclude: /node-modules/,
          loader: 'source-map-loader'
        },
        {
          test: /.css$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    }
  };`;
  zip.file(filePath, data);
};

const createBabel = (path, appName, zip) => {
  const filePath = '.babelrc';
  const data = `
  {
    "presets": ["@babel/env", "@babel/react", "@babel/typescript"]
  }
  `;
  zip.file(filePath, data);
};

const createTsConfig = (path, appName, zip) => {
  const filePath = 'tsconfig.json';
  const data = `
  {
    "compilerOptions": {
      "outDir": "./dist/",
      "sourceMap": true,
      "noImplicitAny": false,
      "module": "commonjs",
      "target": "es6",
      "jsx": "react",
      "allowSyntheticDefaultImports": true
    },
    "include": ["./src/**/*"]
  }
  `;
  zip.file(filePath, data);
};

const createTsLint = (path, appName, zip) => {
  const filePath = 'tslint.json';
  const data = `
  {
    "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
    "tslint.autoFixOnSave": true,
    "linterOptions": {
      "exclude": ["config/**/*.js", "node_modules/**/*.ts"]
    },
    "rules": {
      "quotemark": [true, "single", "avoid-escape", "avoid-template", "jsx-double"],
      "jsx-boolean-value": false,
      "jsx-no-lambda": false,
      "jsx-no-multiline-js": false,
      "object-literal-sort-keys": false,
      "member-ordering": false,
      "no-console": false,
      "ordered-imports": false,
      "comment-format": false
    }
  }
  `;
  zip.file(filePath, data);
};

const createServer = (path, appName, zip) => {
  const filePath = 'server/server.js';
  const data = `
  const express = require('express');
  const path = require('path');
  const app = express();

  app.get('/testDev', (req, res) => {
    res.send({ dev: 'testDev endpoint hit' });
  });

  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });

  app.listen(8080, () => {
    console.log('listening on port 8080');
  }); //listens on port 8080 -> http://localhost:8080/
  `;
  zip.file(filePath, data);
};

async function createApplicationUtil({
  path,
  appName,
  genOption,
  storeConfig,
  zip,
}: {
path: string;
appName: string;
genOption: number;
storeConfig: StoreConfigInterface;
zip: any;
}) {
  if (genOption === 1) {
    const reducerNames = Object.keys(storeConfig.reducers);
    const hasRedux = reducerNames.length > 0;
    let hasAsync = false;
    reducerNames.forEach((reducerName) => {
      Object.keys(storeConfig.reducers[reducerName].actions).forEach((actionName) => {
        if (storeConfig.reducers[reducerName].actions[actionName].async) {
          hasAsync = true;
        }
      });
    });

    await createIndexHtml(path, appName, zip);
    await createStylesCss(path, appName, zip);
    await createPreduckSVG(path, appName, zip);
    await createReduxFiles(path, appName, storeConfig, zip);
    // all of the redux stuff goes here.
    await createIndexTsx(path, appName, hasRedux, hasAsync, zip);
    await createPackage(path, appName, hasRedux, hasAsync, zip);
    await createWebpack(path, appName, zip);
    await createBabel(path, appName, zip);
    await createTsConfig(path, appName, zip);
    await createTsLint(path, appName, zip);
    await createServer(path, appName, zip);
  }
}
export default createApplicationUtil;
