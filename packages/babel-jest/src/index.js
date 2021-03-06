/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import type {Config, Path} from 'types/Config';
import type {PreprocessorOptions} from 'types/Preprocessor';

const babel = require('babel-core');
const jestPreset = require('babel-preset-jest');

const createTransformer = (options: any) => {
  options = Object.assign({}, options, {
    auxiliaryCommentBefore: ' istanbul ignore next ',
    presets: ((options && options.presets) || []).concat([jestPreset]),
    retainLines: true,
  });
  delete options.cacheDirectory;

  return {
    INSTRUMENTS: true,
    process(
      src: string,
      filename: Path,
      config: Config,
      preprocessorOptions: PreprocessorOptions,
    ): string {
      let plugins = options.plugins || [];

      if (preprocessorOptions.instrument) {
        plugins = plugins.concat(require('babel-plugin-istanbul').default);
      }

      if (babel.util.canCompile(filename)) {
        return babel.transform(
          src,
          Object.assign({}, options, {filename, plugins}),
        ).code;
      }
      return src;
    },
  };
};

module.exports = createTransformer();
(module.exports: any).createTransformer = createTransformer;
