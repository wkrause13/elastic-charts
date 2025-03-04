/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import {
  Chart,
  Datum,
  MODEL_KEY,
  PartialTheme,
  Partition,
  PartitionLayout,
  Settings,
  defaultPartitionValueFormatter,
} from '@elastic/charts';
import { ShapeTreeNode } from '@elastic/charts/src/chart_types/partition_chart/layout/types/viewmodel_types';
import { arrayToLookup, hueInterpolator } from '@elastic/charts/src/common/color_calcs';
import { mocks } from '@elastic/charts/src/mocks/hierarchical';
import { countryDimension, productDimension } from '@elastic/charts/src/mocks/hierarchical/dimension_codes';
import { palettes } from '@elastic/charts/src/mocks/hierarchical/palettes';

import { useBaseTheme } from '../../use_base_theme';

const productLookup = arrayToLookup((d: Datum) => d.sitc1, productDimension);
const countryLookup = arrayToLookup((d: Datum) => d.country, countryDimension);

const interpolatorTurbo = hueInterpolator(palettes.turbo.map(([r, g, b]) => [r, g, b, 0.7]));

const theme: PartialTheme = {
  chartMargins: { top: 0, left: 0, bottom: 0, right: 0 },
  partition: {
    minFontSize: 4,
    maxFontSize: 84,
    idealFontSizeJump: 1.05,
    outerSizeRatio: 1,
  },
};

export const Example = () => (
  <Chart>
    <Settings showLegend theme={theme} baseTheme={useBaseTheme()} />
    <Partition
      id="spec_1"
      data={mocks.sunburst}
      layout={PartitionLayout.treemap}
      valueAccessor={(d: Datum) => d.exportVal as number}
      valueFormatter={(d: number) => `$${defaultPartitionValueFormatter(Math.round(d / 1000000000))}\u00A0Bn`}
      layers={[
        {
          groupByRollup: (d: Datum) => d.sitc1,
          nodeLabel: (d: any) => productLookup[d].name.toUpperCase(),
          fillLabel: {
            valueFormatter: () => '',
            fontFamily: 'Helvetica',
            textColor: 'grey',
          },
          shape: {
            fillColor: 'rgba(0, 0, 0, 0)',
          },
        },
        {
          groupByRollup: (d: Datum) => d.dest,
          nodeLabel: (d: any) => countryLookup[d].name,
          fillLabel: {
            valueFormatter: (d: number) => `${defaultPartitionValueFormatter(Math.round(d / 1000000000))}\u00A0Bn`,
            textColor: 'black',
            fontWeight: 100,
            fontStyle: 'normal',
            fontFamily: 'Helvetica',
            fontVariant: 'normal',
            valueFont: {
              fontWeight: 100,
            },
          },
          shape: {
            fillColor: (d: ShapeTreeNode) =>
              // primarily, pick color based on parent's index, but then perturb by the index within the parent
              interpolatorTurbo(
                (d[MODEL_KEY].sortIndex + d.sortIndex / d[MODEL_KEY].children.length) /
                  (d[MODEL_KEY].parent.children.length + 1),
              ),
          },
        },
      ]}
    />
  </Chart>
);

Example.parameters = {
  background: { default: 'white' },
};
