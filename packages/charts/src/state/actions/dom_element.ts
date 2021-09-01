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

import { $Values } from 'utility-types';

/** @internal */
export const ON_DOM_ELEMENT_ENTER = 'ON_DOM_ELEMENT_ENTER';
/** @internal */
export const ON_DOM_ELEMENT_LEAVE = 'ON_DOM_ELEMENT_LEAVE';
/** @internal */
export const ON_DOM_ELEMENT_CLICK = 'ON_DOM_ELEMENT_CLICK';

/** @internal */
export const DOMElementType = Object.freeze({
  LineAnnotationMarker: 'LineAnnotationMarker' as const,
});
/** @internal */
export type DOMElementType = $Values<typeof DOMElementType>;

/** @internal */
export interface DOMElement {
  type: DOMElementType;
  id: string;
  createdBySpecId: string; // TODO is that + datum enough to identify the elements?
  datum: unknown;
}
interface DOMElementEnterAction {
  type: typeof ON_DOM_ELEMENT_ENTER;
  element: DOMElement;
}

interface DOMElementLeaveAction {
  type: typeof ON_DOM_ELEMENT_LEAVE;
}

interface DOMElementClickAction {
  type: typeof ON_DOM_ELEMENT_CLICK;
}

/** @internal */
export function onDOMElementLeave(): DOMElementLeaveAction {
  return { type: ON_DOM_ELEMENT_LEAVE };
}

/** @internal */
export function onDOMElementEnter(element: DOMElement): DOMElementEnterAction {
  return { type: ON_DOM_ELEMENT_ENTER, element };
}

/** @internal */
export function onDOMElementClick(): DOMElementClickAction {
  return { type: ON_DOM_ELEMENT_CLICK };
}

/** @internal */
export type DOMElementActions = DOMElementEnterAction | DOMElementLeaveAction;
