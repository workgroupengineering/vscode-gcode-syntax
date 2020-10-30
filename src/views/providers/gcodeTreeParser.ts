/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Range, TreeItemCollapsibleState } from 'vscode';
import { TreeIconType, TreeNode } from '../nodes/TreeNode';

export class GCodeTreeParser {

    private blocks: Array<TreeNode>;

    constructor( readonly text: string) {
    
        this.blocks = this.getBlocks(text);

    }

    getTree(): Array<TreeNode> {
        return this.blocks;
    }

    // Split Text into Blocks by newline or ;
    private getBlocks(text: string): Array<any> {

        const nodes:Array<any> = [];
        const lines = text.match(/.*(?:\r\n|\r|\n)/g) || [];

        for (let i = 0; i < lines.length; ++i) {
            
            const line = lines[i].trim();
            
            if (line.length === 0) {
                continue;
            }

            const result = this.parseLine(line, i);
            if (result.length !== 0) {
                nodes.push(result);
            }
        }
        
        return nodes;

    }

    // Parse Line for Blocks
    private parseLine(line: string, lnum:number): Array<TreeNode> {

        const blocks: Array<TreeNode> = [];
        let node: TreeNode;
        let x: number;
        const len = line.length;
        
        // Regexp to Pull key words
        // eslint-disable-next-line
        const re = /((GOTO)|(IF)|(EQ)|(NE)|(LT)|(GT)|(LE)|(GE)|(DO)|(WHILE)|(END)|(AND)|(OR)|(XOR)|(SIN)|(COS)|(TAN)|(ASIN)|(ACOS)|(ATAN)|(FIX)|(FUP)|(LN)|(ROUND)|(SQRT)|(FIX)|(FUP)|(ROUND)|(ABS))|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9\+\-\.]+)|(\*[0-9]+)|([#][0-9]+)|([#][\[].+[\]])/igm;
       
        // Strip Comments
        line = this.stripComments(line);

        // Get Words
        const words = line.match(re) || [];

        for (let i = 0; i < words.length; ++i) {
            const word = words[i];
            const letter = word[0].toUpperCase();
            const argument = word.slice(1);

            // G-Code
            if (letter === 'G') {

                switch(argument) {

                    // Rapid Motion
                    case '00':
                    case '0' : 
                       node = new TreeNode(
                            'Rapid', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G00] Rapid Motion';
                        node.setIcon(TreeIconType.RAPID);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // Linear / Cutting
                    case '01':
                    case '1' : 
                        node = new TreeNode(
                            'Cutting', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G01] Linear]';
                        node.setIcon(TreeIconType.CUTTING);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // CW Motion
                    case '02':
                    case '2' : 
                        node = new TreeNode(
                            'CW Cutting', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G02] CW Interpolation';
                        node.setIcon(TreeIconType.CWCUTTING);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // CCW Motion
                    case '03':
                    case '3' :
                        node = new TreeNode(
                            'CCW Cutting', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G03] CCW Interpolation';
                        node.setIcon(TreeIconType.CCWCUTTING);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;
                    
                    // Standard Work Offsets
                    case '54':
                    case '55':
                    case '56':
                    case '57':
                    case '58':
                    case '59':
                    case '110':
                    case '111':
                    case '112':
                    case '113':
                    case '114':
                    case '115':
                    case '116':
                    case '117':
                    case '118':
                    case '119':
                    case '120':
                    case '121':
                    case '122':
                    case '123':
                    case '124':
                    case '125':
                    case '126':
                    case '127':
                    case '128':
                    case '129':
                        node = new TreeNode(
                            'Work Offset' + ' (G' + argument + ')', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G' + argument + '] Work Offset';
                        node.setIcon(TreeIconType.WORKOFFSET);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;
                    
                    // Extended Work Offsets
                    case '154':
                        node = new TreeNode(
                            'Work Offset' + ' (G154 ' + words[i + 1] + ')',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G154 ' + words[i + 1] + '] Work Offset';
                        node.setIcon(TreeIconType.WORKOFFSET);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // Extended Work Offsets
                    case '54.1':
                        node = new TreeNode(
                            'Work Offset' + ' (G54.1 ' + words[i + 1] + ')',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G54.1 ' + words[i + 1] + '] Work Offset';
                        node.setIcon(TreeIconType.WORKOFFSET);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };
    
                        blocks.push(node);
                        break;
                    
                    // Okuma Work Offsets
                    case '15':
                        node = new TreeNode(
                            'Work Offset' + ' (G15 ' + words[i + 1] + ')',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G15 ' + words[i + 1] + '] Work Offset';
                        node.setIcon(TreeIconType.WORKOFFSET);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };
    
                        blocks.push(node);
                        break;
                    
                    // External Sub Program
                    case '65':
                        node = new TreeNode(
                            'Ext Subprogram', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G65] Ext Subprogram Call';
                        node.setIcon(TreeIconType.EXTSUBPROG);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    default: {
                        break;
                    }
                }

            } else if (letter === 'M') {

                switch(argument) {

                    // Spindle Clockwise
                    case '03':
                    case '3' :
                        if (i == 0) { x = 1; } else { x = -1; }
                        node = new TreeNode(
                            'Spindle On ' + words[i + x].substr(1) + 'RPM' + ' CW',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Spindle On Clockwise (' + words[i + x].substr(1) + 'RPM)';
                        node.setIcon(TreeIconType.SPINDLECW);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // Spindle CounterClockwise
                    case '04':
                    case '4':
                        if (i == 0) { x = 1; } else { x = -1; }
                        node = new TreeNode(
                            'Spindle On ' + words[i + x].substr(1) + 'RPM' + ' CCW',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Spindle On Counter Clockwise (' + words[i + x].substr(1) + 'RPM)';
                        node.setIcon(TreeIconType.SPINDLECCW);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;
                        
                    // Tool Change
                    case '06':
                    case '6' :
                        node = new TreeNode(
                            'Tool Change', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Tool Change';
                        node.setIcon(TreeIconType.TOOLCHANGE);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;
                    
                    
                    // Coolant On
                    case '08':
                    case '8' :
                        node = new TreeNode(
                            'Coolant On', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Coolant Turned On';
                        node.setIcon(TreeIconType.COOLANTON);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;

                    // Coolant Off
                    case '09':
                    case '9' : 
                        node = new TreeNode(
                            'Coolant Off', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Coolant Turned Off';
                        node.setIcon(TreeIconType.COOLANTOFF);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;
                    
                    // Local Subprogram
                    case '97':
                        node = new TreeNode(
                            'Local Sub Call', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Local Subprogram Call';
                        node.setIcon(TreeIconType.LOCALSUB);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;

                    // Local Subprogram
                    case '99':
                        node = new TreeNode(
                            'Local Sub Return', 
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Local Subprogram Return';
                        node.setIcon(TreeIconType.SUBPROGRET);
                        node.command = {
                            command: 'gcode.gcodeTree.Selection',
                            title: "",
                            arguments: [new Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;

                    default:
                        break;
                }
            }
        }

        return blocks;

        
    }

    // Comments
    private stripComments(line: string): string {
        // eslint-disable-next-line
        const re1 = new RegExp(/\s*\([^\)]*\)/g);   // Remove anything inside the parentheses
        const re2 = new RegExp(/\s*;.*/g);          // Remove anything after a semi-colon to the end of the line, including preceding spaces
        const re3 = new RegExp(/\s+/g);
        
        return (line.replace(re1, '').replace(re2, '').replace(re3, ''));
    }




}