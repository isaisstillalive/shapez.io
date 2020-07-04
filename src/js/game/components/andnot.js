import { gItemRegistry } from "../../core/global_registries";
import { types } from "../../savegame/serialization";
import { Component } from "../component";
import { BaseItem } from "../base_item";

export class AndnotComponent extends Component {
    static getId() {
        return "Andnot";
    }

    static getSchema() {
        return {
            item: types.nullable(types.obj(gItemRegistry)),
            blocking: types.float,
            interval: types.float,
        };
    }

    duplicateWithoutContents() {
        return new AndnotComponent({});
    }

    /**
     *
     * @param {object} param0
     *
     */
    constructor({}) {
        super();

        /** @type {BaseItem} */
        this.item = null;

        /** @type {number} */
        this.blocking = 0;

        /** @type {number} */
        this.interval = 0;
    }

    /**
     * Tries to take the item
     * @param {BaseItem} item
     * @param {number} slot
     */
    tryTakeItem(item, slot) {
        if (slot == 1) {
            this.blocking = this.interval;
            this.interval = 1;
            return true;
        }

        if (this.item) {
            return false;
        }

        this.item = item;
        return true;
    }
}
