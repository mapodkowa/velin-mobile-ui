import {ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, ViewContainerRef} from '@angular/core';
import {Modals} from '../models/modal/modals';
import {UpdateComponent} from '../components/update/update.component';
import {CastComponent} from '../components/cast/cast.component';
import {ContextMenuComponent} from '../components/context-menu/context-menu.component';
import {PlayerComponent} from '../components/player/player.component';
import {BridgeService} from './bridge/bridge.service';
import {ModalAction} from '../models/modal/modal-action';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private closeEvent: EventEmitter<void>;
    private rootViewContainer: ViewContainerRef;

    private castComponentRef: ComponentRef<CastComponent>;
    private contextMenuComponentRef: ComponentRef<ContextMenuComponent>;
    private playerComponentRef: ComponentRef<PlayerComponent>;
    private updateComponentRef: ComponentRef<UpdateComponent>;

    public allModals: Modals[] = [
        Modals.UPDATE,
        Modals.CAST,
        Modals.CONTEXT_MENU,
        Modals.PLAYER
    ];

    constructor(
        private factoryResolver: ComponentFactoryResolver,
        private bridge: BridgeService
    ) {
        this.bridge.onMessage.subscribe(msg => {
            if (msg.channel !== 'modal') {
                return;
            }

            if (msg.object === ModalAction.CLOSE) {
                this.onBackClick();
            }
        });
    }

    public open(modal: Modals, preInsert?: (ref: ComponentRef<any>) => void): void {
        let factory: ComponentFactory<any>;

        switch (modal) {
            case Modals.CAST:
                factory = this.factoryResolver.resolveComponentFactory(CastComponent);
                this.castComponentRef = factory.create(this.rootViewContainer.injector);
                break;
            case Modals.CONTEXT_MENU:
                factory = this.factoryResolver.resolveComponentFactory(ContextMenuComponent);
                this.contextMenuComponentRef = factory.create(this.rootViewContainer.injector);
                break;
            case Modals.PLAYER:
                factory = this.factoryResolver.resolveComponentFactory(PlayerComponent);
                this.playerComponentRef = factory.create(this.rootViewContainer.injector);
                break;
            case Modals.UPDATE:
                factory = this.factoryResolver.resolveComponentFactory(UpdateComponent);
                this.updateComponentRef = factory.create(this.rootViewContainer.injector);
                break;
        }

        const componentRef = this.getComponentRef(modal);
        this.closeEvent = new EventEmitter<void>();
        this.closeEvent.subscribe(() => this.close(modal));
        componentRef.instance.close = this.closeEvent;

        if (preInsert) {
            preInsert(componentRef);
        }

        this.rootViewContainer.insert(componentRef.hostView);
        this.bridge.app.setAnyModalOpen(true);
    }

    public close(modal: Modals): void {
        const ref = this.getComponentRef(modal);
        if (ref) {
            ref.destroy();
        }

        switch (modal) {
            case Modals.CAST:
                this.castComponentRef = undefined;
                break;
            case Modals.CONTEXT_MENU:
                this.contextMenuComponentRef = undefined;
                break;
            case Modals.PLAYER:
                this.playerComponentRef = undefined;
                break;
            case Modals.UPDATE:
                this.updateComponentRef = undefined;
                break;
        }

        if (this.areAllModalsClosed()) {
            this.bridge.app.setAnyModalOpen(false);
        }
    }

    public isOpen(modal: Modals): boolean {
        const ref = this.getComponentRef(modal);
        return ref !== undefined;
    }

    public setRootViewContainerRef(viewContainerRef: ViewContainerRef): void {
        this.rootViewContainer = viewContainerRef;
    }

    public onBackClick(): boolean {
        for (const modal of this.allModals) {
            if (this.isOpen(modal)) {
                this.close(modal);
                return false;
            }
        }

        return true;
    }

    private areAllModalsClosed(): boolean {
        let isAnyOpen = false;
        for (const modal of this.allModals) {
            if (this.isOpen(modal)) {
                isAnyOpen = true;
                break;
            }
        }
        return !isAnyOpen;
    }

    private getComponentRef(modal: Modals): ComponentRef<any> {
        switch (modal) {
            case Modals.CAST:
                return this.castComponentRef;
            case Modals.CONTEXT_MENU:
                return this.contextMenuComponentRef;
            case Modals.PLAYER:
                return this.playerComponentRef;
            case Modals.UPDATE:
                return this.updateComponentRef;
        }
    }
}
