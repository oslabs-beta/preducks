import { createReduxFiles } from './createReduxFiles.util';
import { StoreConfigInterface, ReducersInterface } from './Interfaces';
import {format} from 'prettier';
const fs = require('fs');

function createFolders(path, appName, hasRedux) {
  const dir = path;
  if (!fs.existsSync(`${dir}/${appName}`)) {
    fs.mkdirSync(`${dir}/${appName}`); // make folder for whole app
    fs.mkdirSync(`${dir}/${appName}/src`); // make src folder
    fs.mkdirSync(`${dir}/${appName}/server`); // make server folder
    fs.mkdirSync(`${dir}/${appName}/src/components`); // make components folder
    if (hasRedux) {
      fs.mkdirSync(`${dir}/${appName}/src/reducers`);
      fs.mkdirSync(`${dir}/${appName}/src/actions`);
    }
  }

  // if (!dir.match(/`${appName}`|\*$/)) {
  //   dir = `${dir}/${appName}`;
  //   if (!fs.existsSync(dir)) {
  //     fs.mkdirSync(dir);
  //     const dirSrc = `${dir}/src`;
  //     fs.mkdirSync(dirSrc);
  //     const dirServer = `${dir}/server`;
  //     fs.mkdirSync(dirServer);
  //     const dirComponent = `${dirSrc}/components`;
  //     fs.mkdirSync(dirComponent);
  //   }
  // }
}

function createIndexHtml(path, appName) {
  const dir = path;
  const filePath: string = `${dir}/${appName}/index.html`;
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
  fs.writeFileSync(filePath, data, (err) => {
    if (err) {
      console.log('index.html error:', err.message);
    } else {
      console.log('index.html written successfully');
    }
  });
}

export const createIndexTsx = (
  path: string,
  appName: string,
  hasRedux: boolean,
  hasAsync: boolean,
): void => {
  const filePath = `${path}/${appName}/src/index.tsx`;
  const reactText = `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './components/App';
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
  fs.writeFile(
    filePath,
    format(reactText + reduxAndOrRemainingText, {
      parser: 'typescript',
    }),
    (err) => {
      if (err) {
        console.log('index.tsx error:', err.message);
      } else {
        console.log('index.tsx written successfully');
      }
    },
  );
};

const createPackage = (path: string, appName: string, hasRedux: boolean, hasAsync: boolean) => {
  const filePath = `${path}/${appName}/package.json`;
  const data = `
    {
      "name": "preducks",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "begin": "npm i && cross-env NODE_ENV=development webpack-dev-server",
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
  hasRedux
    ? ',"react-redux": "^7.1.0","redux": "^4.0.1", "@types/react-redux": "^7.1.0"'
    : ''
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
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('package.json error:', err.message);
    } else {
      console.log('package.json written successfully');
    }
  });
};

const createWebpack = (path, appName) => {
  const filePath = `${path}/${appName}/webpack.config.js`;
  const data = `
var status = process.env.NODE_ENV; //taken from script so we don't have to flip mode when using development/production
var path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  mode: status,
  devServer: {
    publicPath: '/build/',
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by babel-loader
      { test: /.tsx?$/, exclude: /node-modules/, loader: 'babel-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /.js$/, exclude: /node-modules/, loader: 'source-map-loader' },
      {
        test: /.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
    ],
  },
};
  `;
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('webpack error:', err.message);
    } else {
      console.log('webpack written successfully');
    }
  });
};

const createBabel = (path, appName) => {
  const filePath = `${path}/${appName}/.babelrc`;
  const data = `
{
  "presets": ["@babel/env", "@babel/react", "@babel/typescript"]
}
`;
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('babelrc error:', err.message);
    } else {
      console.log('babelrc written successfully');
    }
  });
};

const createTsConfig = (path, appName) => {
  const filePath = `${path}/${appName}/tsconfig.json`;
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
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('TSConfig error:', err.message);
    } else {
      console.log('TSConfig written successfully');
    }
  });
};

const createTsLint = (path, appName) => {
  const filePath = `${path}/${appName}/tslint.json`;
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
    // "jsx-key": false,
  }
}
`;
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('TSLint error:', err.message);
    } else {
      console.log('TSLint written successfully');
    }
  });
};

const createServer = (path, appName) => {
  const filePath = `${path}/${appName}/server/server.js`;
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
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('server file error:', err.message);
    } else {
      console.log('server file written successfully');
    }
  });
};

async function createApplicationUtil({
  path,
  appName,
  genOption,
  storeConfig,
}: {
path: string;
appName: string;
genOption: number;
storeConfig: StoreConfigInterface;
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

    await createFolders(path, appName, hasRedux);
    await createIndexHtml(path, appName);
    await createReduxFiles(path, appName, storeConfig);
    // all of the redux stuff goes here.
    await createIndexTsx(path, appName, hasRedux, hasAsync);
    await createPackage(path, appName, hasRedux, hasAsync);
    await createWebpack(path, appName);
    await createBabel(path, appName);
    await createTsConfig(path, appName);
    await createTsLint(path, appName);
    await createServer(path, appName);
  }
}
export default createApplicationUtil;

// createApplicationUtil({ path: '/Users/jacobrichards/Desktop/', appName: 'yeet', genOption: 1 });
