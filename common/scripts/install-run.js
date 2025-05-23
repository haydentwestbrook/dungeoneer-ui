// THIS FILE WAS GENERATED BY A TOOL. ANY MANUAL MODIFICATIONS WILL GET OVERWRITTEN WHENEVER RUSH IS UPGRADED.
//
// This script is intended for usage in an automated build environment where a Node tool may not have
// been preinstalled, or may have an unpredictable version.  This script will automatically install the specified
// version of the specified tool (if not already installed), and then pass a command-line to it.
// An example usage would be:
//
//    node common/scripts/install-run.js qrcode@1.2.2 qrcode https://rushjs.io
//
// For more information, see: https://rushjs.io/pages/maintainer/setup_new_repo/
//
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See the @microsoft/rush package's LICENSE file for details.

/******/ (() => {
  // webpackBootstrap
  /******/ 'use strict';
  /******/ var __webpack_modules__ = {
    /***/ 832286:
      /*!************************************************!*\
  !*** ./lib-esnext/utilities/npmrcUtilities.js ***!
  \************************************************/
      /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ isVariableSetInNpmrcFile: () => /* binding */ isVariableSetInNpmrcFile,
          /* harmony export */ syncNpmrc: () => /* binding */ syncNpmrc,
          /* harmony export */ trimNpmrcFileLines: () => /* binding */ trimNpmrcFileLines
          /* harmony export */
        });
        /* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ 179896);
        /* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default =
          /*#__PURE__*/ __webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ 16928);
        /* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default =
          /*#__PURE__*/ __webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
        // Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
        // See LICENSE in the project root for license information.
        // IMPORTANT - do not use any non-built-in libraries in this file

        /**
         * This function reads the content for given .npmrc file path, and also trims
         * unusable lines from the .npmrc file.
         *
         * @returns
         * The text of the the .npmrc.
         */
        // create a global _combinedNpmrc for cache purpose
        const _combinedNpmrcMap = new Map();
        function _trimNpmrcFile(options) {
          const { sourceNpmrcPath, linesToPrepend, linesToAppend, supportEnvVarFallbackSyntax } = options;
          const combinedNpmrcFromCache = _combinedNpmrcMap.get(sourceNpmrcPath);
          if (combinedNpmrcFromCache !== undefined) {
            return combinedNpmrcFromCache;
          }
          let npmrcFileLines = [];
          if (linesToPrepend) {
            npmrcFileLines.push(...linesToPrepend);
          }
          if (fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(sourceNpmrcPath)) {
            npmrcFileLines.push(
              ...fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(sourceNpmrcPath).toString().split('\n')
            );
          }
          if (linesToAppend) {
            npmrcFileLines.push(...linesToAppend);
          }
          npmrcFileLines = npmrcFileLines.map((line) => (line || '').trim());
          const resultLines = trimNpmrcFileLines(npmrcFileLines, process.env, supportEnvVarFallbackSyntax);
          const combinedNpmrc = resultLines.join('\n');
          //save the cache
          _combinedNpmrcMap.set(sourceNpmrcPath, combinedNpmrc);
          return combinedNpmrc;
        }
        /**
         *
         * @param npmrcFileLines The npmrc file's lines
         * @param env The environment variables object
         * @param supportEnvVarFallbackSyntax Whether to support fallback values in the form of `${VAR_NAME:-fallback}`
         * @returns
         */
        function trimNpmrcFileLines(npmrcFileLines, env, supportEnvVarFallbackSyntax) {
          var _a;
          const resultLines = [];
          // This finds environment variable tokens that look like "${VAR_NAME}"
          const expansionRegExp = /\$\{([^\}]+)\}/g;
          // Comment lines start with "#" or ";"
          const commentRegExp = /^\s*[#;]/;
          // Trim out lines that reference environment variables that aren't defined
          for (let line of npmrcFileLines) {
            let lineShouldBeTrimmed = false;
            //remove spaces before or after key and value
            line = line
              .split('=')
              .map((lineToTrim) => lineToTrim.trim())
              .join('=');
            // Ignore comment lines
            if (!commentRegExp.test(line)) {
              const environmentVariables = line.match(expansionRegExp);
              if (environmentVariables) {
                for (const token of environmentVariables) {
                  /**
                   * Remove the leading "${" and the trailing "}" from the token
                   *
                   * ${nameString}                  -> nameString
                   * ${nameString-fallbackString}   -> name-fallbackString
                   * ${nameString:-fallbackString}  -> name:-fallbackString
                   */
                  const nameWithFallback = token.substring(2, token.length - 1);
                  let environmentVariableName;
                  let fallback;
                  if (supportEnvVarFallbackSyntax) {
                    /**
                     * Get the environment variable name and fallback value.
                     *
                     *                                name          fallback
                     * nameString                 ->  nameString    undefined
                     * nameString-fallbackString  ->  nameString    fallbackString
                     * nameString:-fallbackString ->  nameString    fallbackString
                     */
                    const matched = nameWithFallback.match(/^([^:-]+)(?:\:?-(.+))?$/);
                    // matched: [originStr, variableName, fallback]
                    environmentVariableName =
                      (_a = matched === null || matched === void 0 ? void 0 : matched[1]) !== null &&
                      _a !== void 0
                        ? _a
                        : nameWithFallback;
                    fallback = matched === null || matched === void 0 ? void 0 : matched[2];
                  } else {
                    environmentVariableName = nameWithFallback;
                  }
                  // Is the environment variable and fallback value defined.
                  if (!env[environmentVariableName] && !fallback) {
                    // No, so trim this line
                    lineShouldBeTrimmed = true;
                    break;
                  }
                }
              }
            }
            if (lineShouldBeTrimmed) {
              // Example output:
              // "; MISSING ENVIRONMENT VARIABLE: //my-registry.com/npm/:_authToken=${MY_AUTH_TOKEN}"
              resultLines.push('; MISSING ENVIRONMENT VARIABLE: ' + line);
            } else {
              resultLines.push(line);
            }
          }
          return resultLines;
        }
        function _copyAndTrimNpmrcFile(options) {
          const { logger, sourceNpmrcPath, targetNpmrcPath } = options;
          logger.info(`Transforming ${sourceNpmrcPath}`); // Verbose
          logger.info(`  --> "${targetNpmrcPath}"`);
          const combinedNpmrc = _trimNpmrcFile(options);
          fs__WEBPACK_IMPORTED_MODULE_0__.writeFileSync(targetNpmrcPath, combinedNpmrc);
          return combinedNpmrc;
        }
        function syncNpmrc(options) {
          const {
            sourceNpmrcFolder,
            targetNpmrcFolder,
            useNpmrcPublish,
            logger = {
              // eslint-disable-next-line no-console
              info: console.log,
              // eslint-disable-next-line no-console
              error: console.error
            },
            createIfMissing = false
          } = options;
          const sourceNpmrcPath = path__WEBPACK_IMPORTED_MODULE_1__.join(
            sourceNpmrcFolder,
            !useNpmrcPublish ? '.npmrc' : '.npmrc-publish'
          );
          const targetNpmrcPath = path__WEBPACK_IMPORTED_MODULE_1__.join(targetNpmrcFolder, '.npmrc');
          try {
            if (fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(sourceNpmrcPath) || createIfMissing) {
              // Ensure the target folder exists
              if (!fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(targetNpmrcFolder)) {
                fs__WEBPACK_IMPORTED_MODULE_0__.mkdirSync(targetNpmrcFolder, { recursive: true });
              }
              return _copyAndTrimNpmrcFile(
                Object.assign({ sourceNpmrcPath, targetNpmrcPath, logger }, options)
              );
            } else if (fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(targetNpmrcPath)) {
              // If the source .npmrc doesn't exist and there is one in the target, delete the one in the target
              logger.info(`Deleting ${targetNpmrcPath}`); // Verbose
              fs__WEBPACK_IMPORTED_MODULE_0__.unlinkSync(targetNpmrcPath);
            }
          } catch (e) {
            throw new Error(`Error syncing .npmrc file: ${e}`);
          }
        }
        function isVariableSetInNpmrcFile(sourceNpmrcFolder, variableKey, supportEnvVarFallbackSyntax) {
          const sourceNpmrcPath = `${sourceNpmrcFolder}/.npmrc`;
          //if .npmrc file does not exist, return false directly
          if (!fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(sourceNpmrcPath)) {
            return false;
          }
          const trimmedNpmrcFile = _trimNpmrcFile({ sourceNpmrcPath, supportEnvVarFallbackSyntax });
          const variableKeyRegExp = new RegExp(`^${variableKey}=`, 'm');
          return trimmedNpmrcFile.match(variableKeyRegExp) !== null;
        }
        //# sourceMappingURL=npmrcUtilities.js.map

        /***/
      },

    /***/ 535317:
      /*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
      /***/ (module) => {
        module.exports = require('child_process');

        /***/
      },

    /***/ 179896:
      /*!*********************!*\
  !*** external "fs" ***!
  \*********************/
      /***/ (module) => {
        module.exports = require('fs');

        /***/
      },

    /***/ 370857:
      /*!*********************!*\
  !*** external "os" ***!
  \*********************/
      /***/ (module) => {
        module.exports = require('os');

        /***/
      },

    /***/ 16928:
      /*!***********************!*\
  !*** external "path" ***!
  \***********************/
      /***/ (module) => {
        module.exports = require('path');

        /***/
      }

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {}
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat get default export */
  /******/ (() => {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = (module) => {
      /******/ var getter =
        module && module.__esModule ? /******/ () => module['default'] : /******/ () => module;
      /******/ __webpack_require__.d(getter, { a: getter });
      /******/ return getter;
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!*******************************************!*\
  !*** ./lib-esnext/scripts/install-run.js ***!
  \*******************************************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ RUSH_JSON_FILENAME: () => /* binding */ RUSH_JSON_FILENAME,
      /* harmony export */ findRushJsonFolder: () => /* binding */ findRushJsonFolder,
      /* harmony export */ getNpmPath: () => /* binding */ getNpmPath,
      /* harmony export */ installAndRun: () => /* binding */ installAndRun,
      /* harmony export */ runWithErrorAndStatusCode: () => /* binding */ runWithErrorAndStatusCode
      /* harmony export */
    });
    /* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! child_process */ 535317
    );
    /* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default =
      /*#__PURE__*/ __webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);
    /* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ 179896);
    /* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
      fs__WEBPACK_IMPORTED_MODULE_1__
    );
    /* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! os */ 370857);
    /* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
      os__WEBPACK_IMPORTED_MODULE_2__
    );
    /* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ 16928);
    /* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
      path__WEBPACK_IMPORTED_MODULE_3__
    );
    /* harmony import */ var _utilities_npmrcUtilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ../utilities/npmrcUtilities */ 832286
    );
    // Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
    // See LICENSE in the project root for license information.
    /* eslint-disable no-console */

    const RUSH_JSON_FILENAME = 'rush.json';
    const RUSH_TEMP_FOLDER_ENV_VARIABLE_NAME = 'RUSH_TEMP_FOLDER';
    const INSTALL_RUN_LOCKFILE_PATH_VARIABLE = 'INSTALL_RUN_LOCKFILE_PATH';
    const INSTALLED_FLAG_FILENAME = 'installed.flag';
    const NODE_MODULES_FOLDER_NAME = 'node_modules';
    const PACKAGE_JSON_FILENAME = 'package.json';
    /**
     * Parse a package specifier (in the form of name\@version) into name and version parts.
     */
    function _parsePackageSpecifier(rawPackageSpecifier) {
      rawPackageSpecifier = (rawPackageSpecifier || '').trim();
      const separatorIndex = rawPackageSpecifier.lastIndexOf('@');
      let name;
      let version = undefined;
      if (separatorIndex === 0) {
        // The specifier starts with a scope and doesn't have a version specified
        name = rawPackageSpecifier;
      } else if (separatorIndex === -1) {
        // The specifier doesn't have a version
        name = rawPackageSpecifier;
      } else {
        name = rawPackageSpecifier.substring(0, separatorIndex);
        version = rawPackageSpecifier.substring(separatorIndex + 1);
      }
      if (!name) {
        throw new Error(`Invalid package specifier: ${rawPackageSpecifier}`);
      }
      return { name, version };
    }
    let _npmPath = undefined;
    /**
     * Get the absolute path to the npm executable
     */
    function getNpmPath() {
      if (!_npmPath) {
        try {
          if (_isWindows()) {
            // We're on Windows
            const whereOutput = child_process__WEBPACK_IMPORTED_MODULE_0__
              .execSync('where npm', { stdio: [] })
              .toString();
            const lines = whereOutput.split(os__WEBPACK_IMPORTED_MODULE_2__.EOL).filter((line) => !!line);
            // take the last result, we are looking for a .cmd command
            // see https://github.com/microsoft/rushstack/issues/759
            _npmPath = lines[lines.length - 1];
          } else {
            // We aren't on Windows - assume we're on *NIX or Darwin
            _npmPath = child_process__WEBPACK_IMPORTED_MODULE_0__
              .execSync('command -v npm', { stdio: [] })
              .toString();
          }
        } catch (e) {
          throw new Error(`Unable to determine the path to the NPM tool: ${e}`);
        }
        _npmPath = _npmPath.trim();
        if (!fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(_npmPath)) {
          throw new Error('The NPM executable does not exist');
        }
      }
      return _npmPath;
    }
    function _ensureFolder(folderPath) {
      if (!fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(folderPath)) {
        const parentDir = path__WEBPACK_IMPORTED_MODULE_3__.dirname(folderPath);
        _ensureFolder(parentDir);
        fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(folderPath);
      }
    }
    /**
     * Create missing directories under the specified base directory, and return the resolved directory.
     *
     * Does not support "." or ".." path segments.
     * Assumes the baseFolder exists.
     */
    function _ensureAndJoinPath(baseFolder, ...pathSegments) {
      let joinedPath = baseFolder;
      try {
        for (let pathSegment of pathSegments) {
          pathSegment = pathSegment.replace(/[\\\/]/g, '+');
          joinedPath = path__WEBPACK_IMPORTED_MODULE_3__.join(joinedPath, pathSegment);
          if (!fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(joinedPath)) {
            fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(joinedPath);
          }
        }
      } catch (e) {
        throw new Error(
          `Error building local installation folder (${path__WEBPACK_IMPORTED_MODULE_3__.join(baseFolder, ...pathSegments)}): ${e}`
        );
      }
      return joinedPath;
    }
    function _getRushTempFolder(rushCommonFolder) {
      const rushTempFolder = process.env[RUSH_TEMP_FOLDER_ENV_VARIABLE_NAME];
      if (rushTempFolder !== undefined) {
        _ensureFolder(rushTempFolder);
        return rushTempFolder;
      } else {
        return _ensureAndJoinPath(rushCommonFolder, 'temp');
      }
    }
    /**
     * Compare version strings according to semantic versioning.
     * Returns a positive integer if "a" is a later version than "b",
     * a negative integer if "b" is later than "a",
     * and 0 otherwise.
     */
    function _compareVersionStrings(a, b) {
      const aParts = a.split(/[.-]/);
      const bParts = b.split(/[.-]/);
      const numberOfParts = Math.max(aParts.length, bParts.length);
      for (let i = 0; i < numberOfParts; i++) {
        if (aParts[i] !== bParts[i]) {
          return (Number(aParts[i]) || 0) - (Number(bParts[i]) || 0);
        }
      }
      return 0;
    }
    /**
     * Resolve a package specifier to a static version
     */
    function _resolvePackageVersion(logger, rushCommonFolder, { name, version }) {
      if (!version) {
        version = '*'; // If no version is specified, use the latest version
      }
      if (version.match(/^[a-zA-Z0-9\-\+\.]+$/)) {
        // If the version contains only characters that we recognize to be used in static version specifiers,
        // pass the version through
        return version;
      } else {
        // version resolves to
        try {
          const rushTempFolder = _getRushTempFolder(rushCommonFolder);
          const sourceNpmrcFolder = path__WEBPACK_IMPORTED_MODULE_3__.join(
            rushCommonFolder,
            'config',
            'rush'
          );
          (0, _utilities_npmrcUtilities__WEBPACK_IMPORTED_MODULE_4__.syncNpmrc)({
            sourceNpmrcFolder,
            targetNpmrcFolder: rushTempFolder,
            logger,
            supportEnvVarFallbackSyntax: false
          });
          const npmPath = getNpmPath();
          // This returns something that looks like:
          // ```
          // [
          //   "3.0.0",
          //   "3.0.1",
          //   ...
          //   "3.0.20"
          // ]
          // ```
          //
          // if multiple versions match the selector, or
          //
          // ```
          // "3.0.0"
          // ```
          //
          // if only a single version matches.
          const spawnSyncOptions = {
            cwd: rushTempFolder,
            stdio: [],
            shell: _isWindows()
          };
          const platformNpmPath = _getPlatformPath(npmPath);
          const npmVersionSpawnResult = child_process__WEBPACK_IMPORTED_MODULE_0__.spawnSync(
            platformNpmPath,
            ['view', `${name}@${version}`, 'version', '--no-update-notifier', '--json'],
            spawnSyncOptions
          );
          if (npmVersionSpawnResult.status !== 0) {
            throw new Error(`"npm view" returned error code ${npmVersionSpawnResult.status}`);
          }
          const npmViewVersionOutput = npmVersionSpawnResult.stdout.toString();
          const parsedVersionOutput = JSON.parse(npmViewVersionOutput);
          const versions = Array.isArray(parsedVersionOutput) ? parsedVersionOutput : [parsedVersionOutput];
          let latestVersion = versions[0];
          for (let i = 1; i < versions.length; i++) {
            const latestVersionCandidate = versions[i];
            if (_compareVersionStrings(latestVersionCandidate, latestVersion) > 0) {
              latestVersion = latestVersionCandidate;
            }
          }
          if (!latestVersion) {
            throw new Error('No versions found for the specified version range.');
          }
          return latestVersion;
        } catch (e) {
          throw new Error(`Unable to resolve version ${version} of package ${name}: ${e}`);
        }
      }
    }
    let _rushJsonFolder;
    /**
     * Find the absolute path to the folder containing rush.json
     */
    function findRushJsonFolder() {
      if (!_rushJsonFolder) {
        let basePath = __dirname;
        let tempPath = __dirname;
        do {
          const testRushJsonPath = path__WEBPACK_IMPORTED_MODULE_3__.join(basePath, RUSH_JSON_FILENAME);
          if (fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(testRushJsonPath)) {
            _rushJsonFolder = basePath;
            break;
          } else {
            basePath = tempPath;
          }
        } while (basePath !== (tempPath = path__WEBPACK_IMPORTED_MODULE_3__.dirname(basePath))); // Exit the loop when we hit the disk root
        if (!_rushJsonFolder) {
          throw new Error(`Unable to find ${RUSH_JSON_FILENAME}.`);
        }
      }
      return _rushJsonFolder;
    }
    /**
     * Detects if the package in the specified directory is installed
     */
    function _isPackageAlreadyInstalled(packageInstallFolder) {
      try {
        const flagFilePath = path__WEBPACK_IMPORTED_MODULE_3__.join(
          packageInstallFolder,
          INSTALLED_FLAG_FILENAME
        );
        if (!fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(flagFilePath)) {
          return false;
        }
        const fileContents = fs__WEBPACK_IMPORTED_MODULE_1__.readFileSync(flagFilePath).toString();
        return fileContents.trim() === process.version;
      } catch (e) {
        return false;
      }
    }
    /**
     * Delete a file. Fail silently if it does not exist.
     */
    function _deleteFile(file) {
      try {
        fs__WEBPACK_IMPORTED_MODULE_1__.unlinkSync(file);
      } catch (err) {
        if (err.code !== 'ENOENT' && err.code !== 'ENOTDIR') {
          throw err;
        }
      }
    }
    /**
     * Removes the following files and directories under the specified folder path:
     *  - installed.flag
     *  -
     *  - node_modules
     */
    function _cleanInstallFolder(rushTempFolder, packageInstallFolder, lockFilePath) {
      try {
        const flagFile = path__WEBPACK_IMPORTED_MODULE_3__.resolve(
          packageInstallFolder,
          INSTALLED_FLAG_FILENAME
        );
        _deleteFile(flagFile);
        const packageLockFile = path__WEBPACK_IMPORTED_MODULE_3__.resolve(
          packageInstallFolder,
          'package-lock.json'
        );
        if (lockFilePath) {
          fs__WEBPACK_IMPORTED_MODULE_1__.copyFileSync(lockFilePath, packageLockFile);
        } else {
          // Not running `npm ci`, so need to cleanup
          _deleteFile(packageLockFile);
          const nodeModulesFolder = path__WEBPACK_IMPORTED_MODULE_3__.resolve(
            packageInstallFolder,
            NODE_MODULES_FOLDER_NAME
          );
          if (fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(nodeModulesFolder)) {
            const rushRecyclerFolder = _ensureAndJoinPath(rushTempFolder, 'rush-recycler');
            fs__WEBPACK_IMPORTED_MODULE_1__.renameSync(
              nodeModulesFolder,
              path__WEBPACK_IMPORTED_MODULE_3__.join(
                rushRecyclerFolder,
                `install-run-${Date.now().toString()}`
              )
            );
          }
        }
      } catch (e) {
        throw new Error(`Error cleaning the package install folder (${packageInstallFolder}): ${e}`);
      }
    }
    function _createPackageJson(packageInstallFolder, name, version) {
      try {
        const packageJsonContents = {
          name: 'ci-rush',
          version: '0.0.0',
          dependencies: {
            [name]: version
          },
          description: "DON'T WARN",
          repository: "DON'T WARN",
          license: 'MIT'
        };
        const packageJsonPath = path__WEBPACK_IMPORTED_MODULE_3__.join(
          packageInstallFolder,
          PACKAGE_JSON_FILENAME
        );
        fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(
          packageJsonPath,
          JSON.stringify(packageJsonContents, undefined, 2)
        );
      } catch (e) {
        throw new Error(`Unable to create package.json: ${e}`);
      }
    }
    /**
     * Run "npm install" in the package install folder.
     */
    function _installPackage(logger, packageInstallFolder, name, version, command) {
      try {
        logger.info(`Installing ${name}...`);
        const npmPath = getNpmPath();
        const platformNpmPath = _getPlatformPath(npmPath);
        const result = child_process__WEBPACK_IMPORTED_MODULE_0__.spawnSync(platformNpmPath, [command], {
          stdio: 'inherit',
          cwd: packageInstallFolder,
          env: process.env,
          shell: _isWindows()
        });
        if (result.status !== 0) {
          throw new Error(`"npm ${command}" encountered an error`);
        }
        logger.info(`Successfully installed ${name}@${version}`);
      } catch (e) {
        throw new Error(`Unable to install package: ${e}`);
      }
    }
    /**
     * Get the ".bin" path for the package.
     */
    function _getBinPath(packageInstallFolder, binName) {
      const binFolderPath = path__WEBPACK_IMPORTED_MODULE_3__.resolve(
        packageInstallFolder,
        NODE_MODULES_FOLDER_NAME,
        '.bin'
      );
      const resolvedBinName = _isWindows() ? `${binName}.cmd` : binName;
      return path__WEBPACK_IMPORTED_MODULE_3__.resolve(binFolderPath, resolvedBinName);
    }
    /**
     * Returns a cross-platform path - windows must enclose any path containing spaces within double quotes.
     */
    function _getPlatformPath(platformPath) {
      return _isWindows() && platformPath.includes(' ') ? `"${platformPath}"` : platformPath;
    }
    function _isWindows() {
      return os__WEBPACK_IMPORTED_MODULE_2__.platform() === 'win32';
    }
    /**
     * Write a flag file to the package's install directory, signifying that the install was successful.
     */
    function _writeFlagFile(packageInstallFolder) {
      try {
        const flagFilePath = path__WEBPACK_IMPORTED_MODULE_3__.join(
          packageInstallFolder,
          INSTALLED_FLAG_FILENAME
        );
        fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(flagFilePath, process.version);
      } catch (e) {
        throw new Error(`Unable to create installed.flag file in ${packageInstallFolder}`);
      }
    }
    function installAndRun(
      logger,
      packageName,
      packageVersion,
      packageBinName,
      packageBinArgs,
      lockFilePath = process.env[INSTALL_RUN_LOCKFILE_PATH_VARIABLE]
    ) {
      const rushJsonFolder = findRushJsonFolder();
      const rushCommonFolder = path__WEBPACK_IMPORTED_MODULE_3__.join(rushJsonFolder, 'common');
      const rushTempFolder = _getRushTempFolder(rushCommonFolder);
      const packageInstallFolder = _ensureAndJoinPath(
        rushTempFolder,
        'install-run',
        `${packageName}@${packageVersion}`
      );
      if (!_isPackageAlreadyInstalled(packageInstallFolder)) {
        // The package isn't already installed
        _cleanInstallFolder(rushTempFolder, packageInstallFolder, lockFilePath);
        const sourceNpmrcFolder = path__WEBPACK_IMPORTED_MODULE_3__.join(rushCommonFolder, 'config', 'rush');
        (0, _utilities_npmrcUtilities__WEBPACK_IMPORTED_MODULE_4__.syncNpmrc)({
          sourceNpmrcFolder,
          targetNpmrcFolder: packageInstallFolder,
          logger,
          supportEnvVarFallbackSyntax: false
        });
        _createPackageJson(packageInstallFolder, packageName, packageVersion);
        const command = lockFilePath ? 'ci' : 'install';
        _installPackage(logger, packageInstallFolder, packageName, packageVersion, command);
        _writeFlagFile(packageInstallFolder);
      }
      const statusMessage = `Invoking "${packageBinName} ${packageBinArgs.join(' ')}"`;
      const statusMessageLine = new Array(statusMessage.length + 1).join('-');
      logger.info('\n' + statusMessage + '\n' + statusMessageLine + '\n');
      const binPath = _getBinPath(packageInstallFolder, packageBinName);
      const binFolderPath = path__WEBPACK_IMPORTED_MODULE_3__.resolve(
        packageInstallFolder,
        NODE_MODULES_FOLDER_NAME,
        '.bin'
      );
      // Windows environment variables are case-insensitive.  Instead of using SpawnSyncOptions.env, we need to
      // assign via the process.env proxy to ensure that we append to the right PATH key.
      const originalEnvPath = process.env.PATH || '';
      let result;
      try {
        // `npm` bin stubs on Windows are `.cmd` files
        // Node.js will not directly invoke a `.cmd` file unless `shell` is set to `true`
        const platformBinPath = _getPlatformPath(binPath);
        process.env.PATH = [binFolderPath, originalEnvPath].join(path__WEBPACK_IMPORTED_MODULE_3__.delimiter);
        result = child_process__WEBPACK_IMPORTED_MODULE_0__.spawnSync(platformBinPath, packageBinArgs, {
          stdio: 'inherit',
          windowsVerbatimArguments: false,
          shell: _isWindows(),
          cwd: process.cwd(),
          env: process.env
        });
      } finally {
        process.env.PATH = originalEnvPath;
      }
      if (result.status !== null) {
        return result.status;
      } else {
        throw result.error || new Error('An unknown error occurred.');
      }
    }
    function runWithErrorAndStatusCode(logger, fn) {
      process.exitCode = 1;
      try {
        const exitCode = fn();
        process.exitCode = exitCode;
      } catch (e) {
        logger.error('\n\n' + e.toString() + '\n\n');
      }
    }
    function _run() {
      const [
        nodePath /* Ex: /bin/node */,
        scriptPath /* /repo/common/scripts/install-run-rush.js */,
        rawPackageSpecifier /* qrcode@^1.2.0 */,
        packageBinName /* qrcode */,
        ...packageBinArgs /* [-f, myproject/lib] */
      ] = process.argv;
      if (!nodePath) {
        throw new Error('Unexpected exception: could not detect node path');
      }
      if (path__WEBPACK_IMPORTED_MODULE_3__.basename(scriptPath).toLowerCase() !== 'install-run.js') {
        // If install-run.js wasn't directly invoked, don't execute the rest of this function. Return control
        // to the script that (presumably) imported this file
        return;
      }
      if (process.argv.length < 4) {
        console.log('Usage: install-run.js <package>@<version> <command> [args...]');
        console.log('Example: install-run.js qrcode@1.2.2 qrcode https://rushjs.io');
        process.exit(1);
      }
      const logger = { info: console.log, error: console.error };
      runWithErrorAndStatusCode(logger, () => {
        const rushJsonFolder = findRushJsonFolder();
        const rushCommonFolder = _ensureAndJoinPath(rushJsonFolder, 'common');
        const packageSpecifier = _parsePackageSpecifier(rawPackageSpecifier);
        const name = packageSpecifier.name;
        const version = _resolvePackageVersion(logger, rushCommonFolder, packageSpecifier);
        if (packageSpecifier.version !== version) {
          console.log(`Resolved to ${name}@${version}`);
        }
        return installAndRun(logger, name, version, packageBinName, packageBinArgs);
      });
    }
    _run();
    //# sourceMappingURL=install-run.js.map
  })();

  module.exports = __webpack_exports__;
  /******/
})();
//# sourceMappingURL=install-run.js.map
