﻿/*!
    Tridion Code Mirror Extension

    Copyright (C) 2012 Robert Stevenson-Leggett

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Version: 0.1
    Author: Robert Stevenson-Leggett
*/

Type.registerNamespace("Rob.Prototype.CodemirrorExtensions");

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror = function Rob$Prototype$CodemirrorExtensions$EnableCodemirror() {
    console.log('ctor');
    Type.enableInterface(this, "Rob.Prototype.CodemirrorExtensions.EnableCodeMirror");
    this.addInterface("Tridion.Cme.Command", ["EnableCodeMirror"]);
    this.HasExecuted = false;
    this.CodeArea = null;

    CodeMirror.defineMode("dreamweaver", function (config, parserConfig) {
        var dreamweaverOverlay = {
            token: function (stream, state) {
                var ch;
                if (stream.match("@@")) {
                    while ((ch = stream.next()) != null)
                        if (ch == "@" && stream.next() == "@") break;
                    return "dreamweaver";
                }
                while (stream.next() != null && !stream.match("@@", false)) { }
                return null;
            }
        };
        return CodeMirror.overlayParser(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), dreamweaverOverlay);
    });
};

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror.prototype._isAvailable = function EnableCodeMirror$_isAvailable(selection) {
    console.log('available');
    return true;
};

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror.prototype._isEnabled = function EnableCodeMirror$_isEnabled(selection) {
    
    if (this.CodeArea) {
        var sourceTab = new Tridion.Cme.SourceTab($('#SourceTab'));
        var currentType = sourceTab.properties.controls.TemplateTypes.properties.selectedValue;
        var mode = currentType == "RazorTemplate" ? "razor" : "dreamweaver";
        this.CodeArea.setOption("mode", mode);
        console.log("changed mode to " + mode);
    }

    return true;
};

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror.prototype._execute = function EnableCodeMirror$_execute(selection) {

    if ($('#MasterTabControl .selected').id !== 'SourceTab_switch') {
        //TODO: How to make this work with the above methods..
        alert('Please switch to the Source tab to use Code Mirror features!');
        return;
    }

    if (this.HasExecuted) {
        this.CodeArea.toTextArea();
        this.HasExecuted = false;
        this.CodeArea = null;
        $('.EnableCodeMirror .text').textContent = 'Enable Code Mirror';
        return;
    }
    
    var sourceTab = new Tridion.Cme.SourceTab($('#SourceTab'));
    var currentType = sourceTab.properties.controls.TemplateTypes.properties.selectedValue;
    var mode = currentType == "RazorTemplate" ? "razor" : "dreamweaver";

    var codeArea = document.getElementById("SourceArea");

    this.CodeArea = CodeMirror.fromTextArea(codeArea, {
        lineNumbers: true,
        mode: { name: mode, htmlMode: true },
        smartIndent: true,
        onChange: function (editor) {
            editor.save();
        }
    });

    $('.EnableCodeMirror .text').textContent  = 'Disable Code Mirror';
    this.HasExecuted = true;
};