import {CompositeDisposable, Disposable} from "rx";
const _ : _.LoDashStatic = require("lodash");
import {SolutionStatusCard, ICardProps} from "../views/solution-status-view";
import {SolutionManager} from "../server/solution-manager";
import {DriverState} from "omnisharp-client";
import * as React from "react";

class SolutionInformation implements IFeature {
    private disposable: CompositeDisposable;
    public selectedIndex: number = 0;
    private card: SolutionStatusCard<ICardProps>;
    private cardDisposable: Disposable;
    private container: Element;

    public activate() {
        this.disposable = new CompositeDisposable();

        this.disposable.add(SolutionManager.activeSolution.subscribe(sln => {
            this.selectedIndex = _.findIndex(SolutionManager.activeSolutions, { index: sln.model.index });
            this.updateSelectedItem(this.selectedIndex);
        }));

        this.disposable.add(atom.commands.add("atom-workspace", "omnisharp-atom:next-solution-status", () => {
            this.updateSelectedItem(this.selectedIndex + 1);
        }));

        this.disposable.add(atom.commands.add("atom-workspace", "omnisharp-atom:solution-status", () => {
            if (this.cardDisposable) {
                this.cardDisposable.dispose();
            } else {
                this.cardDisposable = this.createSolutionCard();
            }
        }));

        this.disposable.add(atom.commands.add("atom-workspace", "omnisharp-atom:previous-solution-status", () => {
            this.updateSelectedItem(this.selectedIndex - 1);
        }));

        this.disposable.add(atom.commands.add("atom-workspace", "omnisharp-atom:stop-server", () => {
            SolutionManager.activeSolutions[this.selectedIndex].dispose();
        }));

        this.disposable.add(atom.commands.add("atom-workspace", "omnisharp-atom:start-server", () => {
            SolutionManager.activeSolutions[this.selectedIndex].connect();
        }));

        this.disposable.add(atom.commands.add("atom-workspace", "omnisharp-atom:restart-server", () => {
            const solution = SolutionManager.activeSolutions[this.selectedIndex];
            solution.state
                .where(z => z === DriverState.Disconnected)
                .take(1)
                .delay(500)
                .subscribe(() => {
                    solution.connect();
                });
            solution.dispose();
        }));
    }

    private updateSelectedItem(index: number) {
        if (index < 0)
            index = SolutionManager.activeSolutions.length - 1;
        if (index >= SolutionManager.activeSolutions.length)
            index = 0;
        if (this.selectedIndex !== index)
            this.selectedIndex = index;

        if (this.card) {
            this.card.updateCard({
                model: SolutionManager.activeSolutions[this.selectedIndex].model,
                count: SolutionManager.activeSolutions.length
            });
        }
    }

    private createSolutionCard() {
        const disposable = new CompositeDisposable();
        this.disposable.add(disposable);
        const workspace = <any>atom.views.getView(atom.workspace);
        if (!this.container) {
            const container = this.container = document.createElement("div");
            workspace.appendChild(container);
        }

        let notice: any;
        if (SolutionManager.activeSolutions.length) {
            const element: SolutionStatusCard<ICardProps> = <any>React.render(React.createElement(SolutionStatusCard, {
                model: SolutionManager.activeSolutions[this.selectedIndex].model,
                count: SolutionManager.activeSolutions.length,
                attachTo: ".projects-icon"
            }), this.container);

            this.card = element;

            disposable.add(atom.commands.add("atom-workspace", "core:cancel", () => {
                disposable.dispose();
                this.disposable.remove(disposable);
            }));

            disposable.add(Disposable.create(() => {
                React.unmountComponentAtNode(this.container);
                this.card = null;
                this.cardDisposable = null;
            }));
        } else {
            if (this.cardDisposable) {
                this.cardDisposable.dispose();
            }

            notice = <any>React.render(React.DOM.div({}, "Solution not loaded!"), this.container);

            disposable.add(Disposable.create(() => {
                React.unmountComponentAtNode(this.container);
                this.card = null;
                this.cardDisposable = null;
            }));

        }

        return disposable;
    }

    public dispose() {
        this.disposable.dispose();
    }

    public required = true;
    public title = "Solution Information";
    public description = "Monitors each running solution and offers the ability to start/restart/stop a solution.";
}

export const solutionInformation = new SolutionInformation;