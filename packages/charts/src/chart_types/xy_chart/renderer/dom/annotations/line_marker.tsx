/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { createPopper, Instance } from '@popperjs/core';
import React, { RefObject, useRef, useEffect, useCallback } from 'react';

import { DEFAULT_CSS_CURSOR } from '../../../../../common/constants';
import { AnnotationClickListener } from '../../../../../specs';
import {
  DOMElementType,
  onDOMElementEnter as onDOMElementEnterAction,
  onDOMElementLeave as onDOMElementLeaveAction,
  onDOMElementClick as onDOMElementClickAction,
} from '../../../../../state/actions/dom_element';
import { Position, renderWithProps } from '../../../../../utils/common';
import { Dimensions } from '../../../../../utils/dimensions';
import { AnnotationLineProps } from '../../../annotations/line/types';

type LineMarkerProps = Pick<AnnotationLineProps, 'id' | 'specId' | 'datum' | 'markers' | 'panel'> & {
  chartAreaRef: RefObject<HTMLCanvasElement>;
  chartDimensions: Dimensions;
  onDOMElementEnter: typeof onDOMElementEnterAction;
  onDOMElementLeave: typeof onDOMElementLeaveAction;
  onDOMElementClick: typeof onDOMElementClickAction;
  annotationSpec?: AnnotationClickListener;
};

const MARKER_TRANSFORMS = {
  [Position.Right]: 'translate(0%, -50%)',
  [Position.Left]: 'translate(-100%, -50%)',
  [Position.Top]: 'translate(-50%, -100%)',
  [Position.Bottom]: 'translate(-50%, 0%)',
};

function getMarkerCentredTransform(alignment: Position, hasMarkerDimensions: boolean): string | undefined {
  return hasMarkerDimensions ? undefined : MARKER_TRANSFORMS[alignment];
}

/**
 * LineMarker component used to display line annotation markers
 * @internal
 */
export function LineMarker({
  id,
  specId,
  datum,
  panel,
  markers: [{ icon, body, color, position, alignment, dimension }],
  chartAreaRef,
  chartDimensions,
  onDOMElementEnter,
  onDOMElementLeave,
  onDOMElementClick,
  annotationSpec,
}: LineMarkerProps) {
  const iconRef = useRef<HTMLDivElement | null>(null);
  const testRef = useRef<HTMLDivElement | null>(null);
  const popper = useRef<Instance | null>(null);
  const style = {
    color,
    top: chartDimensions.top + position.top + panel.top,
    left: chartDimensions.left + position.left + panel.left,
    cursor: annotationSpec ? 'pointer' : DEFAULT_CSS_CURSOR,
  };
  const transform = { transform: getMarkerCentredTransform(alignment, Boolean(dimension)) };

  const setPopper = useCallback(() => {
    if (!iconRef.current || !testRef.current) return;

    popper.current = createPopper(iconRef.current, testRef.current, {
      strategy: 'absolute',
      placement: alignment,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: chartAreaRef.current,
          },
        },
        {
          name: 'flip',
          options: {
            // prevents default flip modifier
            fallbackPlacements: [],
          },
        },
      ],
    });
  }, [chartAreaRef, alignment]);

  useEffect(() => {
    if (!popper.current && body) {
      setPopper();
    }

    return () => {
      popper?.current?.destroy?.();
      popper.current = null;
    };
  }, [setPopper, body]);

  void popper?.current?.update?.();
  // want it to be tabbable if interactive if there is a click handler
  return onDOMElementClick ? (
    <button
      className="echAnnotation"
      key={`annotation-${id}`}
      onMouseEnter={() => {
        onDOMElementEnter({
          createdBySpecId: specId,
          id,
          type: DOMElementType.LineAnnotationMarker,
          datum,
        });
      }}
      onMouseLeave={onDOMElementLeave}
      onClick={onDOMElementClick}
      style={{ ...style, ...transform }}
      type="button"
    >
      <div ref={iconRef} className="echAnnotation__icon">
        {renderWithProps(icon, datum)}
      </div>
      {body && (
        <div ref={testRef} className="echAnnotation__body">
          {renderWithProps(body, datum)}
        </div>
      )}
    </button>
  ) : (
    <div
      className="echAnnotation"
      key={`annotation-${id}`}
      onMouseEnter={() => {
        onDOMElementEnter({
          createdBySpecId: specId,
          id,
          type: DOMElementType.LineAnnotationMarker,
          datum,
        });
      }}
      onMouseLeave={onDOMElementLeave}
      style={{ ...style, ...transform }}
    >
      <div ref={iconRef} className="echAnnotation__icon">
        {renderWithProps(icon, datum)}
      </div>
      {body && (
        <div ref={testRef} className="echAnnotation__body">
          {renderWithProps(body, datum)}
        </div>
      )}
    </div>
  );
}
