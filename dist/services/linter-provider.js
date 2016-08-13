"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;
exports.registerIndie = registerIndie;

var _omni = require("../server/omni");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _omnisharpClient = require("omnisharp-client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Range = require("atom").Range;

function mapIndieValues(error) {
    var level = error.LogLevel.toLowerCase();
    return {
        type: level,
        text: error.Text + " [" + _omni.Omni.getFrameworks(error.Projects) + "] ",
        filePath: error.FileName,
        range: new Range([error.Line, error.Column], [error.EndLine, error.EndColumn])
    };
}
function showLinter() {
    _lodash2.default.each(document.querySelectorAll("linter-bottom-tab"), function (element) {
        return element.style.display = "";
    });
    _lodash2.default.each(document.querySelectorAll("linter-bottom-status"), function (element) {
        return element.style.display = "";
    });
    var panel = document.querySelector("linter-panel");
    if (panel) panel.style.display = "";
}
function hideLinter() {
    _lodash2.default.each(document.querySelectorAll("linter-bottom-tab"), function (element) {
        return element.style.display = "none";
    });
    _lodash2.default.each(document.querySelectorAll("linter-bottom-status"), function (element) {
        return element.style.display = "none";
    });
    var panel = document.querySelector("linter-panel");
    if (panel) panel.style.display = "none";
}
var showHiddenDiagnostics = true;
function init(linter) {
    var disposable = new _omnisharpClient.CompositeDisposable();
    var cd = void 0;
    disposable.add(atom.config.observe("omnisharp-atom.hideLinterInterface", function (hidden) {
        if (hidden) {
            cd = new _omnisharpClient.CompositeDisposable();
            disposable.add(cd);
            cd.add(_omni.Omni.activeEditor.filter(function (z) {
                return !z;
            }).subscribe(showLinter));
            cd.add(_omni.Omni.activeEditor.filter(function (z) {
                return !!z;
            }).subscribe(hideLinter));
        } else {
            if (cd) {
                disposable.remove(cd);
                cd.dispose();
            }
            showLinter();
        }
    }));
    disposable.add(atom.config.observe("omnisharp-atom.showHiddenDiagnostics", function (show) {
        showHiddenDiagnostics = show;
        atom.workspace.getTextEditors().forEach(function (editor) {
            var editorLinter = linter.getEditorLinter(editor);
            if (editorLinter) {
                editorLinter.lint(true);
            }
        });
    }));
    disposable.add(_omni.Omni.activeEditor.filter(function (z) {
        return !!z;
    }).take(1).delay(1000).subscribe(function (e) {
        _omni.Omni.whenEditorConnected(e).subscribe(function () {
            atom.workspace.getTextEditors().forEach(function (editor) {
                var editorLinter = linter.getEditorLinter(editor);
                if (editorLinter) {
                    editorLinter.lint(true);
                }
            });
        });
    }));
    return disposable;
}
function registerIndie(registry, disposable) {
    var linter = registry.register({ name: "c#" });
    disposable.add(linter, _omni.Omni.diagnostics.subscribe(function (diagnostics) {
        var messages = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = diagnostics[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                if (showHiddenDiagnostics || item.LogLevel !== "Hidden") {
                    messages.push(mapIndieValues(item));
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        linter.setMessages(messages);
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9saW50ZXItcHJvdmlkZXIudHMiLCJsaWIvc2VydmljZXMvbGludGVyLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBMERBLEksR0FBQSxJO1FBa0RBLGEsR0FBQSxhOztBQzVHQTs7QUFFQTs7OztBQUNBOzs7O0FEQUEsSUFBTSxRQUFRLFFBQVEsTUFBUixFQUFnQixLQUE5Qjs7QUEwQkEsU0FBQSxjQUFBLENBQXdCLEtBQXhCLEVBQXdEO0FBQ3BELFFBQU0sUUFBUSxNQUFNLFFBQU4sQ0FBZSxXQUFmLEVBQWQ7QUFFQSxXQUFPO0FBQ0gsY0FBTSxLQURIO0FBRUgsY0FBUyxNQUFNLElBQWYsVUFBd0IsV0FBSyxhQUFMLENBQW1CLE1BQU0sUUFBekIsQ0FBeEIsT0FGRztBQUdILGtCQUFVLE1BQU0sUUFIYjtBQUlILGVBQU8sSUFBSSxLQUFKLENBQVUsQ0FBQyxNQUFNLElBQVAsRUFBYSxNQUFNLE1BQW5CLENBQVYsRUFBc0MsQ0FBQyxNQUFNLE9BQVAsRUFBZ0IsTUFBTSxTQUF0QixDQUF0QztBQUpKLEtBQVA7QUFNSDtBQUVELFNBQUEsVUFBQSxHQUFBO0FBQ0kscUJBQUUsSUFBRixDQUFPLFNBQVMsZ0JBQVQsQ0FBMEIsbUJBQTFCLENBQVAsRUFBdUQsVUFBQyxPQUFEO0FBQUEsZUFBMEIsUUFBUSxLQUFSLENBQWMsT0FBZCxHQUF3QixFQUFsRDtBQUFBLEtBQXZEO0FBQ0EscUJBQUUsSUFBRixDQUFPLFNBQVMsZ0JBQVQsQ0FBMEIsc0JBQTFCLENBQVAsRUFBMEQsVUFBQyxPQUFEO0FBQUEsZUFBMEIsUUFBUSxLQUFSLENBQWMsT0FBZCxHQUF3QixFQUFsRDtBQUFBLEtBQTFEO0FBQ0EsUUFBTSxRQUFxQixTQUFTLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBM0I7QUFDQSxRQUFJLEtBQUosRUFDSSxNQUFNLEtBQU4sQ0FBWSxPQUFaLEdBQXNCLEVBQXRCO0FBQ1A7QUFFRCxTQUFBLFVBQUEsR0FBQTtB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QWlCLFdBQWpCLDhIQUE4QjtBQUFBLG9CQUFyQixJQUFxQjs7QUFDMUIsb0JBQUkseUJBQXlCLEtBQUssUUFBTCxLQUFrQixRQUEvQyxFQUF5RDtBQUNyRCw2QkFBUyxJQUFULENBQWMsZUFBZSxJQUFmLENBQWQ7QUFDSDtBQUNKO0FBTmlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBUWxCLGVBQU8sV0FBUCxDQUFtQixRQUFuQjtBQUNILEtBVkwsQ0FGSjtBQWNIIiwiZmlsZSI6ImxpYi9zZXJ2aWNlcy9saW50ZXItcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vZGVsc30gZnJvbSBcIm9tbmlzaGFycC1jbGllbnRcIjtcclxuaW1wb3J0IHtPbW5pfSBmcm9tIFwiLi4vc2VydmVyL29tbmlcIjtcclxuLyogdHNsaW50OmRpc2FibGU6dmFyaWFibGUtbmFtZSAqL1xyXG5jb25zdCBSYW5nZSA9IHJlcXVpcmUoXCJhdG9tXCIpLlJhbmdlO1xyXG4vKiB0c2xpbnQ6ZW5hYmxlOnZhcmlhYmxlLW5hbWUgKi9cclxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xyXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gXCJvbW5pc2hhcnAtY2xpZW50XCI7XHJcblxyXG5pbnRlcmZhY2UgTGludGVyTWVzc2FnZSB7XHJcbiAgICB0eXBlOiBzdHJpbmc7IC8vIFwiZXJyb3JcIiB8IFwid2FybmluZ1wiXHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG4gICAgaHRtbD86IHN0cmluZztcclxuICAgIGZpbGVQYXRoPzogc3RyaW5nO1xyXG4gICAgcmFuZ2U/OiBSYW5nZTtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEluZGllUmVnaXN0cnkge1xyXG4gICAgcmVnaXN0ZXIob3B0aW9uczogeyBuYW1lOiBzdHJpbmc7IH0pOiBJbmRpZTtcclxuICAgIGhhcyhpbmRpZTogYW55KTogQm9vbGVhbjtcclxuICAgIHVucmVnaXN0ZXIoaW5kaWU6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJbmRpZSB7XHJcbiAgICBzZXRNZXNzYWdlcyhtZXNzYWdlczogTGludGVyTWVzc2FnZVtdKTogdm9pZDtcclxuICAgIGRlbGV0ZU1lc3NhZ2VzKCk6IHZvaWQ7XHJcbiAgICBkaXNwb3NlKCk6IHZvaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcEluZGllVmFsdWVzKGVycm9yOiBNb2RlbHMuRGlhZ25vc3RpY0xvY2F0aW9uKTogTGludGVyTWVzc2FnZSB7XHJcbiAgICBjb25zdCBsZXZlbCA9IGVycm9yLkxvZ0xldmVsLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBsZXZlbCxcclxuICAgICAgICB0ZXh0OiBgJHtlcnJvci5UZXh0fSBbJHtPbW5pLmdldEZyYW1ld29ya3MoZXJyb3IuUHJvamVjdHMpfV0gYCxcclxuICAgICAgICBmaWxlUGF0aDogZXJyb3IuRmlsZU5hbWUsXHJcbiAgICAgICAgcmFuZ2U6IG5ldyBSYW5nZShbZXJyb3IuTGluZSwgZXJyb3IuQ29sdW1uXSwgW2Vycm9yLkVuZExpbmUsIGVycm9yLkVuZENvbHVtbl0pXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93TGludGVyKCkge1xyXG4gICAgXy5lYWNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaW50ZXItYm90dG9tLXRhYlwiKSwgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiKTtcclxuICAgIF8uZWFjaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibGludGVyLWJvdHRvbS1zdGF0dXNcIiksIChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJcIik7XHJcbiAgICBjb25zdCBwYW5lbCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGludGVyLXBhbmVsXCIpO1xyXG4gICAgaWYgKHBhbmVsKVxyXG4gICAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTGludGVyKCkge1xyXG4gICAgXy5lYWNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaW50ZXItYm90dG9tLXRhYlwiKSwgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIik7XHJcbiAgICBfLmVhY2goZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImxpbnRlci1ib3R0b20tc3RhdHVzXCIpLCAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKTtcclxuICAgIGNvbnN0IHBhbmVsID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsaW50ZXItcGFuZWxcIik7XHJcbiAgICBpZiAocGFuZWwpXHJcbiAgICAgICAgcGFuZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59XHJcblxyXG5sZXQgc2hvd0hpZGRlbkRpYWdub3N0aWNzID0gdHJ1ZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KGxpbnRlcjogeyBnZXRFZGl0b3JMaW50ZXI6IChlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikgPT4geyBsaW50OiAoc2hvdWxkTGludDogYm9vbGVhbikgPT4gdm9pZCB9IH0pIHtcclxuICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xyXG4gICAgbGV0IGNkOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xyXG4gICAgZGlzcG9zYWJsZS5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcIm9tbmlzaGFycC1hdG9tLmhpZGVMaW50ZXJJbnRlcmZhY2VcIiwgaGlkZGVuID0+IHtcclxuICAgICAgICBpZiAoaGlkZGVuKSB7XHJcbiAgICAgICAgICAgIGNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICAgICAgZGlzcG9zYWJsZS5hZGQoY2QpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2hvdyBsaW50ZXIgYnV0dG9uc1xyXG4gICAgICAgICAgICBjZC5hZGQoT21uaS5hY3RpdmVFZGl0b3JcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoeiA9PiAheilcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoc2hvd0xpbnRlcikpO1xyXG5cclxuICAgICAgICAgICAgLy8gaGlkZSBsaW50ZXIgYnV0dG9uc1xyXG4gICAgICAgICAgICBjZC5hZGQoT21uaS5hY3RpdmVFZGl0b3JcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoeiA9PiAhIXopXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGhpZGVMaW50ZXIpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY2QpIHtcclxuICAgICAgICAgICAgICAgIGRpc3Bvc2FibGUucmVtb3ZlKGNkKTtcclxuICAgICAgICAgICAgICAgIGNkLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaG93TGludGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG5cclxuICAgIGRpc3Bvc2FibGUuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXCJvbW5pc2hhcnAtYXRvbS5zaG93SGlkZGVuRGlhZ25vc3RpY3NcIiwgc2hvdyA9PiB7XHJcbiAgICAgICAgc2hvd0hpZGRlbkRpYWdub3N0aWNzID0gc2hvdztcclxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlZGl0b3JMaW50ZXIgPSBsaW50ZXIuZ2V0RWRpdG9yTGludGVyKGVkaXRvcik7XHJcbiAgICAgICAgICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRvckxpbnRlci5saW50KHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZGlzcG9zYWJsZS5hZGQoT21uaS5hY3RpdmVFZGl0b3IuZmlsdGVyKHogPT4gISF6KS50YWtlKDEpLmRlbGF5KDEwMDApLnN1YnNjcmliZSgoZSkgPT4ge1xyXG4gICAgICAgIE9tbmkud2hlbkVkaXRvckNvbm5lY3RlZChlKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWRpdG9yTGludGVyID0gbGludGVyLmdldEVkaXRvckxpbnRlcihlZGl0b3IpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvckxpbnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvckxpbnRlci5saW50KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pKTtcclxuXHJcbiAgICByZXR1cm4gZGlzcG9zYWJsZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVySW5kaWUocmVnaXN0cnk6IEluZGllUmVnaXN0cnksIGRpc3Bvc2FibGU6IENvbXBvc2l0ZURpc3Bvc2FibGUpIHtcclxuICAgIGNvbnN0IGxpbnRlciA9IHJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogXCJjI1wiIH0pO1xyXG4gICAgZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgbGludGVyLFxyXG4gICAgICAgIE9tbmkuZGlhZ25vc3RpY3NcclxuICAgICAgICAgICAgLnN1YnNjcmliZShkaWFnbm9zdGljcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlczogTGludGVyTWVzc2FnZVtdID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGRpYWdub3N0aWNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3dIaWRkZW5EaWFnbm9zdGljcyB8fCBpdGVtLkxvZ0xldmVsICE9PSBcIkhpZGRlblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWFwSW5kaWVWYWx1ZXMoaXRlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsaW50ZXIuc2V0TWVzc2FnZXMobWVzc2FnZXMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgKTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgT21uaSB9IGZyb20gXCIuLi9zZXJ2ZXIvb21uaVwiO1xuY29uc3QgUmFuZ2UgPSByZXF1aXJlKFwiYXRvbVwiKS5SYW5nZTtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwib21uaXNoYXJwLWNsaWVudFwiO1xuZnVuY3Rpb24gbWFwSW5kaWVWYWx1ZXMoZXJyb3IpIHtcbiAgICBjb25zdCBsZXZlbCA9IGVycm9yLkxvZ0xldmVsLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogbGV2ZWwsXG4gICAgICAgIHRleHQ6IGAke2Vycm9yLlRleHR9IFske09tbmkuZ2V0RnJhbWV3b3JrcyhlcnJvci5Qcm9qZWN0cyl9XSBgLFxuICAgICAgICBmaWxlUGF0aDogZXJyb3IuRmlsZU5hbWUsXG4gICAgICAgIHJhbmdlOiBuZXcgUmFuZ2UoW2Vycm9yLkxpbmUsIGVycm9yLkNvbHVtbl0sIFtlcnJvci5FbmRMaW5lLCBlcnJvci5FbmRDb2x1bW5dKVxuICAgIH07XG59XG5mdW5jdGlvbiBzaG93TGludGVyKCkge1xuICAgIF8uZWFjaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibGludGVyLWJvdHRvbS10YWJcIiksIChlbGVtZW50KSA9PiBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiKTtcbiAgICBfLmVhY2goZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImxpbnRlci1ib3R0b20tc3RhdHVzXCIpLCAoZWxlbWVudCkgPT4gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJcIik7XG4gICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGludGVyLXBhbmVsXCIpO1xuICAgIGlmIChwYW5lbClcbiAgICAgICAgcGFuZWwuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG59XG5mdW5jdGlvbiBoaWRlTGludGVyKCkge1xuICAgIF8uZWFjaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibGludGVyLWJvdHRvbS10YWJcIiksIChlbGVtZW50KSA9PiBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIik7XG4gICAgXy5lYWNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaW50ZXItYm90dG9tLXN0YXR1c1wiKSwgKGVsZW1lbnQpID0+IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKTtcbiAgICBjb25zdCBwYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsaW50ZXItcGFuZWxcIik7XG4gICAgaWYgKHBhbmVsKVxuICAgICAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5sZXQgc2hvd0hpZGRlbkRpYWdub3N0aWNzID0gdHJ1ZTtcbmV4cG9ydCBmdW5jdGlvbiBpbml0KGxpbnRlcikge1xuICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGxldCBjZDtcbiAgICBkaXNwb3NhYmxlLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFwib21uaXNoYXJwLWF0b20uaGlkZUxpbnRlckludGVyZmFjZVwiLCBoaWRkZW4gPT4ge1xuICAgICAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgICAgICBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICAgICAgICBkaXNwb3NhYmxlLmFkZChjZCk7XG4gICAgICAgICAgICBjZC5hZGQoT21uaS5hY3RpdmVFZGl0b3JcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHogPT4gIXopXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShzaG93TGludGVyKSk7XG4gICAgICAgICAgICBjZC5hZGQoT21uaS5hY3RpdmVFZGl0b3JcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHogPT4gISF6KVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoaGlkZUxpbnRlcikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNkKSB7XG4gICAgICAgICAgICAgICAgZGlzcG9zYWJsZS5yZW1vdmUoY2QpO1xuICAgICAgICAgICAgICAgIGNkLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3dMaW50ZXIoKTtcbiAgICAgICAgfVxuICAgIH0pKTtcbiAgICBkaXNwb3NhYmxlLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFwib21uaXNoYXJwLWF0b20uc2hvd0hpZGRlbkRpYWdub3N0aWNzXCIsIHNob3cgPT4ge1xuICAgICAgICBzaG93SGlkZGVuRGlhZ25vc3RpY3MgPSBzaG93O1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goKGVkaXRvcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWRpdG9yTGludGVyID0gbGludGVyLmdldEVkaXRvckxpbnRlcihlZGl0b3IpO1xuICAgICAgICAgICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgICAgICAgICAgIGVkaXRvckxpbnRlci5saW50KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KSk7XG4gICAgZGlzcG9zYWJsZS5hZGQoT21uaS5hY3RpdmVFZGl0b3IuZmlsdGVyKHogPT4gISF6KS50YWtlKDEpLmRlbGF5KDEwMDApLnN1YnNjcmliZSgoZSkgPT4ge1xuICAgICAgICBPbW5pLndoZW5FZGl0b3JDb25uZWN0ZWQoZSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCgoZWRpdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWRpdG9yTGludGVyID0gbGludGVyLmdldEVkaXRvckxpbnRlcihlZGl0b3IpO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yTGludGVyLmxpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pKTtcbiAgICByZXR1cm4gZGlzcG9zYWJsZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckluZGllKHJlZ2lzdHJ5LCBkaXNwb3NhYmxlKSB7XG4gICAgY29uc3QgbGludGVyID0gcmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiBcImMjXCIgfSk7XG4gICAgZGlzcG9zYWJsZS5hZGQobGludGVyLCBPbW5pLmRpYWdub3N0aWNzXG4gICAgICAgIC5zdWJzY3JpYmUoZGlhZ25vc3RpY3MgPT4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGRpYWdub3N0aWNzKSB7XG4gICAgICAgICAgICBpZiAoc2hvd0hpZGRlbkRpYWdub3N0aWNzIHx8IGl0ZW0uTG9nTGV2ZWwgIT09IFwiSGlkZGVuXCIpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG1hcEluZGllVmFsdWVzKGl0ZW0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsaW50ZXIuc2V0TWVzc2FnZXMobWVzc2FnZXMpO1xuICAgIH0pKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==