/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export function stripComments(line: string): string {
    return line.replace(/\s*\(.*\)\s*$|^\s*;.*/g, '');
}
